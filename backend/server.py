from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List, Optional, Dict
import os
import logging
from pathlib import Path
from datetime import datetime
import uuid
import bcrypt
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

from models import (
    User, UserCreate, UserRole,
    Job, JobCreate, JobStatus,
    Quote, QuoteCreate, QuoteStatus,
    Message, MessageCreate,
    Review, ReviewCreate,
    ProProfile, Payment, PaymentCreate,
    ServiceCategory, PlatformSettings, AdminAnalytics,
    ServiceCategoryCreate, ServiceCategoryUpdate
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

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
    
    result = await db.users.insert_one(user_dict)
    
    # If pro, create pro profile
    if user_data.role == UserRole.PRO:
        pro_profile = {
            "user_id": user_dict["id"],
            "bio": None,
            "services": [],
            "service_areas": [],
            "hourly_rate": None,
            "years_experience": None,
            "profile_image": None,  # Personal photo
            "logo_image": None,  # Business logo
            "portfolio_images": [],  # Work samples
            "certifications": [],
            "background_check_verified": False,
            "weekly_budget": 0.0,
            "weekly_spent": 0.0,
            "budget_active": True,
            "rating": 0.0,
            "total_jobs": 0,
            "cashapp_handle": None,  # For CashApp payments
            "created_at": datetime.utcnow()
        }
        await db.pro_profiles.insert_one(pro_profile)
    
    # Return clean user data
    return_user = {
        "id": user_dict["id"],
        "email": user_dict["email"],
        "name": user_dict["name"],
        "phone": user_dict["phone"],
        "role": user_dict["role"],
        "created_at": user_dict["created_at"],
        "is_active": user_dict["is_active"]
    }
    return {"success": True, "user": return_user}

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
    logger.info(f"Fetching pro profile for user_id: {user_id}")
    profile = await db.pro_profiles.find_one({"user_id": user_id}, {"_id": 0})
    logger.info(f"Profile found: {profile is not None}")
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
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

@api_router.post("/pros/{user_id}/upload-image")
async def upload_pro_image(user_id: str, image_data: dict):
    """
    Upload images for pro profile
    Accepts: profile_image, logo_image, or portfolio_image
    Images should be base64 encoded strings or URLs
    """
    image_type = image_data.get("type")  # "profile", "logo", or "portfolio"
    image_content = image_data.get("image")  # base64 or URL
    
    if image_type == "profile":
        result = await db.pro_profiles.update_one(
            {"user_id": user_id},
            {"$set": {"profile_image": image_content}}
        )
    elif image_type == "logo":
        result = await db.pro_profiles.update_one(
            {"user_id": user_id},
            {"$set": {"logo_image": image_content}}
        )
    elif image_type == "portfolio":
        result = await db.pro_profiles.update_one(
            {"user_id": user_id},
            {"$push": {"portfolio_images": image_content}}
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid image type")
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {"success": True, "message": "Image uploaded successfully"}

@api_router.delete("/pros/{user_id}/portfolio-image/{image_index}")
async def delete_portfolio_image(user_id: str, image_index: int):
    """Remove a portfolio image by index"""
    profile = await db.pro_profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    portfolio = profile.get("portfolio_images", [])
    if image_index >= len(portfolio):
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Remove the image at the specified index
    portfolio.pop(image_index)
    
    result = await db.pro_profiles.update_one(
        {"user_id": user_id},
        {"$set": {"portfolio_images": portfolio}}
    )
    
    return {"success": True, "message": "Image deleted successfully"}

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
# IMPORTANT: Specific routes MUST come before path parameter routes
@api_router.get("/payments/packages")
async def get_payment_packages_public():
    # Return payment packages for pros to buy credits
    packages = {
        "starter": {"amount": 50.0, "credits": 50.0, "description": "5 leads ($10 each)"},
        "basic": {"amount": 100.0, "credits": 100.0, "description": "10 leads ($10 each)"},
        "pro": {"amount": 200.0, "credits": 200.0, "description": "20 leads ($10 each)"},
        "premium": {"amount": 500.0, "credits": 500.0, "description": "50 leads ($10 each)"},
    }
    logger.info(f"Payment packages endpoint called, returning: {packages}")
    return packages

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

# ============ ADMIN ROUTES ============
@api_router.post("/admin/login")
async def admin_login(email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user or user.get("role") != "admin" or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
    
    user.pop("password")
    user["_id"] = str(user["_id"])
    return {"success": True, "user": user}

@api_router.get("/admin/settings")
async def get_admin_settings():
    settings = await db.platform_settings.find_one({})
    if not settings:
        # Create default settings if none exist
        default_settings = {
            "lead_fee": 10.0,
            "platform_commission": 0.0,
            "featured_pro_fee": 50.0,
            "min_quote_amount": 10.0,
            "max_quote_amount": 10000.0,
            "weekly_budget_min": 50.0,
            "auto_approve_pros": False,
            "require_background_check": False,
            "enable_stripe": True,
            "enable_cashapp": True,
            "enable_paypal": False,
            "enable_apple_pay": True,
            "enable_google_pay": True,
            "enable_bnpl": True,
            "updated_at": datetime.utcnow()
        }
        await db.platform_settings.insert_one(default_settings)
        settings = default_settings
    settings["_id"] = str(settings["_id"])
    return settings

@api_router.put("/admin/settings")
async def update_admin_settings(settings: dict):
    settings["updated_at"] = datetime.utcnow()
    result = await db.platform_settings.update_one(
        {},
        {"$set": settings},
        upsert=True
    )
    return {"success": True}

@api_router.get("/admin/analytics")
async def get_admin_analytics():
    # Get counts
    total_users = await db.users.count_documents({})
    total_customers = await db.users.count_documents({"role": "customer"})
    total_pros = await db.users.count_documents({"role": "pro"})
    active_pros = await db.pro_profiles.count_documents({"budget_active": True})
    
    total_jobs = await db.jobs.count_documents({})
    open_jobs = await db.jobs.count_documents({"status": "open"})
    completed_jobs = await db.jobs.count_documents({"status": "completed"})
    total_quotes = await db.quotes.count_documents({})
    
    # Calculate revenue
    payments = await db.payments.find({}).to_list(10000)
    total_revenue = sum(p["amount"] for p in payments)
    
    # Revenue this month
    from datetime import datetime, timedelta
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    revenue_this_month = sum(
        p["amount"] for p in payments 
        if p["created_at"] >= start_of_month
    )
    
    return {
        "total_users": total_users,
        "total_customers": total_customers,
        "total_pros": total_pros,
        "active_pros": active_pros,
        "total_jobs": total_jobs,
        "open_jobs": open_jobs,
        "completed_jobs": completed_jobs,
        "total_quotes": total_quotes,
        "total_revenue": total_revenue,
        "revenue_this_month": revenue_this_month,
        "avg_response_time": 2.3,  # Mock for now
        "customer_satisfaction": 98.0  # Mock for now
    }

@api_router.get("/admin/users")
async def get_all_users(role: Optional[str] = None, is_active: Optional[bool] = None):
    query = {}
    if role:
        query["role"] = role
    if is_active is not None:
        query["is_active"] = is_active
    
    users = await db.users.find(query).sort("created_at", -1).to_list(1000)
    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        
        # Get pro profile info if pro
        if user["role"] == "pro":
            pro_profile = await db.pro_profiles.find_one({"user_id": user["id"]})
            if pro_profile:
                user["weekly_budget"] = pro_profile.get("weekly_budget", 0)
                user["weekly_spent"] = pro_profile.get("weekly_spent", 0)
                user["rating"] = pro_profile.get("rating", 0)
                user["total_jobs"] = pro_profile.get("total_jobs", 0)
    
    return users

@api_router.put("/admin/users/{user_id}/status")
async def update_user_status(user_id: str, data: dict):
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"is_active": data.get("is_active", True)}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"success": True}

@api_router.get("/admin/revenue")
async def get_admin_revenue(period: Optional[str] = "month"):
    payments = await db.payments.find({}).sort("created_at", -1).to_list(10000)
    
    # Calculate totals by type
    lead_fees = sum(p["amount"] for p in payments if p["payment_type"] == "lead_fee")
    job_payments = sum(p["amount"] for p in payments if p["payment_type"] == "job_payment")
    
    # Group by month
    from collections import defaultdict
    monthly_revenue = defaultdict(float)
    for payment in payments:
        month_key = payment["created_at"].strftime("%Y-%m")
        monthly_revenue[month_key] += payment["amount"]
    
    return {
        "total_revenue": lead_fees + job_payments,
        "lead_fees": lead_fees,
        "job_payments": job_payments,
        "monthly_breakdown": dict(monthly_revenue),
        "recent_payments": [
            {
                "id": p["id"],
                "pro_id": p["pro_id"],
                "amount": p["amount"],
                "payment_type": p["payment_type"],
                "created_at": p["created_at"],
                "_id": str(p["_id"])
            }
            for p in payments[:50]
        ]
    }

# ============ SERVICE CATEGORY ROUTES ============
@api_router.get("/categories")
async def get_categories(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    categories = await db.service_categories.find(query).sort("display_order", 1).to_list(100)
    for cat in categories:
        cat["_id"] = str(cat["_id"])
    return categories

@api_router.post("/admin/categories")
async def create_category(category: ServiceCategoryCreate):
    # Check if value already exists
    existing = await db.service_categories.find_one({"value": category.value})
    if existing:
        raise HTTPException(status_code=400, detail="Category value already exists")
    
    category_dict = category.dict()
    category_dict["id"] = str(uuid.uuid4())
    category_dict["created_at"] = datetime.utcnow()
    
    await db.service_categories.insert_one(category_dict)
    category_dict["_id"] = str(category_dict["_id"])
    return {"success": True, "category": category_dict}

@api_router.get("/admin/categories")
async def get_all_categories_admin():
    categories = await db.service_categories.find({}).sort("display_order", 1).to_list(100)
    for cat in categories:
        cat["_id"] = str(cat["_id"])
    return categories

@api_router.put("/admin/categories/{category_id}")
async def update_category(category_id: str, category_update: ServiceCategoryUpdate):
    update_data = {k: v for k, v in category_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.service_categories.update_one(
        {"id": category_id},
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"success": True}

@api_router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: str):
    # Soft delete by setting is_active to False
    result = await db.service_categories.update_one(
        {"id": category_id},
        {"$set": {"is_active": False}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"success": True}

# Initialize default categories if none exist
@app.on_event("startup")
async def initialize_default_categories():
    count = await db.service_categories.count_documents({})
    if count == 0:
        default_categories = [
            {"id": str(uuid.uuid4()), "name": "Handyman", "value": "handyman", "icon": "wrench", "color": "#3B82F6", "is_active": True, "display_order": 1, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "Plumbing", "value": "plumbing", "icon": "droplet", "color": "#0EA5E9", "is_active": True, "display_order": 2, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "Electrical", "value": "electrical", "icon": "zap", "color": "#F59E0B", "is_active": True, "display_order": 3, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "Painting", "value": "painting", "icon": "paintbrush", "color": "#EC4899", "is_active": True, "display_order": 4, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "Carpet Cleaning", "value": "carpet_cleaning", "icon": "sparkles", "color": "#8B5CF6", "is_active": True, "display_order": 5, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "Landscaping", "value": "landscaping", "icon": "tree", "color": "#10B981", "is_active": True, "display_order": 6, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "Cleaning", "value": "cleaning", "icon": "spray-can", "color": "#14B8A6", "is_active": True, "display_order": 7, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "HVAC", "value": "hvac", "icon": "wind", "color": "#06B6D4", "is_active": True, "display_order": 8, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "Roofing", "value": "roofing", "icon": "home", "color": "#EF4444", "is_active": True, "display_order": 9, "created_at": datetime.utcnow()},
            {"id": str(uuid.uuid4()), "name": "Other", "value": "other", "icon": "more-horizontal", "color": "#6B7280", "is_active": True, "display_order": 10, "created_at": datetime.utcnow()},
        ]
        await db.service_categories.insert_many(default_categories)
        logger.info("Default service categories initialized")

# ============ PAYMENT PACKAGES (FIXED - NEVER FROM FRONTEND) ============
LEAD_CREDIT_PACKAGES = {
    "starter": {"amount": 50.0, "credits": 50.0, "description": "5 leads ($10 each)"},
    "basic": {"amount": 100.0, "credits": 100.0, "description": "10 leads ($10 each)"},
    "pro": {"amount": 200.0, "credits": 200.0, "description": "20 leads ($10 each)"},
    "premium": {"amount": 500.0, "credits": 500.0, "description": "50 leads ($10 each)"},
}

# ============ STRIPE PAYMENT ROUTES ============
@api_router.post("/payments/create-checkout")
async def create_checkout_session(request: Request, package_id: str, pro_id: str, origin_url: str):
    # Validate package
    if package_id not in LEAD_CREDIT_PACKAGES:
        raise HTTPException(status_code=400, detail="Invalid package")
    
    # Get amount from server-side definition (NEVER from frontend)
    package = LEAD_CREDIT_PACKAGES[package_id]
    amount = package["amount"]
    credits = package["credits"]
    
    # Verify pro exists
    pro = await db.users.find_one({"id": pro_id, "role": "pro"})
    if not pro:
        raise HTTPException(status_code=404, detail="Pro not found")
    
    # Build dynamic URLs from frontend origin
    success_url = f"{origin_url}/pro/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin_url}/pro/budget"
    
    # Initialize Stripe
    webhook_url = f"{str(request.base_url)}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "pro_id": pro_id,
            "package_id": package_id,
            "credits": str(credits),
            "type": "lead_credits"
        },
        payment_methods=["card"]  # Supports all cards, Apple Pay, Google Pay
    )
    
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "pro_id": pro_id,
        "package_id": package_id,
        "amount": amount,
        "credits": credits,
        "currency": "usd",
        "payment_status": "pending",
        "status": "initiated",
        "metadata": checkout_request.metadata,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    await db.payment_transactions.insert_one(transaction)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/checkout-status/{session_id}")
async def get_checkout_status(session_id: str, request: Request):
    # Initialize Stripe
    webhook_url = f"{str(request.base_url)}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    # Get status from Stripe
    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
    
    # Check if transaction already processed
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Only update if not already completed
    if transaction["payment_status"] != "paid" and status.payment_status == "paid":
        # Update transaction
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "payment_status": status.payment_status,
                    "status": "completed",
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Add credits to pro's budget
        pro_id = transaction["pro_id"]
        credits = transaction["credits"]
        
        # Update pro profile budget
        await db.pro_profiles.update_one(
            {"user_id": pro_id},
            {
                "$inc": {"weekly_budget": credits}
            }
        )
        
        logger.info(f"Added {credits} credits to pro {pro_id} from payment {session_id}")
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
        "metadata": status.metadata
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    try:
        # Get raw body and signature
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        # Initialize Stripe
        webhook_url = f"{str(request.base_url)}api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        logger.info(f"Webhook received: {webhook_response.event_type} for session {webhook_response.session_id}")
        
        # Process based on event type
        if webhook_response.payment_status == "paid":
            # Check if already processed
            transaction = await db.payment_transactions.find_one({"session_id": webhook_response.session_id})
            if transaction and transaction["payment_status"] != "paid":
                # Update transaction
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {
                        "$set": {
                            "payment_status": "paid",
                            "status": "completed",
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                
                # Add credits
                pro_id = webhook_response.metadata.get("pro_id")
                credits = float(webhook_response.metadata.get("credits", 0))
                
                if pro_id and credits > 0:
                    await db.pro_profiles.update_one(
                        {"user_id": pro_id},
                        {"$inc": {"weekly_budget": credits}}
                    )
                    logger.info(f"Webhook: Added {credits} credits to pro {pro_id}")
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/payments/history/{pro_id}")
async def get_payment_history(pro_id: str):
    transactions = await db.payment_transactions.find(
        {"pro_id": pro_id}
    ).sort("created_at", -1).to_list(100)
    
    for tx in transactions:
        tx["_id"] = str(tx["_id"])
    
    return transactions

# Removed duplicate - packages route now at line 432

# ============ BACKGROUND CHECK ENDPOINTS ============
@api_router.post("/background-check/initiate")
async def initiate_background_check(data: dict):
    """Initiate background check for a pro (mock implementation for now)"""
    user_id = data.get("user_id")
    payment_method = data.get("payment_method", "card")
    
    # Get pro profile
    pro_profile = await db.pro_profiles.find_one({"user_id": user_id})
    if not pro_profile:
        raise HTTPException(status_code=404, detail="Pro profile not found")
    
    # Check if already verified or pending
    if pro_profile.get("background_check_verified"):
        raise HTTPException(status_code=400, detail="Already verified")
    if pro_profile.get("background_check_status") == "pending":
        raise HTTPException(status_code=400, detail="Background check already in progress")
    
    # Handle payment
    background_check_fee = 50.0
    
    if payment_method == "credits":
        # Deduct from credit balance
        if pro_profile.get("weekly_budget", 0) < background_check_fee:
            raise HTTPException(status_code=400, detail="Insufficient credits")
        
        await db.pro_profiles.update_one(
            {"user_id": user_id},
            {"$inc": {"weekly_budget": -background_check_fee}}
        )
        
        # Record transaction
        await db.payment_transactions.insert_one({
            "pro_id": user_id,
            "amount": background_check_fee,
            "payment_type": "background_check",
            "payment_method": "credits",
            "status": "completed",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    else:
        # For card payment, in real implementation this would go through Stripe
        # For now, we'll just record it as pending payment
        await db.payment_transactions.insert_one({
            "pro_id": user_id,
            "amount": background_check_fee,
            "payment_type": "background_check",
            "payment_method": "card",
            "status": "completed",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    
    # Update pro profile with background check info
    await db.pro_profiles.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "background_check_status": "pending",
                "background_check_submitted_at": datetime.now(timezone.utc).isoformat(),
                "background_check_data": {
                    "full_name": data.get("fullName"),
                    "dob": data.get("dob"),
                    "address": data.get("address"),
                    "city": data.get("city"),
                    "state": data.get("state"),
                    "zip_code": data.get("zipCode")
                }
            }
        }
    )
    
    logger.info(f"Background check initiated for pro {user_id}")
    
    # In real implementation, this would call Checkr API
    # For mock/testing, we'll auto-approve after a delay (or admin can manually approve)
    
    return {
        "success": True,
        "message": "Background check initiated successfully",
        "status": "pending"
    }

@api_router.post("/background-check/approve/{user_id}")
async def approve_background_check(user_id: str):
    """Admin endpoint to manually approve background check"""
    result = await db.pro_profiles.update_one(
        {"user_id": user_id},
        {
            "$set": {
                "background_check_verified": True,
                "background_check_status": "approved",
                "background_check_date": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Pro profile not found")
    
    logger.info(f"Background check approved for pro {user_id}")
    
    return {"success": True, "message": "Background check approved"}

@api_router.get("/background-check/status/{user_id}")
async def get_background_check_status(user_id: str):
    """Get background check status for a pro"""
    profile = await db.pro_profiles.find_one({"user_id": user_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Pro profile not found")
    
    return {
        "verified": profile.get("background_check_verified", False),
        "status": profile.get("background_check_status", "not_started"),
        "submitted_at": profile.get("background_check_submitted_at"),
        "verified_date": profile.get("background_check_date")
    }


# ============ ADMIN PAYMENT MANAGEMENT ============
@api_router.get("/admin/payments/packages")
async def get_admin_payment_packages():
    packages = await db.payment_packages.find({}).to_list(100)
    if not packages:
        # Initialize default packages
        default_packages = [
            {
                "id": str(uuid.uuid4()),
                "package_id": "starter",
                "name": "Starter Package",
                "amount": 50.0,
                "credits": 50.0,
                "description": "5 leads ($10 each)",
                "is_active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "package_id": "basic",
                "name": "Basic Package",
                "amount": 100.0,
                "credits": 100.0,
                "description": "10 leads ($10 each)",
                "is_active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "package_id": "pro",
                "name": "Pro Package",
                "amount": 200.0,
                "credits": 200.0,
                "description": "20 leads ($10 each)",
                "is_active": True,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "package_id": "premium",
                "name": "Premium Package",
                "amount": 500.0,
                "credits": 500.0,
                "description": "50 leads ($10 each)",
                "is_active": True,
                "created_at": datetime.utcnow()
            }
        ]
        await db.payment_packages.insert_many(default_packages)
        packages = default_packages
    
    for pkg in packages:
        pkg["_id"] = str(pkg["_id"])
    return packages

@api_router.put("/admin/payments/packages/{package_id}")
async def update_payment_package(package_id: str, package_data: dict):
    package_data["updated_at"] = datetime.utcnow()
    result = await db.payment_packages.update_one(
        {"package_id": package_id},
        {"$set": package_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"success": True}

@api_router.post("/admin/payments/packages")
async def create_payment_package(package_data: dict):
    package_data["id"] = str(uuid.uuid4())
    package_data["created_at"] = datetime.utcnow()
    await db.payment_packages.insert_one(package_data)
    package_data["_id"] = str(package_data["_id"])
    return {"success": True, "package": package_data}

@api_router.get("/admin/payments/transactions")
async def get_all_transactions(limit: int = 100):
    transactions = await db.payment_transactions.find({}).sort("created_at", -1).to_list(limit)
    for tx in transactions:
        tx["_id"] = str(tx["_id"])
        # Get pro name
        pro = await db.users.find_one({"id": tx["pro_id"]})
        if pro:
            tx["pro_name"] = pro["name"]
            tx["pro_email"] = pro["email"]
    return transactions

@api_router.get("/admin/payments/stats")
async def get_payment_stats():
    # Total revenue
    transactions = await db.payment_transactions.find({"payment_status": "paid"}).to_list(10000)
    total_revenue = sum(tx["amount"] for tx in transactions)
    
    # Revenue this month
    from datetime import timedelta
    start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    monthly_transactions = [tx for tx in transactions if tx["created_at"] >= start_of_month]
    monthly_revenue = sum(tx["amount"] for tx in monthly_transactions)
    
    # Package breakdown
    package_stats = {}
    for tx in transactions:
        pkg = tx.get("package_id", "unknown")
        package_stats[pkg] = package_stats.get(pkg, 0) + 1
    
    return {
        "total_revenue": total_revenue,
        "monthly_revenue": monthly_revenue,
        "total_transactions": len(transactions),
        "monthly_transactions": len(monthly_transactions),
        "package_breakdown": package_stats,
        "avg_transaction": total_revenue / len(transactions) if transactions else 0
    }

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
