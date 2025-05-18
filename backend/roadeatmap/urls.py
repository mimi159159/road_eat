from django.urls import path
from . import views

urlpatterns = [
    path('places/', views.RestaurantListAPI.as_view()),
    path('places/add/', views.RestaurantCreateAPI.as_view()), 
    path('routes/', views.UserRouteListCreateAPI.as_view()),
    path('register/', views.UserRegisterAPI.as_view()),

]
