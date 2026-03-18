import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")

def send_reset_password_email(to_email: str, token: str):
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    
    print("\n" + "="*60)
    print("🔒 MOCK SMTP PASSWORD RESET")
    print(f"Target Delivery: {to_email}")
    print(f"Action Token Link: {reset_link}")
    print("="*60 + "\n")
    
    return True
