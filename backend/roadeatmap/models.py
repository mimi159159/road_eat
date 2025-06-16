from django.db import models
from django.contrib.auth.models import User


class UserRoute(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.origin} to {self.destination}"
    
class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    lat = models.FloatField()
    lng = models.FloatField()

    def __str__(self):
        return self.name
    

def user_profile_pic_path(instance, filename):
    return f"user_{instance.id}/profile/{filename}"


User.add_to_class('profile_picture', models.ImageField(upload_to=user_profile_pic_path, blank=True, null=True))    