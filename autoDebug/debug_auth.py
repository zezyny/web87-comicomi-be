import requests
import json

API_BASE_URL = "http://localhost:8080/auth"  # Adjust if your API is running on a different URL

def test_register(user_data):
    """Tests the /register endpoint."""
    print("\n--- Testing /register ---")
    url = f"{API_BASE_URL}/register"
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, data=json.dumps(user_data))

    print(f"Request URL: {url}")
    print(f"Request Body: {user_data}")
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    if response.status_code == 201:
        try:
            response_json = response.json()
            access_token = response_json.get('accessToken')
            refresh_token = response_json.get('refreshToken')
            if access_token and refresh_token:
                print("Register Test: ✅ Success! User registered, tokens received.")
                return access_token, refresh_token, user_data['email']
            else:
                print("Register Test: ❌ Failure! Tokens not found in successful response.")
                return None, None, None
        except json.JSONDecodeError:
            print("Register Test: ❌ Failure! Could not decode JSON response.")
            return None, None, None
    else:
        print(f"Register Test: ❌ Failure! Status code is not 201.")
        return None, None, None

def test_login(login_data, test_case_name="Login Test"):
    """Tests the /login endpoint, including valid and invalid cases."""
    print(f"\n--- Testing /login - {test_case_name} ---")
    url = f"{API_BASE_URL}/login"
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, headers=headers, data=json.dumps(login_data))

    print(f"Request URL: {url}")
    print(f"Request Body: {login_data}")
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    if response.status_code == 200:
        try:
            response_json = response.json()
            access_token = response_json.get('accessToken')
            refresh_token = response_json.get('refreshToken')
            if access_token and refresh_token:
                print(f"{test_case_name}: ✅ Success! User logged in, tokens received.")
                return access_token, refresh_token, login_data['email'], True # Return success flag
            else:
                print(f"{test_case_name}: ❌ Failure! Tokens not found in successful response.")
                return None, None, None, False
        except json.JSONDecodeError:
            print(f"{test_case_name}: ❌ Failure! Could not decode JSON response.")
            return None, None, None, False
    else:
        print(f"{test_case_name}: ❌ Expected Failure (for invalid cases). Status Code: {response.status_code}")
        return None, None, None, False # Indicate failure for invalid login cases

def test_refresh_token(refresh_token, test_case_name="Refresh Token Test"):
    """Tests the /refresh-token endpoint, including invalid token case."""
    print(f"\n--- Testing /refresh-token - {test_case_name} ---")
    url = f"{API_BASE_URL}/refresh-token"
    headers = {'Content-Type': 'application/json'}
    data = {'refreshToken': refresh_token}
    response = requests.post(url, headers=headers, data=json.dumps(data))

    print(f"Request URL: {url}")
    print(f"Request Body: {data}")
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    if response.status_code == 200:
        try:
            response_json = response.json()
            access_token = response_json.get('accessToken')
            if access_token:
                print(f"{test_case_name}: ✅ Success! New access token received.")
                return access_token, True # Return success flag
            else:
                print(f"{test_case_name}: ❌ Failure! Access token not found in successful response.")
                return None, False
        except json.JSONDecodeError:
            print(f"{test_case_name}: ❌ Failure! Could not decode JSON response.")
            return None, False
    else:
        print(f"{test_case_name}: ❌ Expected Failure (for invalid cases). Status Code: {response.status_code}")
        return None, False # Indicate failure for invalid refresh token cases


def test_validate_user(access_token, email, test_case_name="Validate User Test"):
    """Tests the /dev/validate-user endpoint, including invalid token case."""
    print(f"\n--- Testing /dev/validate-user - {test_case_name} ---")
    url = f"{API_BASE_URL}/dev/validate-user"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    data = {'email': email}
    response = requests.post(url, headers=headers, data=json.dumps(data))

    print(f"Request URL: {url}")
    print(f"Request Headers: {headers}")
    print(f"Request Body: {data}")
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    if response.status_code == 200:
        print(f"{test_case_name}: ✅ Success! User validated.")
        return True
    else:
        print(f"{test_case_name}: ❌ Expected Failure (for invalid cases). Status Code: {response.status_code}")
        return False # Indicate failure for invalid token cases


if __name__ == "__main__":
    print("--- Starting API Endpoint Debugging ---")

    # --- Test Data ---
    user_registration_data = {
        "userName": "testuser_debug_2", # Changed username to avoid conflicts if re-running quickly
        "email": "testdebug2@example.com", # Changed email to avoid conflicts
        "password": "debugpassword123",
        "role": "member"
    }
    valid_login_credentials = {
        "email": user_registration_data["email"],
        "password": user_registration_data["password"]
    }
    invalid_password_credentials = {
        "email": user_registration_data["email"],
        "password": "wrongpassword"
    }
    invalid_email_credentials = {
        "email": "wrongemail@example.com", # Non-registered email
        "password": user_registration_data["password"] # Password doesn't matter for invalid email test
    }

    # --- Test Execution ---
    access_token_reg, refresh_token_reg, reg_email = test_register(user_registration_data)

    if access_token_reg and refresh_token_reg:
        # --- Valid Login Test ---
        access_token_login, refresh_token_login, login_email, login_success = test_login(valid_login_credentials, "Valid Login Test")

        if login_success:
            # --- Refresh Token Test ---
            new_access_token, refresh_success = test_refresh_token(refresh_token_login, "Valid Refresh Token Test")
            if refresh_success:
                # --- Validate User Test ---
                validate_success = test_validate_user(access_token_login, login_email, "Valid Validate User Test") # Using login token for validate. You can use new_access_token as well

                # --- Invalid Password Login Test ---
                test_login(invalid_password_credentials, "Invalid Password Login Test")

                # --- Invalid Email Login Test ---
                test_login(invalid_email_credentials, "Invalid Email Login Test")

                # --- Invalid Refresh Token Test ---
                test_refresh_token("invalid_refresh_token", "Invalid Refresh Token Test") # Use a dummy invalid token

                # --- Invalid Access Token Validate User Test ---
                test_validate_user("invalid_access_token", login_email, "Invalid Access Token Validate User Test") # Dummy invalid token


                if validate_success:
                    print("\n✅ All Positive Tests Passed! (Register, Login, Refresh, Validate)")
                else:
                    print("\n❌ Debugging finished with failures in Validate User path.")
            else:
                print("\n❌ Debugging finished with failures in Refresh Token path.")
        else:
            print("\n❌ Debugging finished with failures in Login path.")

    else:
        print("\n❌ Debugging finished with failures in Register path.")

    print("\n--- Debugging Finished ---")