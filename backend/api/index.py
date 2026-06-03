"""
AMPLE.AI Backend API — Vercel Serverless (FastAPI)
Handles trial signups, feedback submissions, and test agent requests.
All data is persisted to Supabase.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
import json
from datetime import datetime

app = FastAPI(
    title="AMPLE.AI API",
    description="Backend API for the AMPLE.AI landing page",
    version="1.0.0"
)

# --- CORS Configuration ---
# Allow the Netlify frontend origin (update after deployment)
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5500,http://127.0.0.1:5500").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Supabase Client ---
# Lazy-initialized so the app still works locally without Supabase
_supabase_client = None

def get_supabase():
    global _supabase_client
    if _supabase_client is None:
        try:
            from supabase import create_client
            url = os.environ.get("SUPABASE_URL")
            key = os.environ.get("SUPABASE_SERVICE_KEY")
            if url and key:
                _supabase_client = create_client(url, key)
        except ImportError:
            pass
    return _supabase_client


# --- Pydantic Models ---
class TrialSignup(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    company: str
    industry: str
    message: Optional[str] = None

class FeedbackSubmission(BaseModel):
    score: int
    comment: Optional[str] = None

class TestAgentRequest(BaseModel):
    first_name: str
    email: str
    phone: str
    country_code: Optional[str] = "+91"

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str


# --- API Endpoints ---

@app.get("/api")
def root():
    return {
        "status": "online",
        "service": "AMPLE.AI API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/health")
def health_check():
    supabase = get_supabase()
    return {
        "status": "healthy",
        "supabase_connected": supabase is not None,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/trial-signup")
async def trial_signup(data: TrialSignup):
    """Handle free trial form submissions."""
    supabase = get_supabase()
    
    record = {
        "first_name": data.first_name,
        "last_name": data.last_name,
        "email": data.email,
        "phone": data.phone,
        "company": data.company,
        "industry": data.industry,
        "message": data.message,
        "created_at": datetime.utcnow().isoformat()
    }
    
    if supabase:
        try:
            result = supabase.table("trial_signups").insert(record).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {
        "success": True,
        "message": "Trial signup received! We'll contact you within 24 hours.",
        "data": {"email": data.email}
    }

@app.post("/api/feedback")
async def submit_feedback(data: FeedbackSubmission):
    """Handle NPS feedback submissions."""
    if not 1 <= data.score <= 10:
        raise HTTPException(status_code=400, detail="Score must be between 1 and 10.")
    
    supabase = get_supabase()
    
    record = {
        "score": data.score,
        "comment": data.comment,
        "created_at": datetime.utcnow().isoformat()
    }
    
    if supabase:
        try:
            supabase.table("feedback").insert(record).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {
        "success": True,
        "message": "Thank you for your feedback!"
    }

@app.post("/api/test-agent")
async def test_agent(data: TestAgentRequest):
    """Handle 'Test the Agent' form submissions."""
    supabase = get_supabase()
    
    record = {
        "first_name": data.first_name,
        "email": data.email,
        "phone": f"{data.country_code}{data.phone}",
        "created_at": datetime.utcnow().isoformat()
    }
    
    if supabase:
        try:
            supabase.table("test_agent_requests").insert(record).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {
        "success": True,
        "message": "Our AI agent will call you within 60 seconds!"
    }

@app.post("/api/contact")
async def contact(data: ContactRequest):
    """Handle general contact form submissions."""
    supabase = get_supabase()
    
    record = {
        "name": data.name,
        "email": data.email,
        "message": data.message,
        "created_at": datetime.utcnow().isoformat()
    }
    
    if supabase:
        try:
            supabase.table("contact_requests").insert(record).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {
        "success": True,
        "message": "Message received! We'll get back to you soon."
    }
