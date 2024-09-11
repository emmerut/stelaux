import jwt, re
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

def prepare_data(self, data, user):
        processed_data = {'fields': [], 'section': data.get('formData[section]', ''), 'user': user.id}
        
        for key, value in data.items():
            if key.startswith('formData['):
                if '][' not in key:
                    # Campos del formulario principal
                    field_name = key[9:-1]
                    processed_data[field_name] = value
                elif '[file]' not in key:
                    # Campos de items anidados
                    _, index, field_name = key[8:].replace(']', '').split('[', 2)
                    index = int(index)
                    while len(processed_data['fields']) <= index:
                        processed_data['fields'].append({})
                    processed_data['fields'][index][field_name] = value
                elif '[file]' in key:
                    index = re.search(r'\[(\d+)\]', key)
                    if index:
                        match = re.search(r'\[(\d+)\]\[([^\]]+)\]$', key)
                        index = int(match.group(1)) if match.group(1) else None
                        field_name = match.group(2)
                        processed_data['fields'][index][f'file_{field_name}'] = value
                    else:
                        match = re.search(r'\[file]\[(.*)\]', key)
                        field_name = match.group(1)
                        processed_data[f'file_{field_name}'] = value
                        
        
        return processed_data

from datetime import datetime

def unix_to_datetime(unix_timestamp):
  """Converts a Unix timestamp to a datetime object."""
  return datetime.fromtimestamp(unix_timestamp)

# Example usage:
unix_timestamp = 1721692401
datetime_object = unix_to_datetime(unix_timestamp)

