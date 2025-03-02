import requests
import json
import uuid

API_BASE_URL = "http://localhost:8080/api/v2/stories"
AUTH_API_BASE_URL = "http://localhost:8080/auth"

# --- User Credentials (Provide your pre-existing user data here) ---
ADMIN_USER_CREDENTIALS = {
    "email": "comicomi.admin@zeaky.dev",  # Replace with your admin user email
    "password": "verystrongpasswordforadmin@123"         # Replace with your admin user password
}
CREATOR_USER_CREDENTIALS = {
    "email": f"comicomi.tcreator@zeaky.dev", # Dynamic email for creator (can be changed to pre-existing)
    "password": "xiangyaofei@123"
}
MEMBER_USER_CREDENTIALS = {
    "email": f"comicomi.laotingtung@zeaky.dev",  # Dynamic email for member (can be changed to pre-existing)
    "password": "laotiengtung@123"
}

def register_user(user_data):
    """Registers a user and returns access/refresh tokens or None if failed."""
    url = f"{AUTH_API_BASE_URL}/register"
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, headers=headers, data=json.dumps(user_data))
        response.raise_for_status()
        response_json = response.json()
        return response_json.get('accessToken'), response_json.get('refreshToken')
    except requests.exceptions.RequestException as e:
        print(f"User Registration Failed for {user_data.get('email', 'unknown')}: {e}")
        if response is not None:
            print(f"Status Code: {response.status_code}, Response Body: {response.text}")
        return None, None

def login_user(login_data):
    """Logs in a user and returns access/refresh tokens or None if failed."""
    url = f"{AUTH_API_BASE_URL}/login"
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.post(url, headers=headers, data=json.dumps(login_data))
        response.raise_for_status()
        response_json = response.json()
        return response_json.get('accessToken'), response_json.get('refreshToken')
    except requests.exceptions.RequestException as e:
        print(f"User Login Failed for {login_data.get('email', 'unknown')}: {e}")
        if response is not None:
            print(f"Status Code: {response.status_code}, Response Body: {response.text}")
        return None, None

def api_request(method, endpoint, headers=None, data=None, expected_status=None, test_case_name="API Test"):
    """Generic function to make API requests and handle responses."""
    url = f"{API_BASE_URL}{endpoint}"
    request_method = getattr(requests, method.lower())
    response = None

    print(f"\n--- Testing {method.upper()} {endpoint} - {test_case_name} ---")
    print(f"Request URL: {url}")
    if headers: print(f"Request Headers: {headers}")
    if data: print(f"Request Body: {data}")

    try:
        response = request_method(url, headers=headers, data=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        response.raise_for_status()

        if expected_status and response.status_code == expected_status:
            print(f"{test_case_name}: ✅ Success! Status code {expected_status} as expected.")
            return response, True
        elif expected_status is None:
            print(f"{test_case_name}: ✅ Success! Status code {response.status_code}.")
            return response, True
        else:
            print(f"{test_case_name}: ❌ Failure! Expected status {expected_status}, got {response.status_code}.")
            return response, False

    except requests.exceptions.RequestException as e:
        print(f"{test_case_name}: ❌ Request Exception: {e}")
        if response is not None:
            print(f"Status Code: {response.status_code}, Response Body: {response.text}")
        return response, False

def test_create_story(access_token, story_data, expected_status, test_case_name):
    """Tests the create story endpoint using api_request."""
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    response, success = api_request("POST", "", headers, json.dumps(story_data), expected_status, test_case_name)
    story_id = None
    if success and expected_status == 201:
        try:
            story_id = response.json().get('story').get('_id')
            if story_id:
                print(f"{test_case_name}: Story ID extracted: {story_id}")
            else:
                print(f"{test_case_name}: Warning: Story ID not found in response body.")
        except json.JSONDecodeError:
            print(f"{test_case_name}: Warning: Could not decode JSON response to extract story ID.")
            success = False
    return story_id, success

def test_get_story(story_id, expected_status, test_case_name):
    """Tests the get story endpoint using api_request."""
    endpoint = f"/{story_id}"
    _, success = api_request("GET", endpoint, expected_status=expected_status, test_case_name=test_case_name)
    return success

def test_delete_story(access_token, story_id, expected_status, test_case_name):
    """Tests the delete story endpoint using api_request."""
    endpoint = f"/{story_id}"
    headers = {'Authorization': f'Bearer {access_token}'}
    _, success = api_request("DELETE", endpoint, headers=headers, expected_status=expected_status, test_case_name=test_case_name)
    return success


if __name__ == "__main__":
    print("--- Starting Story API Endpoint Debugging ---")

    # --- Login Test Users (No Admin Registration) ---
    print("\n--- Logging in users ---")
    admin_access_token, _ = login_user(ADMIN_USER_CREDENTIALS)
    creator_access_token, _ = login_user(CREATOR_USER_CREDENTIALS)
    member_access_token, _ = login_user(MEMBER_USER_CREDENTIALS)

    if not admin_access_token:
        print(f"\n❌ Login failed for Admin user with email: {ADMIN_USER_CREDENTIALS['email']}. Aborting tests.")
    if not creator_access_token:
        print(f"\n❌ Login failed for Creator user with email: {CREATOR_USER_CREDENTIALS['email']}. Aborting tests.")
    if not member_access_token:
        print(f"\n❌ Login failed for Member user with email: {MEMBER_USER_CREDENTIALS['email']}. Aborting tests.")

    if not all([admin_access_token, creator_access_token, member_access_token]):
        print("\n❌ Aborting Story API tests due to authentication failures.")
    else:
        print("\n✅ User Logins Successful. Proceeding with Story API tests...")

        # --- Test Story Data ---
        valid_story_data = {
            "title": f"Valid Story Title {uuid.uuid4()}",
            "type": "comic",
            "genre": ["fantasy", "adventure"],
            "status": "ongoing",
            "description": "A thrilling adventure story..."
        }
        invalid_story_data_missing_title = {
            "type": "comic",
            "genre": ["fantasy"],
            "status": "ongoing",
            "description": "Story without title..."
        }

        # --- Test Execution ---
        created_story_id, create_success = test_create_story(admin_access_token, valid_story_data, 201, "Valid Create Story (Admin)")

        if create_success and created_story_id:
            test_get_story(created_story_id, 200, "Valid Get Story")
            test_get_story("invalid-objectid-format", 400, "Invalid Story ID Format Get Story")
            test_get_story("65d9e3f7b397b94ff5a7c999", 404, "Non-Existent Story ID Get Story")

            test_create_story(admin_access_token, invalid_story_data_missing_title, 400, "Invalid Create Story - Missing Title")
            test_create_story(member_access_token, valid_story_data, 201, "Valid Create Story (Member - Creator Role by default)")

            test_delete_story(admin_access_token, created_story_id, 200, "Valid Delete Story (Admin)")
            test_delete_story(creator_access_token, created_story_id, 404, "Invalid Delete Story (Creator - Story Already Deleted by Admin)")

            # Re-create story for creator delete test
            created_story_id_creator_delete, _ = test_create_story(creator_access_token, valid_story_data, 201, "Re-create Story for Creator Delete Test")
            if created_story_id_creator_delete:
                test_delete_story(creator_access_token, created_story_id_creator_delete, 200, "Valid Delete Story (Creator)")
                test_delete_story(member_access_token, created_story_id_creator_delete, 403, "Invalid Delete Story (Member - Not Creator/Admin)")
                test_delete_story(admin_access_token, created_story_id_creator_delete, 404, "Invalid Delete Story (Admin - Already deleted by creator)")

            test_delete_story(admin_access_token, "invalid-objectid-format", 400, "Invalid Story ID Format Delete Story")
            test_delete_story(admin_access_token, "65d9e3f7b397b94ff5a7c999", 404, "Non-Existent Story ID Delete Story")
            test_delete_story("invalid_token", created_story_id, 401, "Invalid Token Delete Story")

            print("\n✅ Story API Tests Completed! Check output for individual test results.")
        else:
            print("\n❌ Debugging finished with failures in Create Story path.")

    print("\n--- Story API Debugging Finished ---")