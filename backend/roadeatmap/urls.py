from django.urls import path
from . import views
from .views import UserProfileAPI

urlpatterns = [
    path('places/', views.RestaurantListAPI.as_view()),
    path('places/add/', views.RestaurantCreateAPI.as_view()), 
    path('routes/', views.UserRouteListCreateAPI.as_view()),
    path('register/', views.UserRegisterAPI.as_view()),
    path('profile/', UserProfileAPI.as_view()),
    

]
