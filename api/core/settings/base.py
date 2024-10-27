from pathlib import Path
import os, environ
env = environ.Env()
environ.Env.read_env()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

AUTHENTICATION_BACKENDS = (
    'users.authentication.CustomBackend',
    'django.contrib.auth.backends.ModelBackend',
)

ALLOWED_HOSTS = ['*']
AUTH_USER_MODEL = 'users.CustomUser'

#security
SECRET_KEY = os.environ.get('SECRET_KEY')
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET_KEY')
PAYPAL_CLIENT = os.environ.get('PAYPAL_CLIENT')
PAYPAL_SECRET = os.environ.get('PAYPAL_SECRET')
META_ID = os.environ.get('META_ID')
META_SECRET = os.environ.get('META_SECRET')
META_TOKEN = os.environ.get('META_TOKEN')
ENOM_USER = os.environ.get('ENOM_USER')
ENOM_KEY = os.environ.get('ENOM_KEY')
VES_MONITOR = os.environ.get('VES_MONITOR')
API_KEY = os.environ.get('API_KEY')
DEFAULT_EMAIL = os.environ.get('DEFAULT_EMAIL')
NEWSLETTER_EMAIL = os.environ.get('NEWSLETTER_EMAIL')
SUPPORT_EMAIL = os.environ.get('SUPPORT_EMAIL')
STELA_EMAIL = os.environ.get('STELA_EMAIL')
MAIN_EMAIL = os.environ.get('MAIN_EMAIL')
TWILIO_SID = os.environ.get('TWILIO_SID')
TWILIO_AUTH = os.environ.get('TWILIO_AUTH')
TWILIO_SERVICE_TOKEN = os.environ.get('TWILIO_SERVICE_TOKEN')
SENDGRID_KEY = os.environ.get('SENDGRID_KEY')
DOMAIN_CLOUDFLARE_TOKEN = os.environ.get('DOMAIN_CLOUDFLARE_TOKEN')


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'drf_yasg',
    'rest_framework',
    'coreapi',
    'content',
    'finance',
    'geolocation',
    'users',
    'finyx',
    'corsheaders',
    'inventory',
    'kairos',
    'marketing',
    'stelai',
    'cities_light',
    'payments',
    'portals',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

#cors auth
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

postgres_local = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'data_local',
        'USER': 'stelaux',
        'PASSWORD': os.environ.get('LOCAL_PASSWORD'),
        'HOST': os.environ.get('LOCAL_HOST'),
        'PORT': '5432',
    },

}

postgres_test = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'stela_data_test',
        'USER': 'stelaux',
        'PASSWORD': os.environ.get('CLOUD_PASSWORD'),
        'HOST': os.environ.get('CLOUD_HOST'),
        'PORT': '5432',
    },

}

postgres_line = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'stelaux_line',
        'USER': 'stelaux',
        'PASSWORD': os.environ.get('CLOUD_PASSWORD'),
        'HOST': os.environ.get('CLOUD_HOST'),
        'PORT': '5432',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
REST_FRAMEWORK = {
    ...: ...,
    "DEFAULT_SCHEMA_CLASS": "rest_framework.schemas.coreapi.AutoSchema",
}

#environ
AWS_ACCESS_KEY_ID=env('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY=env('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')

# aws settings
AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')
AWS_DEFAULT_ACL = 'public-read'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}
AWS_QUERYSTRING_AUTH = False

STATIC_LOCATION = 'static'
STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
STATICFILES_STORAGE = 'core.storages.StaticStorage'
# s3 public media settings
PUBLIC_MEDIA_LOCATION = 'media'
MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/'
DEFAULT_FILE_STORAGE = 'core.storages.PublicMediaStorage'

CITIES_LIGHT_APP_NAME = 'geolocation'