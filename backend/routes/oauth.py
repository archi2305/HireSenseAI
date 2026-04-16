import os
from urllib.parse import urlencode
from fastapi import APIRouter, Depends, Request
from fastapi.responses import RedirectResponse, JSONResponse
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

def missing_provider_response(request: Request, provider: str):
    return auth_error_response(
        request,
        status_code=503,
        error="missing_configuration",
        detail=f"{provider} OAuth is not configured",
        redirect_error=f"{provider}_not_configured",
    )

def auth_error_response(
    request: Request,
    status_code: int,
    error: str,
    detail: str,
    redirect_error: str,
):
    frontend_url = get_frontend_url()
    is_json_request = "application/json" in request.headers.get("accept", "")
    payload = {"error": error, "detail": detail}
    if is_json_request:
        return JSONResponse(status_code=status_code, content=payload)
    return RedirectResponse(url=f"{frontend_url}/login?error={redirect_error}")

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

_github_id = get_clean_env("GITHUB_CLIENT_ID")
_github_secret = get_clean_env("GITHUB_CLIENT_SECRET")
if _github_id and _github_secret:
    oauth.register(
        name="github",
        client_id=_github_id,
        client_secret=_github_secret,
        access_token_url="https://github.com/login/oauth/access_token",
        access_token_params=None,
        authorize_url="https://github.com/login/oauth/authorize",
        authorize_params=None,
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "user:email"},
    )

@router.get("/google/login")
async def google_login(request: Request):
    client = oauth.create_client("google")
    if not client:
        return missing_provider_response(request, "google")

    redirect_uri = f"{get_backend_base_url(request)}/auth/google/callback"
    try:
        return await client.authorize_redirect(request, redirect_uri)
    except Exception:
        return auth_error_response(
            request,
            status_code=502,
            error="oauth_redirect_failed",
            detail="Could not start OAuth redirect flow",
            redirect_error="oauth_redirect_failed",
        )

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    frontend_url = get_frontend_url()
    client = oauth.create_client("google")
    if not client:
        return missing_provider_response(request, "google")

    try:
        token = await client.authorize_access_token(request)
        user_info = token.get("userinfo") or await client.userinfo(token=token)
    except OAuthError:
        return auth_error_response(
            request,
            status_code=401,
            error="oauth_failed",
            detail="Auth failed",
            redirect_error="oauth_failed",
        )
    except Exception:
        return auth_error_response(
            request,
            status_code=401,
            error="oauth_failed",
            detail="Auth failed",
            redirect_error="oauth_failed",
        )

    email = user_info.get("email")
    name = user_info.get("name") or user_info.get("given_name") or "Google User"

    if not email:
        return auth_error_response(
            request,
            status_code=400,
            error="missing_email",
            detail="Email is not available from social provider",
            redirect_error="missing_email",
        )

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

@router.get("/github/login")
async def github_login(request: Request):
    frontend_url = get_frontend_url()
    client = oauth.create_client("github")
    if not client:
        return missing_provider_response(request, "github")

    redirect_uri = f"{get_backend_base_url(request)}/auth/github/callback"
    try:
        return await client.authorize_redirect(request, redirect_uri)
    except Exception:
        return auth_error_response(
            request,
            status_code=502,
            error="oauth_redirect_failed",
            detail="Could not start OAuth redirect flow",
            redirect_error="oauth_redirect_failed",
        )

@router.get("/github/callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    frontend_url = get_frontend_url()
    client = oauth.create_client("github")
    if not client:
        return missing_provider_response(request, "github")

    try:
        token = await client.authorize_access_token(request)
        resp = await client.get("user", token=token)
        user_info = resp.json()
    except OAuthError:
        return auth_error_response(
            request,
            status_code=401,
            error="oauth_failed",
            detail="Auth failed",
            redirect_error="oauth_failed",
        )
    except Exception:
        return auth_error_response(
            request,
            status_code=401,
            error="oauth_failed",
            detail="Auth failed",
            redirect_error="oauth_failed",
        )

    email = user_info.get("email")
    name = user_info.get("name") or user_info.get("login") or "GitHub User"
    if not email:
        try:
            resp_emails = await client.get("user/emails", token=token)
            emails = resp_emails.json()
            primary_email = next((e.get("email") for e in emails if e.get("primary")), None)
            email = primary_email or (emails[0].get("email") if emails else None)
        except Exception:
            email = None

    if not email:
        return auth_error_response(
            request,
            status_code=400,
            error="missing_email",
            detail="Email is not available from social provider",
            redirect_error="missing_email",
        )

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
