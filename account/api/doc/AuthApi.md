# Authentication API Documentation

This API provides endpoints for managing user authentication, including registration, login, logout, token refresh, and profile update.

## Endpoints

1. **Register a new user:**
   - URL: `http://127.0.0.1:8000/account/api/register/`
   - Method: POST
   - Body: JSON with the data for the new user.
     ```json
     {
       "username": "newuser",
       "email": "newuser@example.com",
       "password": "newuserpassword",
       "mobileNo": "1234567890",
       "profile_pic": null
     }
     ```
   - Description: Registers a new user with the provided username, email, password, mobile number, and profile picture (optional).

2. **Login and obtain JWT tokens:**
   - URL: `http://127.0.0.1:8000/account/api/login/`
   - Method: POST
   - Body: JSON with the login credentials.
     ```json
     {
       "email": "user@example.com",
       "password": "userpassword"
     }
     ```
   - Description: Authenticates the user with the provided email and password, returning access and refresh JWT tokens upon successful authentication.

3. **Logout and blacklist refresh token:**
   - URL: `http://127.0.0.1:8000/account/api/logout/`
   - Method: POST
   - Body: JSON containing the refresh token to blacklist.
     ```json
     {
       "refresh": "your_refresh_token_here"
     }
     ```
   - Description: Blacklists the provided refresh token, effectively logging the user out.

4. **Refresh access token:**
   - URL: `http://127.0.0.1:8000/account/api/token/refresh/`
   - Method: POST
   - Body: JSON containing the refresh token.
     ```json
     {
       "refresh": "your_refresh_token_here"
     }
     ```
   - Description: Provides a new access token given a valid refresh token.

5. **Update user profile:**
   - URL: `http://127.0.0.1:8000/account/api/profile/update/`
   - Method: PATCH
   - Authorization: Bearer <access_token>
   - Body: JSON with the data to update the user profile.
     ```json
     {
       "email": "newemail@example.com",
       "mobileNo": "9876543210",
       "profile_pic": "path_to_new_profile_pic.jpg"
     }
     ```
   - Description: Updates the current user's profile with the provided data. Requires a valid access token in the Authorization header.
