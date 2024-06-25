from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework import status
from rest_framework.decorators import action
from .serializers import RegisterSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import CustomUser as User
from django.db.models import Q

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    @action(methods=['post'], detail=False)
    def login(self, request):
        username_or_email = request.data.get('user')
        password = request.data.get('password')

        try:
            user = User.objects.get(Q(username=username_or_email) | Q(email=username_or_email) | Q(phone=username_or_email))
        except User.DoesNotExist:
            return Response({'detail': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Autenticar con las credenciales
        user = authenticate(request, username=username_or_email, password=password)

        if user is not None:
            # Generar token de autenticación
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(methods=['post'], detail=False)
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user.email:
                return Response({'call': 'email', 'user': {'username': user.username, 'email': user.email, 'phone': user.phone}}, status=status.HTTP_201_CREATED)
            elif user.phone:
                return Response({'call': 'phone', 'user': {'username': user.username, 'email': user.email, 'phone': user.phone}}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
