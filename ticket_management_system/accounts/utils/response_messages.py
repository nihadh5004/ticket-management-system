from rest_framework import status


def custom_response(status_code, success, message, data=None):
    return {
        "status_code": status_code,
        "success": success,
        "message": message,
        "data": data
    }

def internal_server_error_response(e):
    return custom_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        success=False,
        message=f"Something went wrong: {str(e)}"
    )

def login_success(response_data):
    return custom_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Login successful",
        data=response_data
    )

def invalid_credentials():
    return custom_response(
        status_code=status.HTTP_401_UNAUTHORIZED,
        success=False,
        message="Invalid credentials",
        data=None
    )


def invalid_input(errors=None):
    return custom_response(
        status_code=status.HTTP_400_BAD_REQUEST,
        success=False,
        message="Invalid input",
        data=errors
    )

def token_refresh_success(response_data):
    return custom_response(
        status_code=status.HTTP_200_OK,
        success=True,
        message="Token refreshed successfully",
        data=response_data
    )

def invalid_refresh_token(error_message):
    return custom_response(
        status_code=status.HTTP_400_BAD_REQUEST,
        success=False,
        message="Invalid refresh token",
        data=error_message
    )

def missing_refresh_token():
    return custom_response(
        status_code=status.HTTP_400_BAD_REQUEST,
        success=False,
        message="Refresh token not provided",
        data=None
    )

def user_already_exists():
    return custom_response(
        success= False,
        message= 'User with this username already exists',
        data= None,
        status_code= status.HTTP_400_BAD_REQUEST
    )

def signup_success(data=None):
    return custom_response(
        success= True,
        message= 'Signup successful',
        data= data,
        status_code= status.HTTP_201_CREATED
    )

def userlist_success(data=None):
    return custom_response(
        success= True,
        message= "Users retrieved successfully",
        data= data,
        status_code= status.HTTP_200_OK
    )

def permission_update_success(data=None):
    return custom_response(
        success= True,
        message=  "Permissions updated successfully",
        data= data,
        status_code= status.HTTP_200_OK
    )
