from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import models
from database import get_db
from utils.token import create_password_reset_token, verify_password_reset_token
from services.email_service import send_reset_password_email
from utils.security import get_password_hash

router = APIRouter()

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if user:
        token = create_password_reset_token(user.email)
        send_reset_password_email(user.email, token)
        
    # We deliberately respond equivalently generically even if null structurally to securely prevent blind SMTP user enumeration attacks
    return {"message": "If that email legitimately tracks within our platform securely, a native password reset link has been dispatched comprehensively."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_password_reset_token(req.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The dynamic reset token generated originally is either corrupt mathematically or has actively expired."
        )
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target identification index no longer validly exists."
        )
        
    hashed_password = get_password_hash(req.new_password)
    user.hashed_password = hashed_password
    db.commit()
    
    return {"message": "Password natively reset successfully! Proceed directly to Login."}
