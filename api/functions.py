import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from django.db.models import Q
from users.models import CustomUser as User

def get_user_from_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        # Obtén el campo email o phone del payload
        recipient = payload.get('email') or payload.get('phone') or payload.get('user_id')

        if not recipient:
            raise AuthenticationFailed('Token inválido')

        user = User.objects.get(Q(email=recipient) | Q(phone=recipient) | Q(id=recipient))
        if not user.is_active:
            raise AuthenticationFailed('Usuario inactivo')
        return user

    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Token ha expirado')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed('Token inválido')
