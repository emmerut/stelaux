import jwt
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from django.db.models import Q
from users.models import CustomUser as User
from rest_framework.response import Response
from rest_framework import status

def get_user_from_token(token):
    parts = token.split()
    if len(parts) == 2 and parts[0].lower() == 'bearer':
        token = parts[1]

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        # Obtén el campo email o phone del payload
        recipient = payload.get('email') or payload.get('phone') or payload.get('user_id')

        if not recipient:
            raise AuthenticationFailed('Token inválido')

        user = User.objects.get(Q(email=recipient) | Q(phone=recipient) | Q(id=recipient))
        if not user.is_active:
            return Response({'error': 'Usuario inactivo'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return user

    except jwt.ExpiredSignatureError:
        return Response({'error': 'Token ha expirado'}, status=status.HTTP_401_UNAUTHORIZED)
    except jwt.InvalidTokenError:
        return Response({'error': 'Token inválido'}, status=status.HTTP_401_UNAUTHORIZED)
    except AuthenticationFailed as e:
        return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

from datetime import datetime

def unix_to_datetime(unix_timestamp):
  """Converts a Unix timestamp to a datetime object."""
  return datetime.fromtimestamp(unix_timestamp)

# Example usage:
unix_timestamp = 1721692401
datetime_object = unix_to_datetime(unix_timestamp)

