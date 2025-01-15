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

def invalid_input(errors=None):
    return custom_response(
        status_code=status.HTTP_400_BAD_REQUEST,
        success=False,
        message="Invalid input",
        data=errors
    )

def validation_error(error):
    return custom_response(
        status_code=status.HTTP_400_BAD_REQUEST,
        success=False,
        message=error,
    )

def forbidden_error(error):
    return custom_response(
        status_code=status.HTTP_403_FORBIDDEN,
        success=False,
        message=error,
    )

def tickets_list_success(data=None):
    return custom_response(
        success= True,
        message= "Tickets retrieved successfully",
        data= data,
        status_code= status.HTTP_200_OK
    )

def tickets_detail_success(data=None):
    return custom_response(
        success= True,
        message= "Ticket retrieved successfully",
        data= data,
        status_code= status.HTTP_200_OK
    )

def tickets_creation_success(data=None):
    return custom_response(
        success= True,
        message= "Ticket created successfully",
        data= data,
        status_code= status.HTTP_201_CREATED
    )

def tickets_update_success(data=None):
    return custom_response(
        success= True,
        message= "Ticket updated successfully",
        data= data,
        status_code= status.HTTP_200_OK
    )
def tickets_delete_success(data=None):
    return custom_response(
        success= True,
        message= "Ticket deleted successfully",
        data= data,
        status_code= status.HTTP_204_NO_CONTENT
    )