from django.contrib.auth.backends import ModelBackend
from users.models import CustomUser as User
from django.db.models import Q

class CustomBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(Q(email=username) | Q(phone=username))
        except User.DoesNotExist:
            return None
        
        if user and user.check_password(password):
            return user
        return None