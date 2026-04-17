import os
from datetime import timedelta
from urllib.parse import urlencode, urlparse
import urllib.parse

import httpx
import requests
from dotenv import load_dotenv, dotenv_values
from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session

import models
from database import get_db
from utils.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token

# Ensure we load the same backend/.env that main.py uses
_BACKEND_DIR = os.path.dirname(os.path.dirname(__file__))
_DOTENV_PATH = os.path.join(_BACKEND_DIR, ".env")
load_dotenv(_DOTENV_PATH, override=True)

router = APIRouter()

def get_clean_env(key: str) -> str:
    file_vals = dotenv_values(_DOTENV_PATH)
    val = file_vals.get(key) or os.environ.get(key, "")
    val = val.replace('\n', '').replace('\r', '').replace(' ', '')
    return val.strip('"\'-')

def _extract_origin(url_value: str) -> str:
    if not url_value:
        return ""
    parsed = urlparse(url_value)
    if parsed.scheme and parsed.netloc:
        return f"{parsed.scheme}://{parsed.netloc}"
    return ""

def _is_local_origin(origin: str) -> bool:
    return origin.startswith("http://localhost:") or origin.startswith("http://127.0.0.1:")

def get_frontend_url(request: Request | None = None) -> str:
    configured = get_clean_env("FRONTEND_URL").rstrip("/")
    if request:
        origin = request.headers.get("origin", "")
        referer_origin = _extract_origin(request.headers.get("referer", ""))
        local_origin = origin if _is_local_origin(origin) else (
            referer_origin if _is_local_origin(referer_origin) else ""
        )
        if local_origin:
            return local_origin
    return configured or "http://localhost:5173"

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
    frontend_url = get_frontend_url(request)
    is_json_request = "application/json" in request.headers.get("accept", "")
    payload = {"error": error, "detail": detail}
    if is_json_request:
        return JSONResponse(status_code=status_code, content=payload)
    return RedirectResponse(url=f"{frontend_url}/login?error={redirect_error}")

@router.get("/google/login")
async def google_login(request: Request):
    google_client_id = get_clean_env("GOOGLE_CLIENT_ID")
    if not google_client_id:
        frontend_url = get_frontend_url(request)
        return RedirectResponse(url=f"{frontend_url}/login?error=google_not_configured")

    redirect_uri = f"{get_backend_base_url(request)}/auth/google/callback"
    request.session["oauth_frontend_url_google"] = get_frontend_url(request)

    params = {
        "client_id": google_client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    print(url)
    return RedirectResponse(url)

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    frontend_url = request.session.pop("oauth_frontend_url_google", None) or get_frontend_url(request)
    google_client_id = get_clean_env("GOOGLE_CLIENT_ID")
    google_client_secret = get_clean_env("GOOGLE_CLIENT_SECRET")
    if not google_client_id or not google_client_secret:
        return missing_provider_response(request, "google")

    code = request.query_params.get("code")
    if not code:
        return auth_error_response(
            request,
            status_code=401,
            error="oauth_failed",
            detail="Auth failed",
            redirect_error="oauth_failed",
        )

    redirect_uri = f"{get_backend_base_url(request)}/auth/google/callback"
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            token_res = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": google_client_id,
                    "client_secret": google_client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                },
                headers={"Accept": "application/json"},
            )
            token_res.raise_for_status()
            token_data = token_res.json()
            access_token = token_data.get("access_token")
            if not access_token:
                raise ValueError("missing_google_access_token")

            user_res = await client.get(
                "https://openidconnect.googleapis.com/v1/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            user_res.raise_for_status()
            user_info = user_res.json()
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
async def github_login():
    github_client_id = get_clean_env("GITHUB_CLIENT_ID")
    if not github_client_id:
        return {"error": "GitHub not configured"}

    redirect_uri = "http://localhost:8000/auth/github/callback"
    params = {
        "client_id": github_client_id,
        "redirect_uri": redirect_uri,
        "scope": "user",
    }
    github_url = "https://github.com/login/oauth/authorize?" + urllib.parse.urlencode(params)
    print("Redirecting to:", github_url)
    return RedirectResponse(github_url)

@router.get("/github/callback")
def github_callback(request: Request, db: Session = Depends(get_db)):
    code = request.query_params.get("code")
    if not code:
        return {"error": "No code received"}

    github_client_id = get_clean_env("GITHUB_CLIENT_ID")
    github_client_secret = get_clean_env("GITHUB_CLIENT_SECRET")
    if not github_client_id or not github_client_secret:
        return {"error": "GitHub not configured"}

    token_url = "https://github.com/login/oauth/access_token"
    data = {
        "client_id": github_client_id,
        "client_secret": github_client_secret,
        "code": code,
        "redirect_uri": "http://localhost:8000/auth/github/callback",
    }
    headers = {"Accept": "application/json"}

    try:
        response = requests.post(token_url, data=data, headers=headers, timeout=20)
        token_json = response.json()
    except Exception as exc:
        return {"error": "Token exchange failed", "details": str(exc)}

    access_token = token_json.get("access_token")
    if not access_token:
        return {"error": "Failed to get access token", "details": token_json}

    try:
        user_response = requests.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"},
            timeout=20,
        )
        user_data = user_response.json()
    except Exception as exc:
        return {"error": "Failed to fetch user data", "details": str(exc)}

    email = user_data.get("email")
    if not email:
        try:
            emails_response = requests.get(
                "https://api.github.com/user/emails",
                headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"},
                timeout=20,
            )
            emails_data = emails_response.json() if emails_response.ok else []
            primary = next((item.get("email") for item in emails_data if item.get("primary")), None)
            email = primary or (emails_data[0].get("email") if emails_data else None)
        except Exception:
            email = None

    if not email:
        return {"error": "Email not available from GitHub"}

    name = user_data.get("name") or user_data.get("login") or "GitHub User"
    avatar = user_data.get("avatar_url", "")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(fullname=name, email=email, hashed_password=None)
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    app_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    frontend_url = get_frontend_url(request)
    query = urlencode({
        "token": app_token,
        "email": user.email,
        "name": user.fullname or name,
        "avatar": avatar,
    })
    return RedirectResponse(f"{frontend_url}/oauth-success?{query}")
