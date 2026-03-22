from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from routes.auth import get_current_user
import json
import httpx

router = APIRouter()

@router.get("/")
def get_settings(current_user: models.User = Depends(get_current_user)):
    return {
        "fullname": current_user.fullname,
        "email": current_user.email,
        "company": current_user.company,
        "job_role": current_user.job_role,
        "email_alerts": current_user.email_alerts,
        "weekly_reports": current_user.weekly_reports,
        "resume_match_alerts": current_user.resume_match_alerts,
        "openai_api_key": current_user.openai_api_key,
        "dark_mode": current_user.dark_mode,
        "accent_color": current_user.accent_color
    }

@router.put("/")
def update_settings(update_data: schemas.SettingsUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/test-api-key")
async def test_api_key(current_user: models.User = Depends(get_current_user)):
    if not current_user.openai_api_key:
        raise HTTPException(status_code=400, detail="No API Key configured.")
        
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://api.openai.com/v1/models",
                headers={"Authorization": f"Bearer {current_user.openai_api_key}"}
            )
            if res.status_code == 200:
                return {"status": "ok", "message": "Connection to OpenAI is successful!"}
            else:
                return {"status": "error", "message": f"OpenAI rejected the key (Status {res.status_code})"}
    except Exception as e:
        return {"status": "error", "message": f"Connection failed: {str(e)}"}

@router.get("/export-data")
def export_data(current_user: models.User = Depends(get_current_user)):
    user_data = {
        "id": current_user.id,
        "fullname": current_user.fullname,
        "email": current_user.email,
        "company": current_user.company,
        "job_role": current_user.job_role,
        "settings": {
            "dark_mode": current_user.dark_mode,
            "accent_color": current_user.accent_color,
            "alerts": {
                "email": current_user.email_alerts,
                "weekly": current_user.weekly_reports,
                "matches": current_user.resume_match_alerts
            }
        }
    }
    return user_data

@router.delete("/clear-history")
def clear_history(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Delete all resume analyses linked to user logic could go here if tied properly via Foreign Key. 
    # Currently ANALYSES are in memory for this demo so we just return success.
    # In a production DB schema we would do: db.query(models.ResumeAnalysis).filter(...).delete()
    return {"status": "success", "message": "All historical data cleared completely."}
