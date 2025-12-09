from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    CUSTOMER = "customer"
    PRO = "pro"
    ADMIN = "admin"

class JobStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class QuoteStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class ServiceCategory(str, Enum):
    HANDYMAN = "handyman"
    PLUMBING = "plumbing"
    ELECTRICAL = "electrical"
    PAINTING = "painting"
    CARPET_CLEANING = "carpet_cleaning"
    LANDSCAPING = "landscaping"
    CLEANING = "cleaning"
    HVAC = "hvac"
    ROOFING = "roofing"
    OTHER = "other"

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: str
    role: UserRole
    
class User(BaseModel):
    id: str
    email: EmailStr
    name: str
    phone: str
    role: UserRole
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

# Pro Profile Models
class ProProfile(BaseModel):
    user_id: str
    bio: Optional[str] = None
    services: List[ServiceCategory] = []
    service_areas: List[str] = []  # Cities/zip codes
    hourly_rate: Optional[float] = None
    years_experience: Optional[int] = None
    portfolio_images: List[str] = []
    certifications: List[str] = []
    background_check_verified: bool = False
    weekly_budget: float = 0.0
    weekly_spent: float = 0.0
    budget_active: bool = True
    rating: float = 0.0
    total_jobs: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Job Models
class JobCreate(BaseModel):
    title: str
    description: str
    category: ServiceCategory
    location: str
    zipcode: str
    images: List[str] = []
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    timeline: str  # "urgent", "flexible", "scheduled"

class Job(BaseModel):
    id: str
    customer_id: str
    customer_name: str
    customer_phone: str
    title: str
    description: str
    category: ServiceCategory
    location: str
    zipcode: str
    images: List[str] = []
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    timeline: str
    status: JobStatus = JobStatus.OPEN
    created_at: datetime = Field(default_factory=datetime.utcnow)
    quotes_count: int = 0

# Quote Models
class QuoteCreate(BaseModel):
    job_id: str
    message: str
    price: float
    estimated_duration: str  # "2 hours", "1 day", etc.

class Quote(BaseModel):
    id: str
    job_id: str
    pro_id: str
    pro_name: str
    pro_phone: str
    pro_rating: float
    message: str
    price: float
    estimated_duration: str
    status: QuoteStatus = QuoteStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Message Models
class MessageCreate(BaseModel):
    conversation_id: str  # job_id + customer_id + pro_id
    sender_id: str
    receiver_id: str
    message: str

class Message(BaseModel):
    id: str
    conversation_id: str
    sender_id: str
    sender_name: str
    receiver_id: str
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Review Models
class ReviewCreate(BaseModel):
    job_id: str
    pro_id: str
    rating: int  # 1-5
    comment: str

class Review(BaseModel):
    id: str
    job_id: str
    customer_id: str
    customer_name: str
    pro_id: str
    rating: int
    comment: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Payment Models
class PaymentCreate(BaseModel):
    pro_id: str
    amount: float
    payment_type: str  # "lead_fee" or "job_payment"
    job_id: Optional[str] = None

class Payment(BaseModel):
    id: str
    pro_id: str
    amount: float
    payment_type: str
    job_id: Optional[str] = None
    status: str = "completed"
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Service Category Management Models
class ServiceCategoryCreate(BaseModel):
    name: str
    value: str  # URL-friendly slug
    icon: Optional[str] = "briefcase"  # Icon name
    color: Optional[str] = "#3B82F6"  # Hex color
    is_active: bool = True
    display_order: int = 0

class ServiceCategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None

# Admin Settings Models
class PlatformSettings(BaseModel):
    lead_fee: float = 10.0  # Cost per quote submission
    platform_commission: float = 0.0  # Commission percentage on completed jobs
    featured_pro_fee: float = 50.0  # Monthly fee for featured listing
    min_quote_amount: float = 10.0
    max_quote_amount: float = 10000.0
    weekly_budget_min: float = 50.0
    auto_approve_pros: bool = False
    require_background_check: bool = False
    # Payment method settings
    enable_stripe: bool = True
    enable_cashapp: bool = True
    enable_paypal: bool = False
    enable_apple_pay: bool = True
    enable_google_pay: bool = True
    enable_bnpl: bool = True  # Buy Now Pay Later (Klarna, Affirm)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentPackage(BaseModel):
    package_id: str
    name: str
    amount: float
    credits: float
    description: str
    is_active: bool = True

class AdminAnalytics(BaseModel):
    total_users: int
    total_customers: int
    total_pros: int
    active_pros: int
    total_jobs: int
    open_jobs: int
    completed_jobs: int
    total_quotes: int
    total_revenue: float
    revenue_this_month: float
    avg_response_time: float  # in hours
    customer_satisfaction: float  # percentage

