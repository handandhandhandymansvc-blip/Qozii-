#!/usr/bin/env python3
"""
Backend Testing for FixItNow Marketplace Customer App
Tests all Customer-related functionality including registration, login, job posting,
browsing pros, viewing quotes, messaging, and navigation.
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Backend URL from frontend .env
BACKEND_URL = "https://homefix-platform-1.preview.emergentagent.com/api"

class FixItNowCustomerTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.test_customer_id = None
        self.test_customer_email = f"testcustomer_{int(time.time())}@example.com"
        self.test_customer_password = "TestCustomer123"
        self.test_job_id = None
        self.test_pro_id = None
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
        
    def test_customer_registration(self):
        """Test Customer registration with all required fields"""
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
                print(f"Response: {json.dumps(result, indent=2)}")
                
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
        """Test Customer login functionality"""
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
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if result.get("success") and "user" in result:
                    user = result["user"]
                    if user["role"] == "customer":
                        self.log_test("customer_login", True, f"Customer login successful for {user['email']}", result)
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
    
    def test_get_customer_profile(self):
        """Test getting Customer profile"""
        print("\n=== Testing Get Customer Profile ===")
        
        if not self.test_customer_id:
            self.log_test("get_customer_profile", False, "No customer ID available")
            return False
        
        try:
            response = requests.get(f"{self.backend_url}/users/{self.test_customer_id}", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                # Check if profile has expected fields
                expected_fields = ["id", "email", "name", "phone", "role", "created_at", "is_active"]
                missing_fields = [field for field in expected_fields if field not in result]
                
                if not missing_fields and result["role"] == "customer":
                    self.log_test("get_customer_profile", True, f"Customer profile retrieved with all fields", result)
                    return True
                else:
                    self.log_test("get_customer_profile", False, f"Missing fields: {missing_fields} or wrong role", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("get_customer_profile", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("get_customer_profile", False, f"Exception: {str(e)}")
            return False
    
    def test_post_job(self):
        """Test posting a new job"""
        print("\n=== Testing Post Job ===")
        
        if not self.test_customer_id:
            self.log_test("post_job", False, "No customer ID available")
            return False
        
        job_data = {
            "title": "Fix Kitchen Faucet",
            "description": "My kitchen faucet is leaking and needs to be repaired or replaced. The leak is coming from the base of the faucet.",
            "category": "plumbing",
            "location": "New York, NY",
            "zipcode": "10001",
            "budget_min": 100.0,
            "budget_max": 300.0,
            "timeline": "urgent",
            "images": []
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
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if result.get("success") and "job" in result:
                    job = result["job"]
                    self.test_job_id = job["id"]
                    
                    # Verify job fields
                    expected_fields = ["id", "customer_id", "title", "description", "category", "location", "status"]
                    missing_fields = [field for field in expected_fields if field not in job]
                    
                    if not missing_fields:
                        self.log_test("post_job", True, f"Job posted successfully with ID: {self.test_job_id}", result)
                        return True
                    else:
                        self.log_test("post_job", False, f"Missing job fields: {missing_fields}", result)
                        return False
                else:
                    self.log_test("post_job", False, "Invalid response format", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("post_job", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("post_job", False, f"Exception: {str(e)}")
            return False
    
    def test_get_customer_jobs(self):
        """Test getting customer's jobs"""
        print("\n=== Testing Get Customer Jobs ===")
        
        if not self.test_customer_id:
            self.log_test("get_customer_jobs", False, "No customer ID available")
            return False
        
        try:
            response = requests.get(f"{self.backend_url}/jobs?customer_id={self.test_customer_id}", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} jobs for customer")
                
                if len(result) > 0:
                    job = result[0]
                    expected_fields = ["id", "customer_id", "title", "description", "status", "created_at"]
                    missing_fields = [field for field in expected_fields if field not in job]
                    
                    if not missing_fields:
                        self.log_test("get_customer_jobs", True, f"Retrieved {len(result)} customer jobs with all fields", result)
                        return True
                    else:
                        self.log_test("get_customer_jobs", False, f"Missing fields in job: {missing_fields}")
                        return False
                else:
                    self.log_test("get_customer_jobs", True, "No jobs found (expected for new customer)", result)
                    return True
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("get_customer_jobs", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("get_customer_jobs", False, f"Exception: {str(e)}")
            return False
    
    def test_get_job_details(self):
        """Test getting specific job details"""
        print("\n=== Testing Get Job Details ===")
        
        if not self.test_job_id:
            self.log_test("get_job_details", False, "No job ID available")
            return False
        
        try:
            response = requests.get(f"{self.backend_url}/jobs/{self.test_job_id}", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                expected_fields = ["id", "customer_id", "title", "description", "category", "location", "status", "quotes_count"]
                missing_fields = [field for field in expected_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("get_job_details", True, f"Job details retrieved with all fields", result)
                    return True
                else:
                    self.log_test("get_job_details", False, f"Missing fields: {missing_fields}", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("get_job_details", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("get_job_details", False, f"Exception: {str(e)}")
            return False
    
    def test_browse_pros(self):
        """Test browsing available professionals"""
        print("\n=== Testing Browse Pros ===")
        
        try:
            # Test getting all pros
            response = requests.get(f"{self.backend_url}/pros/search", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} pros")
                
                # Test with category filter
                response2 = requests.get(f"{self.backend_url}/pros/search?category=plumbing", timeout=10)
                if response2.status_code == 200:
                    filtered_result = response2.json()
                    print(f"Found {len(filtered_result)} plumbing pros")
                    
                    self.log_test("browse_pros", True, f"Retrieved {len(result)} total pros, {len(filtered_result)} plumbing pros", result)
                    return True
                else:
                    self.log_test("browse_pros", False, f"Filter test failed: {response2.status_code}")
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("browse_pros", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("browse_pros", False, f"Exception: {str(e)}")
            return False
    
    def test_create_test_pro_and_quote(self):
        """Create a test pro and quote for testing customer quote viewing"""
        print("\n=== Creating Test Pro and Quote ===")
        
        if not self.test_job_id:
            self.log_test("create_test_pro_and_quote", False, "No job ID available")
            return False
        
        # Create a test pro
        pro_data = {
            "email": f"testpro_{int(time.time())}@example.com",
            "password": "TestPro123",
            "name": "Test Professional",
            "phone": "(555) 987-6543",
            "role": "pro"
        }
        
        try:
            # Register pro
            response = requests.post(f"{self.backend_url}/users/register", json=pro_data, timeout=10)
            if response.status_code != 200:
                self.log_test("create_test_pro_and_quote", False, "Failed to create test pro")
                return False
            
            pro = response.json()["user"]
            self.test_pro_id = pro["id"]
            
            # Set pro budget
            budget_response = requests.put(f"{self.backend_url}/pros/{self.test_pro_id}/budget?budget=100", timeout=10)
            if budget_response.status_code != 200:
                self.log_test("create_test_pro_and_quote", False, "Failed to set pro budget")
                return False
            
            # Create quote
            quote_data = {
                "job_id": self.test_job_id,
                "message": "I can fix your kitchen faucet quickly and professionally. I have 5+ years of plumbing experience.",
                "price": 175.0,
                "estimated_duration": "2-3 hours"
            }
            
            response = requests.post(f"{self.backend_url}/quotes?pro_id={self.test_pro_id}", json=quote_data, timeout=10)
            print(f"Quote creation status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and "quote" in result:
                    quote_id = result["quote"]["id"]
                    self.log_test("create_test_pro_and_quote", True, f"Test pro and quote created. Quote ID: {quote_id}")
                    return True
                else:
                    self.log_test("create_test_pro_and_quote", False, "Invalid quote creation response")
                    return False
            else:
                self.log_test("create_test_pro_and_quote", False, f"Quote creation failed: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("create_test_pro_and_quote", False, f"Exception: {str(e)}")
            return False
    
    def test_view_quotes(self):
        """Test viewing quotes for a job"""
        print("\n=== Testing View Quotes ===")
        
        if not self.test_job_id:
            self.log_test("view_quotes", False, "No job ID available")
            return False
        
        try:
            response = requests.get(f"{self.backend_url}/quotes?job_id={self.test_job_id}", timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Found {len(result)} quotes for job")
                
                if len(result) > 0:
                    quote = result[0]
                    expected_fields = ["id", "job_id", "pro_id", "pro_name", "message", "price", "status", "created_at"]
                    missing_fields = [field for field in expected_fields if field not in quote]
                    
                    if not missing_fields:
                        self.log_test("view_quotes", True, f"Retrieved {len(result)} quotes with all fields", result)
                        return True
                    else:
                        self.log_test("view_quotes", False, f"Missing fields in quote: {missing_fields}")
                        return False
                else:
                    self.log_test("view_quotes", True, "No quotes found (expected for new job)", result)
                    return True
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("view_quotes", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("view_quotes", False, f"Exception: {str(e)}")
            return False
    
    def test_get_pro_profile(self):
        """Test getting pro profile details"""
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
                
                expected_fields = ["user_id", "rating", "total_jobs", "weekly_budget", "weekly_spent"]
                missing_fields = [field for field in expected_fields if field not in result]
                
                if not missing_fields:
                    self.log_test("get_pro_profile", True, f"Pro profile retrieved with all fields", result)
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
    
    def test_messaging_system(self):
        """Test messaging between customer and pro"""
        print("\n=== Testing Messaging System ===")
        
        if not self.test_customer_id or not self.test_pro_id or not self.test_job_id:
            self.log_test("messaging_system", False, "Missing required IDs for messaging test")
            return False
        
        # Create conversation ID
        conversation_id = f"{self.test_job_id}_{self.test_customer_id}_{self.test_pro_id}"
        
        # Send message from customer to pro
        message_data = {
            "conversation_id": conversation_id,
            "sender_id": self.test_customer_id,
            "receiver_id": self.test_pro_id,
            "message": "Hi, I'm interested in your quote. When can you start the work?"
        }
        
        try:
            response = requests.post(f"{self.backend_url}/messages", json=message_data, timeout=10)
            print(f"Send message status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Message sent: {json.dumps(result, indent=2)}")
                
                if result.get("success") and "message" in result:
                    # Test getting messages
                    time.sleep(1)  # Wait for message to be stored
                    
                    response2 = requests.get(f"{self.backend_url}/messages/{conversation_id}", timeout=10)
                    if response2.status_code == 200:
                        messages = response2.json()
                        print(f"Retrieved {len(messages)} messages")
                        
                        if len(messages) > 0:
                            message = messages[0]
                            expected_fields = ["id", "conversation_id", "sender_id", "receiver_id", "message", "created_at"]
                            missing_fields = [field for field in expected_fields if field not in message]
                            
                            if not missing_fields:
                                self.log_test("messaging_system", True, f"Message sent and retrieved successfully", result)
                                return True
                            else:
                                self.log_test("messaging_system", False, f"Missing message fields: {missing_fields}")
                                return False
                        else:
                            self.log_test("messaging_system", False, "No messages retrieved")
                            return False
                    else:
                        self.log_test("messaging_system", False, f"Failed to retrieve messages: {response2.status_code}")
                        return False
                else:
                    self.log_test("messaging_system", False, "Invalid message response", result)
                    return False
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                self.log_test("messaging_system", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("messaging_system", False, f"Exception: {str(e)}")
            return False
    
    def test_quote_status_update(self):
        """Test accepting/rejecting quotes"""
        print("\n=== Testing Quote Status Update ===")
        
        if not self.test_job_id:
            self.log_test("quote_status_update", False, "No job ID available")
            return False
        
        try:
            # First get quotes for the job
            response = requests.get(f"{self.backend_url}/quotes?job_id={self.test_job_id}", timeout=10)
            if response.status_code != 200 or len(response.json()) == 0:
                self.log_test("quote_status_update", False, "No quotes available to update")
                return False
            
            quote = response.json()[0]
            quote_id = quote["id"]
            
            # Test accepting the quote
            response2 = requests.put(f"{self.backend_url}/quotes/{quote_id}/status?status=accepted", timeout=10)
            print(f"Quote status update: {response2.status_code}")
            
            if response2.status_code == 200:
                result = response2.json()
                print(f"Response: {json.dumps(result, indent=2)}")
                
                if result.get("success"):
                    self.log_test("quote_status_update", True, f"Quote status updated to accepted", result)
                    return True
                else:
                    self.log_test("quote_status_update", False, "Status update failed", result)
                    return False
            else:
                error_msg = f"Status {response2.status_code}: {response2.text}"
                self.log_test("quote_status_update", False, error_msg)
                return False
                
        except Exception as e:
            self.log_test("quote_status_update", False, f"Exception: {str(e)}")
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
                        # Check if we have expected categories
                        category_values = [cat["value"] for cat in result]
                        expected_categories = ["handyman", "plumbing", "electrical", "painting"]
                        found_expected = [cat for cat in expected_categories if cat in category_values]
                        
                        if len(found_expected) >= 3:  # At least 3 expected categories
                            self.log_test("service_categories", True, f"Retrieved {len(result)} categories with expected ones: {found_expected}", result)
                            return True
                        else:
                            self.log_test("service_categories", False, f"Missing expected categories. Found: {category_values}")
                            return False
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
        """Run all backend tests for Customer functionality"""
        print("🚀 Starting FixItNow Marketplace Customer Backend Tests")
        print(f"Backend URL: {self.backend_url}")
        print(f"Test Customer Email: {self.test_customer_email}")
        print("=" * 80)
        
        # Run tests in order
        test_methods = [
            self.test_service_categories,
            self.test_customer_registration,
            self.test_customer_login,
            self.test_get_customer_profile,
            self.test_post_job,
            self.test_get_customer_jobs,
            self.test_get_job_details,
            self.test_browse_pros,
            self.test_create_test_pro_and_quote,
            self.test_view_quotes,
            self.test_get_pro_profile,
            self.test_messaging_system,
            self.test_quote_status_update,
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
        return passed_tests, total_tests
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("📊 CUSTOMER BACKEND TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results.values() if result["success"])
        
        for test_name, result in self.test_results.items():
            status = "✅ PASS" if result["success"] else "❌ FAIL"
            message = result["message"]
            print(f"{test_name.replace('_', ' ').title()}: {status} - {message}")
        
        print(f"\nOverall: {passed_tests}/{total_tests} tests passed ({(passed_tests/total_tests)*100:.1f}%)")
        
        if passed_tests == total_tests:
            print("🎉 All Customer backend tests PASSED!")
        else:
            print("⚠️  Some Customer backend tests FAILED!")
            print("\nFailed tests:")
            for test_name, result in self.test_results.items():
                if not result["success"]:
                    print(f"  - {test_name}: {result['message']}")

def main():
    """Main function to run all tests"""
    tester = FixItNowCustomerTester()
    passed_tests, total_tests = tester.run_all_tests()
    return 0 if passed_tests == total_tests else 1

if __name__ == "__main__":
    exit(main())