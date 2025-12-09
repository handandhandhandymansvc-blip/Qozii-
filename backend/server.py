from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional
import os
import logging
from pathlib import Path
from datetime import datetime
import uuid
import bcrypt

from models import (
    User, UserCreate, UserRole,
    Job, JobCreate, JobStatus,
    Quote, QuoteCreate, QuoteStatus,
    Message, MessageCreate,
    Review, ReviewCreate,
    ProProfile, Payment, PaymentCreate,
    ServiceCategory
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="FixItNow API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper function to hash passwords
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# ============ USER ROUTES ============
@api_router.post("/users/register")
async def register_user(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user_data.dict()
    user_dict["password"] = hash_password(user_dict["password"])
    user_dict["id"] = str(uuid.uuid4())
    user_dict["created_at"] = datetime.utcnow()
    user_dict["is_active"] = True
    
    await db.users.insert_one(user_dict)
    
    # If pro, create pro profile
    if user_data.role == UserRole.PRO:
        pro_profile = {
            "user_id": user_dict["id"],
            "bio": None,
            "services": [],
            "service_areas": [],
            "hourly_rate": None,
            "years_experience": None,
            "portfolio_images": [],
            "certifications": [],
            "background_check_verified": False,
            "weekly_budget": 0.0,
            "weekly_spent": 0.0,
            "budget_active": True,
            "rating": 0.0,
            "total_jobs": 0,
            "created_at": datetime.utcnow()
        }
        await db.pro_profiles.insert_one(pro_profile)
    
    user_dict.pop("password")
    return {"success": True, "user": user_dict}

@api_router.post("/users/login")
async def login_user(email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user.pop("password")
    user["_id"] = str(user["_id"])
    return {"success": True, "user": user}

@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.pop("password", None)
    user["_id"] = str(user["_id"])
    return user

# ============ PRO PROFILE ROUTES ============
@api_router.get("/pros/{user_id}/profile")
async def get_pro_profile(user_id: str):
    profile = await db.pro_profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile["_id"] = str(profile["_id"])
    return profile

@api_router.put("/pros/{user_id}/profile")
async def update_pro_profile(user_id: str, profile_data: dict):
    result = await db.pro_profiles.update_one(
        {"user_id": user_id},
        {"$set": profile_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"success": True}

@api_router.get("/pros/search")
async def search_pros(category: Optional[str] = None, location: Optional[str] = None):
    query = {}
    if category:
        query["services"] = category
    if location:
        query["service_areas"] = {"$regex": location, "$options": "i"}
    
    profiles = await db.pro_profiles.find(query).to_list(100)
    for profile in profiles:
        profile["_id"] = str(profile["_id"])
        # Get user info
        user = await db.users.find_one({"id": profile["user_id"]})
        if user:
            profile["name"] = user["name"]
            profile["phone"] = user["phone"]
    return profiles

# ============ JOB ROUTES ============
@api_router.post("/jobs")
async def create_job(job_data: JobCreate, customer_id: str):
    # Get customer info
    customer = await db.users.find_one({"id": customer_id})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    job_dict = job_data.dict()
    job_dict["id"] = str(uuid.uuid4())
    job_dict["customer_id"] = customer_id
    job_dict["customer_name"] = customer["name"]
    job_dict["customer_phone"] = customer["phone"]
    job_dict["status"] = JobStatus.OPEN
    job_dict["created_at"] = datetime.utcnow()
    job_dict["quotes_count"] = 0
    
    await db.jobs.insert_one(job_dict)
    job_dict["_id"] = str(job_dict["_id"])
    
    logger.info(f"Job created: {job_dict['id']} by customer {customer_id}")
    return {"success": True, "job": job_dict}

@api_router.get("/jobs")
async def get_jobs(
    status: Optional[str] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    customer_id: Optional[str] = None
):
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    if location:
        query["zipcode"] = location
    if customer_id:
        query["customer_id"] = customer_id
    
    jobs = await db.jobs.find(query).sort("created_at", -1).to_list(100)
    for job in jobs:
        job["_id"] = str(job["_id"])
    return jobs

@api_router.get("/jobs/{job_id}")
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    job["_id"] = str(job["_id"])
    return job

@api_router.put("/jobs/{job_id}/status")
async def update_job_status(job_id: str, status: JobStatus):
    result = await db.jobs.update_one(
        {"id": job_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"success": True}

# ============ QUOTE ROUTES ============
@api_router.post("/quotes")
async def create_quote(quote_data: QuoteCreate, pro_id: str):
    # Get pro info
    pro_user = await db.users.find_one({"id": pro_id})
    pro_profile = await db.pro_profiles.find_one({"user_id": pro_id})
    
    if not pro_user or not pro_profile:
        raise HTTPException(status_code=404, detail="Pro not found")
    
    # Check budget
    lead_fee = 10.0  # $10 per lead
    if pro_profile["weekly_spent"] + lead_fee > pro_profile["weekly_budget"]:
        raise HTTPException(status_code=400, detail="Weekly budget exceeded")
    
    quote_dict = quote_data.dict()
    quote_dict["id"] = str(uuid.uuid4())
    quote_dict["pro_id"] = pro_id
    quote_dict["pro_name"] = pro_user["name"]
    quote_dict["pro_phone"] = pro_user["phone"]
    quote_dict["pro_rating"] = pro_profile["rating"]
    quote_dict["status"] = QuoteStatus.PENDING
    quote_dict["created_at"] = datetime.utcnow()
    
    await db.quotes.insert_one(quote_dict)
    
    # Charge lead fee
    await db.pro_profiles.update_one(
        {"user_id": pro_id},
        {"$inc": {"weekly_spent": lead_fee}}
    )
    
    # Update job quotes count
    await db.jobs.update_one(
        {"id": quote_data.job_id},
        {"$inc": {"quotes_count": 1}}
    )
    
    # Log payment
    payment = {
        "id": str(uuid.uuid4()),
        "pro_id": pro_id,
        "amount": lead_fee,
        "payment_type": "lead_fee",
        "job_id": quote_data.job_id,
        "status": "completed",
        "created_at": datetime.utcnow()
    }
    await db.payments.insert_one(payment)
    
    quote_dict["_id"] = str(quote_dict["_id"])
    logger.info(f"Quote created: {quote_dict['id']} by pro {pro_id}, charged ${lead_fee}")
    return {"success": True, "quote": quote_dict}

@api_router.get("/quotes")
async def get_quotes(job_id: Optional[str] = None, pro_id: Optional[str] = None):
    query = {}
    if job_id:
        query["job_id"] = job_id
    if pro_id:
        query["pro_id"] = pro_id
    
    quotes = await db.quotes.find(query).sort("created_at", -1).to_list(100)
    for quote in quotes:
        quote["_id"] = str(quote["_id"])
    return quotes

@api_router.put("/quotes/{quote_id}/status")
async def update_quote_status(quote_id: str, status: QuoteStatus):
    result = await db.quotes.update_one(
        {"id": quote_id},
        {"$set": {"status": status}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Quote not found")
    return {"success": True}

# ============ MESSAGE ROUTES ============
@api_router.post("/messages")
async def send_message(message_data: MessageCreate):
    sender = await db.users.find_one({"id": message_data.sender_id})
    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")
    
    message_dict = message_data.dict()
    message_dict["id"] = str(uuid.uuid4())
    message_dict["sender_name"] = sender["name"]
    message_dict["read"] = False
    message_dict["created_at"] = datetime.utcnow()
    
    await db.messages.insert_one(message_dict)
    message_dict["_id"] = str(message_dict["_id"])
    return {"success": True, "message": message_dict}

@api_router.get("/messages/{conversation_id}")
async def get_messages(conversation_id: str):
    messages = await db.messages.find({"conversation_id": conversation_id}).sort("created_at", 1).to_list(1000)
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return messages

@api_router.get("/conversations/{user_id}")
async def get_user_conversations(user_id: str):
    # Get all conversations for a user
    messages = await db.messages.find(
        {"$or": [{"sender_id": user_id}, {"receiver_id": user_id}]}
    ).sort("created_at", -1).to_list(1000)
    
    conversations = {}
    for msg in messages:
        conv_id = msg["conversation_id"]
        if conv_id not in conversations:
            conversations[conv_id] = {
                "conversation_id": conv_id,
                "last_message": msg["message"],
                "last_message_time": msg["created_at"],
                "unread": 0
            }
        if msg["receiver_id"] == user_id and not msg["read"]:
            conversations[conv_id]["unread"] += 1
    
    return list(conversations.values())

# ============ REVIEW ROUTES ============
@api_router.post("/reviews")
async def create_review(review_data: ReviewCreate, customer_id: str):
    customer = await db.users.find_one({"id": customer_id})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    review_dict = review_data.dict()
    review_dict["id"] = str(uuid.uuid4())
    review_dict["customer_id"] = customer_id
    review_dict["customer_name"] = customer["name"]
    review_dict["created_at"] = datetime.utcnow()
    
    await db.reviews.insert_one(review_dict)
    
    # Update pro rating
    reviews = await db.reviews.find({"pro_id": review_data.pro_id}).to_list(1000)
    avg_rating = sum(r["rating"] for r in reviews) / len(reviews)
    
    await db.pro_profiles.update_one(
        {"user_id": review_data.pro_id},
        {"$set": {"rating": avg_rating}, "$inc": {"total_jobs": 1}}
    )
    
    review_dict["_id"] = str(review_dict["_id"])
    return {"success": True, "review": review_dict}

@api_router.get("/reviews/{pro_id}")
async def get_pro_reviews(pro_id: str):
    reviews = await db.reviews.find({"pro_id": pro_id}).sort("created_at", -1).to_list(100)
    for review in reviews:
        review["_id"] = str(review["_id"])
    return reviews

# ============ PAYMENT ROUTES ============
@api_router.get("/payments/{pro_id}")
async def get_pro_payments(pro_id: str):
    payments = await db.payments.find({"pro_id": pro_id}).sort("created_at", -1).to_list(100)
    for payment in payments:
        payment["_id"] = str(payment["_id"])
    return payments

@api_router.put("/pros/{pro_id}/budget")
async def update_weekly_budget(pro_id: str, budget: float):
    result = await db.pro_profiles.update_one(
        {"user_id": pro_id},
        {"$set": {"weekly_budget": budget}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"success": True}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
