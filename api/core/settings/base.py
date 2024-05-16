from pathlib import Path
import os, environ
env = environ.Env()
environ.Env.read_env()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DEBUG = True

ALLOWED_HOSTS = []

#security
SECRET_KEY = env.str('SECRET_KEY')
STRIPE_SECRET_KEY = env.str('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = env.str('WEBHOOK_SECRET_KEY')
PAYPAL_CLIENT = env.str('PAYPAL_CLIENT')
PAYPAL_SECRET = env.str('PAYPAL_SECRET')
META_ID = env.str('META_ID')
META_SECRET = env.str('META_SECRET')
META_TOKEN = env.str('META_TOKEN')
ENOM_USER = env('ENOM_USER')
ENOM_KEY = env('ENOM_KEY')
VES_MONITOR = env('VES_MONITOR')
API_KEY = env('API_KEY')
DEFAULT_EMAIL = env('DEFAULT_EMAIL')
NEWSLETTER_EMAIL = env('NEWSLETTER_EMAIL')
SUPPORT_EMAIL = env('SUPPORT_EMAIL')
STELA_EMAIL = env('STELA_EMAIL')
MAIN_EMAIL = env('MAIN_EMAIL')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'content',
    'finance',
    'users',
    'finyx',
    'corsheaders',
    'inventory',
    'kairos',
    'marketing',
    'stelai'
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
CORS_ALLOWED_ORIGINS = [
    
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

postgres_test = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'data_test',
        'USER': 'stelaux',
        'PASSWORD': env('CLOUD_PASSWORD'),
        'HOST': env('CLOUD_HOST'),
        'PORT': '5432',
    },

}

postgres_line = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'db_line',
        'USER': 'stelaux',
        'PASSWORD': env('CLOUD_PASSWORD'),
        'HOST': env('CLOUD_HOST'),
        'PORT': '5432',
    },
}

DATABASES = postgres_test

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


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


