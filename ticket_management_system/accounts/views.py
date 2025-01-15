from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.contrib.auth.models import Permission
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import NotFound



from accounts.serializers import LoginRequestSerializer, RefreshTokenSerializer, SignupRequestSerializer, UserSerializer
from accounts.utils.response_messages import (
    invalid_credentials,invalid_input,login_success,invalid_refresh_token,missing_refresh_token,
    token_refresh_success, user_already_exists, signup_success, internal_server_error_response,
    userlist_success,permission_update_success
    )
from accounts.utils.permissions import get_user_type
from accounts.models import User

class LoginView(APIView):
    def post(self, request):
        serializer = LoginRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(invalid_input(serializer.errors),status=status.HTTP_400_BAD_REQUEST)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        print(username,password)
        # Authenticate user
        user = authenticate(request,username=username,password=str(password))

        if user is None:
            return Response(invalid_credentials(),status=status.HTTP_401_UNAUTHORIZED)


        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        user_type_response = get_user_type(user)

        # Prepare response data
        response_data = {
            'access': access_token,
            'refresh': refresh_token,
            'user_type': user_type_response
        }
        return Response(login_success(response_data),status=status.HTTP_200_OK)
    

class RefreshTokenView(APIView):
    def post(self, request):
        serializer = RefreshTokenSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(invalid_input(serializer.errors),status=status.HTTP_400_BAD_REQUEST)

        refresh_token = serializer.validated_data['refresh']
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                access_token = str(token.access_token)
                refresh_token = str(token)
                response_data = {
                    'refresh': refresh_token,
                    'access': access_token
                }
                return Response(token_refresh_success(response_data),status=status.HTTP_200_OK)
            
            except Exception as e:
                return Response(invalid_refresh_token(str(e)),status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(missing_refresh_token(),status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):

    def post(self, request):
            try:
                serializer = SignupRequestSerializer(data=request.data)
                
                if not serializer.is_valid():
                    raise ValidationError(serializer.errors)
                
                username = serializer.validated_data['username']
                password = serializer.validated_data['password']
                email = serializer.validated_data['email']

                if User.objects.filter(username=username).exists():
                    return Response(user_already_exists(), status=status.HTTP_400_BAD_REQUEST)

                user = User.objects.create_user(username=username, password=password, email=email)
                
                return Response(signup_success({"username": user.username, "email": user.email}), status=status.HTTP_201_CREATED)
            
            except ValidationError as e:
                return Response(invalid_input(e.detail), status=status.HTTP_400_BAD_REQUEST)
            
            except Exception as e:
                return Response(
                    internal_server_error_response(e),
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

class ReadAllUsersView(APIView):
    permission_classes = [IsAuthenticated,IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
            return Response(userlist_success(serializer.data),status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                internal_server_error_response(e),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EditUserPermissionsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser] 
    authentication_classes = [JWTAuthentication]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            permissions_list = request.data  
            user.user_permissions.clear()

            app_label = "tickets"

            if permissions_list:
                permissions = Permission.objects.filter(
                    content_type__app_label=app_label,
                    codename__in=permissions_list
                )
                user.user_permissions.add(*permissions)
                

            return Response(
                permission_update_success( {
                        "username": user.username,
                        "permissions": [perm.codename for perm in user.user_permissions.all()]
                    }
                ),
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            raise NotFound(detail="User not found.")
        except Permission.DoesNotExist as e:
            return Response(
                {
                    "status": "error",
                    "message": f"Permission error: {str(e)}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                internal_server_error_response(e),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )