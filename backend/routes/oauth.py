import os
from urllib.parse import urlencode
from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth, OAuthError

import models
from database import get_db
from utils.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
oauth = OAuth()

def get_clean_env(key: str) -> str:
    val = os.environ.get(key, "")
    val = val.replace('\n', '').replace('\r', '').replace(' ', '')
    return val.strip('"\'-')

def get_frontend_url() -> str:
    return get_clean_env("FRONTEND_URL").rstrip("/") or "http://localhost:5173"

def get_backend_base_url(request: Request) -> str:
    base_url = str(request.base_url).rstrip("/")
    # Render terminates TLS at the LB, so upstream may look like http://.
    if ".onrender.com" in base_url and base_url.startswith("http://"):
        base_url = base_url.replace("http://", "https://")
    return base_url

_google_id = get_clean_env("GOOGLE_CLIENT_ID")
_google_secret = get_clean_env("GOOGLE_CLIENT_SECRET")
if _google_id and _google_secret:
    oauth.register(
        name="google",
        client_id=_google_id,
        client_secret=_google_secret,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )

@router.get("/google/login")
async def google_login(request: Request):
    frontend_url = get_frontend_url()
    client = oauth.create_client("google")
    if not client:
        return RedirectResponse(url=f"{frontend_url}/login?error=google_not_configured")

    redirect_uri = f"{get_backend_base_url(request)}/auth/google/callback"
    try:
        return await client.authorize_redirect(request, redirect_uri)
    except Exception:
        return RedirectResponse(url=f"{frontend_url}/login?error=oauth_redirect_failed")

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    frontend_url = get_frontend_url()
    client = oauth.create_client("google")
    if not client:
        return RedirectResponse(url=f"{frontend_url}/login?error=google_not_configured")

    try:
        token = await client.authorize_access_token(request)
        user_info = token.get("userinfo") or await client.userinfo(token=token)
    except OAuthError:
        return RedirectResponse(url=f"{frontend_url}/login?error=oauth_failed")
    except Exception:
        return RedirectResponse(url=f"{frontend_url}/login?error=oauth_failed")

    email = user_info.get("email")
    name = user_info.get("name") or user_info.get("given_name") or "Google User"

    if not email:
        return RedirectResponse(url=f"{frontend_url}/login?error=missing_email")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(fullname=name, email=email, hashed_password=None)
        db.add(user)
        db.commit()
        db.refresh(user)
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    query = urlencode({
        "token": access_token,
        "email": user.email,
        "name": user.fullname or name,
    })
    redirect_url = f"{frontend_url}/oauth-success?{query}"
    return RedirectResponse(url=redirect_url)
