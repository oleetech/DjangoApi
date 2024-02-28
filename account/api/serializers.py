from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'mobileNo', 'profile_pic')
        extra_kwargs = {
            'username': {'read_only': True},
            'mobileNo': {'required': False},  # Allow mobileNo to be optional
            'profile_pic': {'required': False},  # Allow profile_pic to be optional
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        # Update and save the instance with the validated data
        instance.email = validated_data.get('email', instance.email)
        instance.mobileNo = validated_data.get('mobileNo', instance.mobileNo)
        instance.profile_pic = validated_data.get('profile_pic', instance.profile_pic)
        
        # Update password if provided
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance

    
