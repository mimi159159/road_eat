from rest_framework import serializers
from .models import Restaurant
from .models import UserRoute
from django.contrib.auth.models import User

class UserRouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRoute
        fields = '__all__'
        read_only_fields = ('user',)
class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user