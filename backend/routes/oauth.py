import os
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth, OAuthError

import models
from database import get_db
from utils.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter()
oauth = OAuth()

# Google config
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=os.environ.get("GOOGLE_CLIENT_ID", ""),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET", ""),
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# GitHub config
oauth.register(
    name='github',
    client_id=os.environ.get("GITHUB_CLIENT_ID", ""),
    client_secret=os.environ.get("GITHUB_CLIENT_SECRET", ""),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'},
)

FRONTEND_URL = "http://localhost:5173"

@router.get("/{provider}/login")
async def login(request: Request, provider: str):
    client = oauth.create_client(provider)
    if not client:
        raise HTTPException(status_code=404, detail="Provider not supported")
    redirect_uri = f"http://127.0.0.1:8000/api/oauth/{provider}/callback"
    return await client.authorize_redirect(request, redirect_uri)

@router.get("/{provider}/callback")
async def auth_via_provider(request: Request, provider: str, db: Session = Depends(get_db)):
    client = oauth.create_client(provider)
    if not client:
        raise HTTPException(status_code=404, detail="Provider not supported")
        
    try:
        token = await client.authorize_access_token(request)
    except OAuthError as error:
        return RedirectResponse(url=f"{FRONTEND_URL}/login?error=oauth_failed")

    if provider == "google":
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(status_code=400, detail="Missing user info")
        email = user_info.get("email")
        name = user_info.get("name")
    elif provider == "github":
        resp = await client.get('user', token=token)
        user_info = resp.json()
        email = user_info.get("email")
        name = user_info.get("name") or user_info.get("login")
        if not email:
            resp_emails = await client.get('user/emails', token=token)
            emails = resp_emails.json()
            primary_email = next((e['email'] for e in emails if e['primary']), None)
            email = primary_email or emails[0]['email']
            
    if not email:
        return RedirectResponse(url=f"{FRONTEND_URL}/login?error=missing_email")

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
    
    redirect_url = f"{FRONTEND_URL}/oauth-success?token={access_token}"
    return RedirectResponse(url=redirect_url)
