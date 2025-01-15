from rest_framework import serializers

from tickets.models import Ticket
from accounts.models import User
from accounts.serializers import UserSerializer

class TicketReadSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)
    user = UserSerializer(required=False)  

    class Meta:
        model = Ticket
        fields = ['id', 'title','user', 'description', 'priority', 'status', 'created_at', 'updated_at']

class TicketSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True)
    user = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Ticket
        fields = ['id', 'title','user', 'description', 'priority', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set the 'user' field to the currently logged-in user if not provided or if it's not admin
        request_user = self.context['request'].user
        if not request_user.is_superuser:  
            validated_data['user'] = request_user
        else:
            # If admin, ensure the 'user' is provided in the data
            if 'user' not in validated_data:
                raise serializers.ValidationError({'user': 'User is required for admin'})
            
            user = validated_data['user']
            try:
                user_instance = User.objects.get(id=user)  
            except User.DoesNotExist:
                raise serializers.ValidationError({'user': 'User ID not found'})
        
            validated_data['user'] = user_instance  

        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        request_user = self.context['request'].user
        if not request_user.is_staff: 
            validated_data['user'] = request_user
        else:
            if 'user' not in validated_data:
                raise serializers.ValidationError({'user': 'User is required for admin'})
            
            user = validated_data['user']
            try:
                user_instance = User.objects.get(id=user)  
            except User.DoesNotExist:
                raise serializers.ValidationError({'user': 'User ID not found'})
        
            validated_data['user'] = user_instance  
        
        return super().update(instance, validated_data)