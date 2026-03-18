import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")

def send_reset_password_email(to_email: str, token: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"SMTP not fully configured securely. Mock sending secure reset token to {to_email}: {token}")
        return True
        
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset Your Password - HireSkillAI"
    msg["From"] = SMTP_USER
    msg["To"] = to_email

    text = f"You requested a password reset. Click the following link to securely rest your active password:\n\n{reset_link}\n\nThis safe contextual hyperlink securely expires dynamically in 15 minutes."
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 25px; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; text-align: center;">
            <h2 style="color: #2b6cb0;">Password Reset Request</h2>
            <p>We received a prompt explicitly requesting a password reset mapping for HireSkillAI.</p>
            <p>Please click the button mapped below to safely establish a new secure password instance:</p>
            <a href="{reset_link}" style="display: inline-block; padding: 14px 28px; margin: 25px 0; background-color: #6ee7b7; color: #064e3b; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
            <p style="font-size: 12px; color: #777;">This dynamic URL structurally expires safely in exactly 15 minutes. If you did not physically trigger this prompt request originally, you may safely ignore this email.</p>
        </div>
      </body>
    </html>
    """
    
    msg.attach(MIMEText(text, "plain"))
    msg.attach(MIMEText(html, "html"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to securely push SMTP execution email gracefully: {e}")
        return False
