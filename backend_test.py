#!/usr/bin/env python3
"""
Backend Testing for FixItNow Marketplace Pro App
Tests all Pro-related functionality including registration, login, profile management,
job browsing, quote submission, budget tracking, and payment integration.
"""

import requests
import json
import time
import uuid
import base64
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://homefix-platform-1.preview.emergentagent.com/api"

class FixItNowProTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.test_pro_id = None
        self.test_pro_email = f"testpro_{int(time.time())}@example.com"
        self.test_pro_password = "TestPro123"
        self.test_results = {}
        
    def log_test(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results[test_name] = {
            "success": success,
            "message": message,
            "response_data": response_data
        }
        
    def test_pro_registration(self):
        """Test Pro registration with all required fields"""
        print("\n=== Testing Pro Registration ===")
        
        registration_data = {
            "email": self.test_pro_email,
            "password": self.test_pro_password,
            "name": "Test Professional",
            "phone": "(555) 123-4567",
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
                    self.log_test("pro_registration", True, f"Pro registered with ID: {self.test_pro_id}", result)
                    return True
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
        """Test Pro login functionality"""
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
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if result.get("success") and "user" in result:
                    user = result["user"]
                    if user["role"] == "pro":
                        self.log_test("pro_login", True, f"Pro login successful for {user['email']}", result)
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
    
    def test_get_pro_profile(self):
        """Test getting Pro profile"""
        print("\n=== Testing Get Pro Profile ===")
        
        if not self.test_pro_id:
            self.log_test("get_pro_profile", False, "No pro ID available")
            return False
        
        try:
            response = requests.get(f"{self.backend_url}/pros/{self.test_pro_id}/profile", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                # Check if profile has expected fields
                expected_fields = ["user_id", "weekly_budget", "weekly_spent", "rating", "total_jobs"]
                missing_fields = [field for field in expected_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("get_pro_profile", True, f"Profile retrieved with all fields", result)
                    return True
                else:
                    self.log_test("get_pro_profile", False, f"Missing fields: {missing_fields}", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("get_pro_profile", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("get_pro_profile", False, f"Exception: {str(e)}")
            return False
    
    def test_update_pro_profile(self):
        """Test updating Pro profile"""
        print("\n=== Testing Update Pro Profile ===")
        
        if not self.test_pro_id:
            self.log_test("update_pro_profile", False, "No pro ID available")
            return False
        
        profile_update = {
            "bio": "Experienced professional with 10+ years in home services",
            "services": ["handyman", "plumbing"],
            "service_areas": ["New York", "Brooklyn"],
            "hourly_rate": 75.0,
            "years_experience": 10,
            "cashapp_handle": "testpro123"
        }
        
        try:
            response = requests.put(
                f"{self.backend_url}/pros/{self.test_pro_id}/profile",
                json=profile_update,
                timeout=10
            )
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if result.get("success"):
                    self.log_test("update_pro_profile", True, "Profile updated successfully", result)
                    return True
                else:
                    self.log_test("update_pro_profile", False, "Update failed", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("update_pro_profile", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("update_pro_profile", False, f"Exception: {str(e)}")
            return False
    
    def test_image_upload(self):
        """Test image upload functionality"""
        print("\n=== Testing Image Upload ===")
        
        if not self.test_pro_id:
            self.log_test("image_upload", False, "No pro ID available")
            return False
        
        # Create a simple base64 image (1x1 pixel PNG)
        test_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        
        # Test profile image upload
        image_data = {
            "type": "profile",
            "image": test_image
        }
        
        try:
            response = requests.post(
                f"{self.backend_url}/pros/{self.test_pro_id}/upload-image",
                json=image_data,
                timeout=10
            )
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if result.get("success"):
                    self.log_test("image_upload", True, "Image uploaded successfully", result)
                    return True
                else:
                    self.log_test("image_upload", False, "Upload failed", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("image_upload", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("image_upload", False, f"Exception: {str(e)}")
            return False
    
    def test_browse_jobs(self):
        """Test browsing available jobs"""
        print("\n=== Testing Browse Jobs ===")
        
        try:
            # Test getting all open jobs
            response = requests.get(f"{self.backend_url}/jobs?status=open", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} jobs")
                
                # Test with category filter
                response2 = requests.get(f"{self.backend_url}/jobs?status=open&category=handyman", timeout=10)
                if response2.status_code == 200:
                    filtered_result = response2.json()
                    print(f"Found {len(filtered_result)} handyman jobs")
                    
                    self.log_test("browse_jobs", True, f"Retrieved {len(result)} total jobs, {len(filtered_result)} handyman jobs", result)
                    return True
                else:
                    self.log_test("browse_jobs", False, f"Filter test failed: {response2.status_code}")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("browse_jobs", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("browse_jobs", False, f"Exception: {str(e)}")
            return False
    
    def test_create_test_job(self):
        """Create a test job for quote submission testing"""
        print("\n=== Creating Test Job ===")
        
        # First create a test customer
        customer_data = {
            "email": f"testcustomer_{int(time.time())}@example.com",
            "password": "TestCustomer123",
            "name": "Test Customer",
            "phone": "(555) 987-6543",
            "role": "customer"
        }
        
        try:
            # Register customer
            response = requests.post(f"{self.backend_url}/users/register", json=customer_data, timeout=10)
            if response.status_code != 200:
                self.log_test("create_test_job", False, "Failed to create test customer")
                return None
            
            customer = response.json()["user"]
            customer_id = customer["id"]
            
            # Create job
            job_data = {
                "title": "Test Plumbing Job",
                "description": "Need to fix a leaky faucet in the kitchen",
                "category": "plumbing",
                "location": "New York, NY",
                "zipcode": "10001",
                "budget_min": 100.0,
                "budget_max": 200.0,
                "timeline": "urgent"
            }
            
            response = requests.post(f"{self.backend_url}/jobs?customer_id={customer_id}", json=job_data, timeout=10)
            print(f"Job creation status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "job" in result:
                    job_id = result["job"]["id"]
                    self.log_test("create_test_job", True, f"Test job created with ID: {job_id}")
                    return job_id
                else:
                    self.log_test("create_test_job", False, "Invalid job creation response")
                    return None
            else:
                self.log_test("create_test_job", False, f"Job creation failed: {response.status_code}")
                return None
                
        except Exception as e:
            self.log_test("create_test_job", False, f"Exception: {str(e)}")
            return None
    
    def test_submit_quote(self):
        """Test submitting a quote (should deduct $10 from budget)"""
        print("\n=== Testing Submit Quote ===")
        
        if not self.test_pro_id:
            self.log_test("submit_quote", False, "No pro ID available")
            return False
        
        # First, add some budget to the pro
        try:
            budget_response = requests.put(f"{self.backend_url}/pros/{self.test_pro_id}/budget?budget=100", timeout=10)
            if budget_response.status_code != 200:
                self.log_test("submit_quote", False, "Failed to set initial budget")
                return False
        except Exception as e:
            self.log_test("submit_quote", False, f"Budget setup failed: {str(e)}")
            return False
        
        # Create a test job
        job_id = self.test_create_test_job()
        if not job_id:
            return False
        
        # Get initial budget
        try:
            profile_response = requests.get(f"{self.backend_url}/pros/{self.test_pro_id}/profile", timeout=10)
            if profile_response.status_code == 200:
                initial_profile = profile_response.json()
                initial_spent = initial_profile.get("weekly_spent", 0)
                print(f"Initial weekly spent: ${initial_spent}")
            else:
                self.log_test("submit_quote", False, "Failed to get initial profile")
                return False
        except Exception as e:
            self.log_test("submit_quote", False, f"Failed to get initial profile: {str(e)}")
            return False
        
        # Submit quote
        quote_data = {
            "job_id": job_id,
            "message": "I can fix your plumbing issue quickly and efficiently. I have 10+ years of experience.",
            "price": 150.0,
            "estimated_duration": "2 hours"
        }
        
        try:
            response = requests.post(f"{self.backend_url}/quotes?pro_id={self.test_pro_id}", json=quote_data, timeout=10)
            print(f"Quote submission status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Quote response: {json.dumps(result, indent=2)}")
                
                if result.get("success") and "quote" in result:
                    # Check if budget was deducted
                    time.sleep(1)  # Wait for database update
                    
                    profile_response = requests.get(f"{self.backend_url}/pros/{self.test_pro_id}/profile", timeout=10)
                    if profile_response.status_code == 200:
                        updated_profile = profile_response.json()
                        updated_spent = updated_profile.get("weekly_spent", 0)
                        print(f"Updated weekly spent: ${updated_spent}")
                        
                        if updated_spent == initial_spent + 10:
                            self.log_test("submit_quote", True, f"Quote submitted and $10 deducted from budget", result)
                            return True
                        else:
                            self.log_test("submit_quote", False, f"Budget not deducted correctly. Expected: {initial_spent + 10}, Got: {updated_spent}")
                            return False
                    else:
                        self.log_test("submit_quote", False, "Failed to verify budget deduction")
                        return False
                else:
                    self.log_test("submit_quote", False, "Invalid quote response", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("submit_quote", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("submit_quote", False, f"Exception: {str(e)}")
            return False
    
    def test_get_my_quotes(self):
        """Test getting pro's submitted quotes"""
        print("\n=== Testing Get My Quotes ===")
        
        if not self.test_pro_id:
            self.log_test("get_my_quotes", False, "No pro ID available")
            return False
        
        try:
            response = requests.get(f"{self.backend_url}/quotes?pro_id={self.test_pro_id}", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} quotes")
                
                # Check if we have at least one quote (from previous test)
                if len(result) > 0:
                    quote = result[0]
                    expected_fields = ["id", "job_id", "pro_id", "message", "price", "status", "created_at"]
                    missing_fields = [field for field in expected_fields if field not in quote]
                    
                    if not missing_fields:
                        self.log_test("get_my_quotes", True, f"Retrieved {len(result)} quotes with all fields", result)
                        return True
                    else:
                        self.log_test("get_my_quotes", False, f"Missing fields in quote: {missing_fields}")
                        return False
                else:
                    self.log_test("get_my_quotes", True, "No quotes found (expected for new pro)", result)
                    return True
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("get_my_quotes", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("get_my_quotes", False, f"Exception: {str(e)}")
            return False
    
    def test_payment_packages(self):
        """Test getting payment packages"""
        print("\n=== Testing Payment Packages ===")
        
        try:
            response = requests.get(f"{self.backend_url}/payments/packages", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                # Check if we have the expected packages
                expected_packages = ["starter", "basic", "pro", "premium"]
                found_packages = list(result.keys()) if isinstance(result, dict) else []
                
                if all(pkg in found_packages for pkg in expected_packages):
                    self.log_test("payment_packages", True, f"All expected packages found: {found_packages}", result)
                    return True
                else:
                    self.log_test("payment_packages", False, f"Missing packages. Expected: {expected_packages}, Found: {found_packages}")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("payment_packages", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("payment_packages", False, f"Exception: {str(e)}")
            return False
    
    def test_create_checkout_session(self):
        """Test creating Stripe checkout session"""
        print("\n=== Testing Create Checkout Session ===")
        
        if not self.test_pro_id:
            self.log_test("create_checkout_session", False, "No pro ID available")
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
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if "url" in result and "session_id" in result:
                    self.log_test("create_checkout_session", True, f"Checkout session created with URL", result)
                    return True
                else:
                    self.log_test("create_checkout_session", False, "Missing URL or session_id in response", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("create_checkout_session", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("create_checkout_session", False, f"Exception: {str(e)}")
            return False
    
    def test_service_categories(self):
        """Test getting service categories"""
        print("\n=== Testing Service Categories ===")
        
        try:
            response = requests.get(f"{self.backend_url}/categories", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} categories")
                
                if len(result) > 0:
                    category = result[0]
                    expected_fields = ["id", "name", "value", "is_active"]
                    missing_fields = [field for field in expected_fields if field not in category]
                    
                    if not missing_fields:
                        self.log_test("service_categories", True, f"Retrieved {len(result)} categories with all fields", result)
                        return True
                    else:
                        self.log_test("service_categories", False, f"Missing fields in category: {missing_fields}")
                        return False
                else:
                    self.log_test("service_categories", False, "No categories found")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("service_categories", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("service_categories", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests for Pro functionality"""
        print("🚀 Starting FixItNow Marketplace Pro Backend Tests")
        print(f"Backend URL: {self.backend_url}")
        print(f"Test Pro Email: {self.test_pro_email}")
        print("=" * 80)
        
        # Run tests in order
        test_methods = [
            self.test_service_categories,
            self.test_payment_packages,
            self.test_pro_registration,
            self.test_pro_login,
            self.test_get_pro_profile,
            self.test_update_pro_profile,
            self.test_image_upload,
            self.test_browse_jobs,
            self.test_submit_quote,
            self.test_get_my_quotes,
            self.test_create_checkout_session,
        ]
        
        for test_method in test_methods:
            try:
                test_method()
            except Exception as e:
                test_name = test_method.__name__
                self.log_test(test_name, False, f"Unexpected error: {str(e)}")
            
            time.sleep(0.5)  # Small delay between tests
        
        # Print summary
        self.print_summary()
        
        # Return overall success
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        return passed_tests == total_tests
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        
        for test_name, result in self.test_results.items():
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            message = result["message"]
            print(f"{test_name.replace('_', ' ').title()}: {status} - {message}")
        
        print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
        
        if passed_tests == total_tests:
            print("🎉 All tests PASSED!")
        else:
            print("⚠️  Some tests FAILED!")
            print("\nFailed tests:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  - {test_name}: {result['message']}")

def main():
    """Main function to run all tests"""
    tester = FixItNowProTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())