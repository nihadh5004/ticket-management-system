from rest_framework import serializers
from accounts.models import User

class UserSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'is_active', 'is_staff','is_superuser', 'permissions']

    def get_permissions(self, obj):
        # Get all user permissions
        permissions = obj.user_permissions.all()
        return [perm.codename for perm in permissions]
    

class LoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True, help_text="The refresh token")

class SignupRequestSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, min_length=4, required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=4)
    confirm_password = serializers.CharField(write_only=True, required=True, min_length=4)
    email = serializers.EmailField(required=True)

    # Custom validation for password and confirm password
    def validate(self, attrs):
        password = attrs.get('password')
        confirm_password = attrs.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        
        return attrs