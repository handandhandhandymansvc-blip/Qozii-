#!/usr/bin/env python3
"""
Comprehensive Backend Testing for FixItNow Marketplace
Tests ALL functionality: Marketing, Customer, Pro, Admin, and Payment systems
Based on user report that NONE of the applications are working properly.
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://pro-connect-25.preview.emergentagent.com/api"

class ComprehensiveFixItNowTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.test_results = {}
        
        # Test user data
        self.test_customer_id = None
        self.test_customer_email = f"testcustomer_{int(time.time())}@example.com"
        self.test_customer_password = "TestCustomer123"
        
        self.test_pro_id = None
        self.test_pro_email = f"testpro_{int(time.time())}@example.com"
        self.test_pro_password = "TestPro123"
        
        self.test_job_id = None
        self.test_quote_id = None
        
        # Admin credentials from review request
        self.admin_email = "admin@fixitnow.com"
        self.admin_password = "Admin@123"
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results[test_name] = {
            "success": success,
            "message": message,
            "response_data": response_data
        }
    
    # ============ CRITICAL PAYMENT PACKAGES TEST ============
    def test_payment_packages_endpoint(self):
        """Test the critical /api/payments/packages endpoint that was reported as broken"""
        print("\n=== CRITICAL: Testing Payment Packages Endpoint ===")
        
        try:
            response = requests.get(f"{self.backend_url}/payments/packages", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                # Check if we have the expected packages structure
                if isinstance(result, dict) and len(result) > 0:
                    expected_packages = ["starter", "basic", "pro", "premium"]
                    found_packages = list(result.keys())
                    
                    if all(pkg in found_packages for pkg in expected_packages):
                        # Verify package structure
                        starter = result.get("starter", {})
                        if "amount" in starter and "credits" in starter and "description" in starter:
                            self.log_test("payment_packages_endpoint", True, f"Payment packages working correctly: {found_packages}", result)
                            return True
                        else:
                            self.log_test("payment_packages_endpoint", False, f"Package structure incomplete: {starter}")
                            return False
                    else:
                        self.log_test("payment_packages_endpoint", False, f"Missing packages. Expected: {expected_packages}, Found: {found_packages}")
                        return False
                elif isinstance(result, list) and len(result) == 0:
                    self.log_test("payment_packages_endpoint", False, "CRITICAL: Returns empty array instead of packages dictionary")
                    return False
                else:
                    self.log_test("payment_packages_endpoint", False, f"Unexpected response format: {type(result)}")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("payment_packages_endpoint", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("payment_packages_endpoint", False, f"Exception: {str(e)}")
            return False
    
    # ============ ADMIN FUNCTIONALITY TESTS ============
    def test_admin_login(self):
        """Test admin login with provided credentials"""
        print("\n=== Testing Admin Login ===")
        
        try:
            response = requests.post(
                f"{self.backend_url}/admin/login",
                params={"email": self.admin_email, "password": self.admin_password},
                timeout=10
            )
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if result.get("success") and "user" in result:
                    user = result["user"]
                    if user.get("role") == "admin":
                        self.log_test("admin_login", True, f"Admin login successful for {user['email']}", result)
                        return True
                    else:
                        self.log_test("admin_login", False, f"Wrong role: {user.get('role')}")
                        return False
                else:
                    self.log_test("admin_login", False, "Invalid response format", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("admin_login", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("admin_login", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_analytics(self):
        """Test admin analytics/dashboard data"""
        print("\n=== Testing Admin Analytics ===")
        
        try:
            response = requests.get(f"{self.backend_url}/admin/analytics", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                expected_fields = ["total_users", "total_customers", "total_pros", "total_jobs", "total_revenue"]
                missing_fields = [field for field in expected_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("admin_analytics", True, f"Analytics data retrieved with all fields", result)
                    return True
                else:
                    self.log_test("admin_analytics", False, f"Missing analytics fields: {missing_fields}")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("admin_analytics", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("admin_analytics", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_settings(self):
        """Test admin platform settings"""
        print("\n=== Testing Admin Settings ===")
        
        try:
            response = requests.get(f"{self.backend_url}/admin/settings", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                expected_fields = ["lead_fee", "platform_commission", "enable_stripe", "enable_cashapp"]
                missing_fields = [field for field in expected_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("admin_settings", True, f"Settings retrieved with all fields", result)
                    return True
                else:
                    self.log_test("admin_settings", False, f"Missing settings fields: {missing_fields}")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("admin_settings", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("admin_settings", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_users_management(self):
        """Test admin user management"""
        print("\n=== Testing Admin Users Management ===")
        
        try:
            response = requests.get(f"{self.backend_url}/admin/users", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} users")
                
                if len(result) > 0:
                    user = result[0]
                    expected_fields = ["id", "email", "name", "role", "is_active"]
                    missing_fields = [field for field in expected_fields if field not in user]
                    
                    if not missing_fields:
                        self.log_test("admin_users_management", True, f"Retrieved {len(result)} users with all fields", result)
                        return True
                    else:
                        self.log_test("admin_users_management", False, f"Missing user fields: {missing_fields}")
                        return False
                else:
                    self.log_test("admin_users_management", True, "No users found (empty database)", result)
                    return True
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("admin_users_management", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("admin_users_management", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_categories_management(self):
        """Test admin service categories management"""
        print("\n=== Testing Admin Categories Management ===")
        
        try:
            response = requests.get(f"{self.backend_url}/admin/categories", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} categories")
                
                if len(result) > 0:
                    category = result[0]
                    expected_fields = ["id", "name", "value", "is_active", "display_order"]
                    missing_fields = [field for field in expected_fields if field not in category]
                    
                    if not missing_fields:
                        self.log_test("admin_categories_management", True, f"Retrieved {len(result)} categories with all fields", result)
                        return True
                    else:
                        self.log_test("admin_categories_management", False, f"Missing category fields: {missing_fields}")
                        return False
                else:
                    self.log_test("admin_categories_management", False, "No categories found")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("admin_categories_management", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("admin_categories_management", False, f"Exception: {str(e)}")
            return False
    
    def test_admin_payments_management(self):
        """Test admin payment packages management"""
        print("\n=== Testing Admin Payment Packages Management ===")
        
        try:
            response = requests.get(f"{self.backend_url}/admin/payments/packages", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} payment packages")
                
                if len(result) > 0:
                    package = result[0]
                    expected_fields = ["id", "package_id", "name", "amount", "credits", "is_active"]
                    missing_fields = [field for field in expected_fields if field not in package]
                    
                    if not missing_fields:
                        self.log_test("admin_payments_management", True, f"Retrieved {len(result)} payment packages with all fields", result)
                        return True
                    else:
                        self.log_test("admin_payments_management", False, f"Missing package fields: {missing_fields}")
                        return False
                else:
                    self.log_test("admin_payments_management", False, "No payment packages found")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("admin_payments_management", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("admin_payments_management", False, f"Exception: {str(e)}")
            return False
    
    # ============ CUSTOMER FUNCTIONALITY TESTS ============
    def test_customer_registration(self):
        """Test customer registration"""
        print("\n=== Testing Customer Registration ===")
        
        registration_data = {
            "email": self.test_customer_email,
            "password": self.test_customer_password,
            "name": "Test Customer",
            "phone": "(555) 123-4567",
            "role": "customer"
        }
        
        try:
            response = requests.post(f"{self.backend_url}/users/register", json=registration_data, timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "user" in result:
                    user = result["user"]
                    self.test_customer_id = user["id"]
                    self.log_test("customer_registration", True, f"Customer registered with ID: {self.test_customer_id}", result)
                    return True
                else:
                    self.log_test("customer_registration", False, "Invalid response format", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("customer_registration", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("customer_registration", False, f"Exception: {str(e)}")
            return False
    
    def test_customer_login(self):
        """Test customer login"""
        print("\n=== Testing Customer Login ===")
        
        try:
            response = requests.post(
                f"{self.backend_url}/users/login",
                params={"email": self.test_customer_email, "password": self.test_customer_password},
                timeout=10
            )
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "user" in result:
                    user = result["user"]
                    if user["role"] == "customer":
                        self.log_test("customer_login", True, f"Customer login successful", result)
                        return True
                    else:
                        self.log_test("customer_login", False, f"Wrong role: {user['role']}")
                        return False
                else:
                    self.log_test("customer_login", False, "Invalid response format", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("customer_login", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("customer_login", False, f"Exception: {str(e)}")
            return False
    
    def test_customer_post_job(self):
        """Test customer job posting"""
        print("\n=== Testing Customer Post Job ===")
        
        if not self.test_customer_id:
            self.log_test("customer_post_job", False, "No customer ID available")
            return False
        
        job_data = {
            "title": "Fix Kitchen Faucet",
            "description": "Kitchen faucet is leaking and needs repair",
            "category": "plumbing",
            "location": "New York, NY",
            "zipcode": "10001",
            "budget_min": 100.0,
            "budget_max": 300.0,
            "timeline": "urgent"
        }
        
        try:
            response = requests.post(
                f"{self.backend_url}/jobs?customer_id={self.test_customer_id}",
                json=job_data,
                timeout=10
            )
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "job" in result:
                    job = result["job"]
                    self.test_job_id = job["id"]
                    self.log_test("customer_post_job", True, f"Job posted with ID: {self.test_job_id}", result)
                    return True
                else:
                    self.log_test("customer_post_job", False, "Invalid response format", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("customer_post_job", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("customer_post_job", False, f"Exception: {str(e)}")
            return False
    
    # ============ PRO FUNCTIONALITY TESTS ============
    def test_pro_registration(self):
        """Test pro registration - CRITICAL: Check for white page issue"""
        print("\n=== CRITICAL: Testing Pro Registration (White Page Issue) ===")
        
        registration_data = {
            "email": self.test_pro_email,
            "password": self.test_pro_password,
            "name": "Test Professional",
            "phone": "(555) 987-6543",
            "role": "pro"
        }
        
        try:
            response = requests.post(f"{self.backend_url}/users/register", json=registration_data, timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if result.get("success") and "user" in result:
                    user = result["user"]
                    self.test_pro_id = user["id"]
                    
                    # Check if pro profile was created
                    time.sleep(1)  # Wait for profile creation
                    profile_response = requests.get(f"{self.backend_url}/pros/{self.test_pro_id}/profile", timeout=10)
                    
                    if profile_response.status_code == 200:
                        profile = profile_response.json()
                        if "user_id" in profile and profile["user_id"] == self.test_pro_id:
                            self.log_test("pro_registration", True, f"Pro registered with ID: {self.test_pro_id} and profile created", result)
                            return True
                        else:
                            self.log_test("pro_registration", False, "Pro profile not created properly")
                            return False
                    else:
                        self.log_test("pro_registration", False, f"Pro profile creation failed: {profile_response.status_code}")
                        return False
                else:
                    self.log_test("pro_registration", False, "Invalid response format", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("pro_registration", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("pro_registration", False, f"Exception: {str(e)}")
            return False
    
    def test_pro_login(self):
        """Test pro login"""
        print("\n=== Testing Pro Login ===")
        
        try:
            response = requests.post(
                f"{self.backend_url}/users/login",
                params={"email": self.test_pro_email, "password": self.test_pro_password},
                timeout=10
            )
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "user" in result:
                    user = result["user"]
                    if user["role"] == "pro":
                        self.log_test("pro_login", True, f"Pro login successful", result)
                        return True
                    else:
                        self.log_test("pro_login", False, f"Wrong role: {user['role']}")
                        return False
                else:
                    self.log_test("pro_login", False, "Invalid response format", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("pro_login", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("pro_login", False, f"Exception: {str(e)}")
            return False
    
    def test_pro_browse_jobs(self):
        """Test pro browsing jobs"""
        print("\n=== Testing Pro Browse Jobs ===")
        
        try:
            response = requests.get(f"{self.backend_url}/jobs?status=open", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} open jobs")
                self.log_test("pro_browse_jobs", True, f"Retrieved {len(result)} open jobs", result)
                return True
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("pro_browse_jobs", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("pro_browse_jobs", False, f"Exception: {str(e)}")
            return False
    
    def test_pro_submit_quote(self):
        """Test pro submitting quote with $10 budget deduction"""
        print("\n=== Testing Pro Submit Quote ($10 Deduction) ===")
        
        if not self.test_pro_id or not self.test_job_id:
            self.log_test("pro_submit_quote", False, "Missing pro ID or job ID")
            return False
        
        # Set pro budget first
        try:
            budget_response = requests.put(f"{self.backend_url}/pros/{self.test_pro_id}/budget?budget=100", timeout=10)
            if budget_response.status_code != 200:
                self.log_test("pro_submit_quote", False, "Failed to set pro budget")
                return False
        except Exception as e:
            self.log_test("pro_submit_quote", False, f"Budget setup failed: {str(e)}")
            return False
        
        # Get initial budget
        try:
            profile_response = requests.get(f"{self.backend_url}/pros/{self.test_pro_id}/profile", timeout=10)
            if profile_response.status_code == 200:
                initial_profile = profile_response.json()
                initial_spent = initial_profile.get("weekly_spent", 0)
                print(f"Initial weekly spent: ${initial_spent}")
            else:
                self.log_test("pro_submit_quote", False, "Failed to get initial profile")
                return False
        except Exception as e:
            self.log_test("pro_submit_quote", False, f"Failed to get initial profile: {str(e)}")
            return False
        
        # Submit quote
        quote_data = {
            "job_id": self.test_job_id,
            "message": "I can fix your faucet professionally with 5+ years experience.",
            "price": 175.0,
            "estimated_duration": "2 hours"
        }
        
        try:
            response = requests.post(f"{self.backend_url}/quotes?pro_id={self.test_pro_id}", json=quote_data, timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "quote" in result:
                    self.test_quote_id = result["quote"]["id"]
                    
                    # Check budget deduction
                    time.sleep(1)
                    profile_response = requests.get(f"{self.backend_url}/pros/{self.test_pro_id}/profile", timeout=10)
                    if profile_response.status_code == 200:
                        updated_profile = profile_response.json()
                        updated_spent = updated_profile.get("weekly_spent", 0)
                        print(f"Updated weekly spent: ${updated_spent}")
                        
                        if updated_spent == initial_spent + 10:
                            self.log_test("pro_submit_quote", True, f"Quote submitted and $10 deducted correctly", result)
                            return True
                        else:
                            self.log_test("pro_submit_quote", False, f"Budget deduction incorrect. Expected: {initial_spent + 10}, Got: {updated_spent}")
                            return False
                    else:
                        self.log_test("pro_submit_quote", False, "Failed to verify budget deduction")
                        return False
                else:
                    self.log_test("pro_submit_quote", False, "Invalid quote response", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("pro_submit_quote", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("pro_submit_quote", False, f"Exception: {str(e)}")
            return False
    
    # ============ STRIPE PAYMENT TESTS ============
    def test_stripe_checkout_creation(self):
        """Test Stripe checkout session creation"""
        print("\n=== Testing Stripe Checkout Creation ===")
        
        if not self.test_pro_id:
            self.log_test("stripe_checkout_creation", False, "No pro ID available")
            return False
        
        try:
            response = requests.post(
                f"{self.backend_url}/payments/create-checkout",
                params={
                    "package_id": "basic",
                    "pro_id": self.test_pro_id,
                    "origin_url": "https://test.example.com"
                },
                timeout=10
            )
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if "url" in result and "session_id" in result:
                    self.log_test("stripe_checkout_creation", True, f"Stripe checkout session created", result)
                    return True
                else:
                    self.log_test("stripe_checkout_creation", False, "Missing URL or session_id", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("stripe_checkout_creation", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("stripe_checkout_creation", False, f"Exception: {str(e)}")
            return False
    
    # ============ SERVICE CATEGORIES TEST ============
    def test_service_categories(self):
        """Test service categories for marketing website"""
        print("\n=== Testing Service Categories ===")
        
        try:
            response = requests.get(f"{self.backend_url}/categories", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} categories")
                
                if len(result) >= 5:  # Should have at least 5 categories
                    category = result[0]
                    expected_fields = ["id", "name", "value", "is_active"]
                    missing_fields = [field for field in expected_fields if field not in category]
                    
                    if not missing_fields:
                        # Check for expected categories
                        category_values = [cat["value"] for cat in result]
                        expected_categories = ["handyman", "plumbing", "electrical", "painting"]
                        found_expected = [cat for cat in expected_categories if cat in category_values]
                        
                        if len(found_expected) >= 3:
                            self.log_test("service_categories", True, f"Retrieved {len(result)} categories with expected ones", result)
                            return True
                        else:
                            self.log_test("service_categories", False, f"Missing expected categories: {expected_categories}")
                            return False
                    else:
                        self.log_test("service_categories", False, f"Missing category fields: {missing_fields}")
                        return False
                else:
                    self.log_test("service_categories", False, f"Insufficient categories found: {len(result)}")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("service_categories", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("service_categories", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run comprehensive tests for all FixItNow functionality"""
        print("🚀 COMPREHENSIVE FIXITNOW MARKETPLACE TESTING")
        print("Testing ALL systems: Marketing, Customer, Pro, Admin, Payments")
        print(f"Backend URL: {self.backend_url}")
        print("=" * 80)
        
        # Test order: Critical issues first, then full workflow
        test_methods = [
            # CRITICAL TESTS FIRST
            ("CRITICAL", self.test_payment_packages_endpoint),
            ("CRITICAL", self.test_service_categories),
            
            # ADMIN FUNCTIONALITY
            ("ADMIN", self.test_admin_login),
            ("ADMIN", self.test_admin_analytics),
            ("ADMIN", self.test_admin_settings),
            ("ADMIN", self.test_admin_users_management),
            ("ADMIN", self.test_admin_categories_management),
            ("ADMIN", self.test_admin_payments_management),
            
            # CUSTOMER WORKFLOW
            ("CUSTOMER", self.test_customer_registration),
            ("CUSTOMER", self.test_customer_login),
            ("CUSTOMER", self.test_customer_post_job),
            
            # PRO WORKFLOW
            ("PRO", self.test_pro_registration),
            ("PRO", self.test_pro_login),
            ("PRO", self.test_pro_browse_jobs),
            ("PRO", self.test_pro_submit_quote),
            
            # PAYMENT SYSTEM
            ("PAYMENT", self.test_stripe_checkout_creation),
        ]
        
        for category, test_method in test_methods:
            print(f"\n[{category}] Running {test_method.__name__}...")
            try:
                test_method()
            except Exception as e:
                test_name = test_method.__name__
                self.log_test(test_name, False, f"Unexpected error: {str(e)}")
            
            time.sleep(0.5)  # Small delay between tests
        
        # Print comprehensive summary
        self.print_comprehensive_summary()
        
        # Return results
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        critical_tests = ["payment_packages_endpoint", "service_categories", "admin_login", "pro_registration"]
        critical_passed = sum(1 for test in critical_tests if self.test_results.get(test, {}).get("success", False))
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "critical_tests": len(critical_tests),
            "critical_passed": critical_passed,
            "success_rate": (passed_tests / total_tests) * 100 if total_tests > 0 else 0,
            "critical_success_rate": (critical_passed / len(critical_tests)) * 100 if critical_tests else 0
        }
    
    def print_comprehensive_summary(self):
        """Print comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        
        # Categorize results
        categories = {
            "CRITICAL": ["payment_packages_endpoint", "service_categories"],
            "ADMIN": ["admin_login", "admin_analytics", "admin_settings", "admin_users_management", "admin_categories_management", "admin_payments_management"],
            "CUSTOMER": ["customer_registration", "customer_login", "customer_post_job"],
            "PRO": ["pro_registration", "pro_login", "pro_browse_jobs", "pro_submit_quote"],
            "PAYMENT": ["stripe_checkout_creation"]
        }
        
        for category, test_names in categories.items():
            print(f"\n{category} TESTS:")
            category_passed = 0
            category_total = 0
            
            for test_name in test_names:
                if test_name in self.test_results:
                    result = self.test_results[test_name]
                    status = "✅ PASS" if result["success"] else "❌ FAIL"
                    message = result["message"]
                    print(f"  {test_name.replace('_', ' ').title()}: {status} - {message}")
                    
                    category_total += 1
                    if result["success"]:
                        category_passed += 1
            
            if category_total > 0:
                success_rate = (category_passed / category_total) * 100
                print(f"  {category} Success Rate: {category_passed}/{category_total} ({success_rate:.1f}%)")
        
        # Overall summary
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        overall_rate = (passed_tests / total_tests) * 100 if total_tests > 0 else 0
        
        print(f"\n🎯 OVERALL RESULTS: {passed_tests}/{total_tests} tests passed ({overall_rate:.1f}%)")
        
        # Critical issues
        critical_failures = []
        for test_name, result in self.test_results.items():
            if not result["success"] and test_name in ["payment_packages_endpoint", "service_categories", "admin_login", "pro_registration"]:
                critical_failures.append(f"{test_name}: {result['message']}")
        
        if critical_failures:
            print(f"\n🚨 CRITICAL FAILURES:")
            for failure in critical_failures:
                print(f"  - {failure}")
        
        if overall_rate >= 90:
            print("🎉 EXCELLENT: System is working well!")
        elif overall_rate >= 70:
            print("⚠️  GOOD: Most features working, some issues to fix")
        elif overall_rate >= 50:
            print("⚠️  MODERATE: Significant issues need attention")
        else:
            print("🚨 CRITICAL: Major system failures detected!")

def main():
    """Main function to run comprehensive tests"""
    tester = ComprehensiveFixItNowTester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    if results["critical_success_rate"] < 75 or results["success_rate"] < 60:
        return 1  # Critical failures
    else:
        return 0  # Acceptable results

if __name__ == "__main__":
    exit(main())