import os
from pathlib import Path
from datetime import timedelta
from decouple import config, Csv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY', default='django-insecure-dev-key')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# ══════════════════════════════════════════════════════════════════════════════
# INSTALLED APPS
# ══════════════════════════════════════════════════════════════════════════════

INSTALLED_APPS = [
    # 'daphne',  # ASGI server for WebSockets - comentado para dev rápido
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # 'storages',  # comentado para dev rápido
    'axes',  # ✅ ATIVADO: Brute force protection
    # 'debug_toolbar',  # comentado para dev rápido
    
    # Local apps - apenas as essenciais
    'apps.users',
    'apps.posts',
    'apps.reels',
    'apps.messages',
    'apps.notifications',
    'apps.connections',
    # 'apps.moderation',  # Comentado para dev rápido
]

# ══════════════════════════════════════════════════════════════════════════════
# MIDDLEWARE
# ══════════════════════════════════════════════════════════════════════════════

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # 'whitenoise.middleware.WhiteNoiseMiddleware',  # comentado para dev rápido
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'axes.middleware.AxesMiddleware',  # ✅ ATIVADO: Rate limiting
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'csp.middleware.CSPMiddleware',  # ✅ Content Security Policy
]

# ══════════════════════════════════════════════════════════════════════════════
# TEMPLATES
# ══════════════════════════════════════════════════════════════════════════════

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
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

# ══════════════════════════════════════════════════════════════════════════════
# DATABASE
# ══════════════════════════════════════════════════════════════════════════════

DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.sqlite3'),
        'NAME': config('DB_NAME', default=os.path.join(BASE_DIR, 'db.sqlite3')),
        'USER': config('DB_USER', default=''),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default=''),
        'PORT': config('DB_PORT', default=''),
    }
}

# ══════════════════════════════════════════════════════════════════════════════
# AUTHENTICATION
# ══════════════════════════════════════════════════════════════════════════════

AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ══════════════════════════════════════════════════════════════════════════════
# REST FRAMEWORK
# ══════════════════════════════════════════════════════════════════════════════

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
    },
}

# ══════════════════════════════════════════════════════════════════════════════
# JWT
# ══════════════════════════════════════════════════════════════════════════════

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': config('JWT_SECRET_KEY', default=SECRET_KEY),
}

# ══════════════════════════════════════════════════════════════════════════════
# COOKIES CONFIGURATION (HttpOnly + Secure)
# ══════════════════════════════════════════════════════════════════════════════

SESSION_COOKIE_SECURE = not DEBUG  # HTTPS only
SESSION_COOKIE_HTTPONLY = True  # JavaScript não acessa
SESSION_COOKIE_SAMESITE = 'Lax'  # Proteção contra CSRF
CSRF_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'

# JWT em cookies HttpOnly (mais seguro que localStorage)
JWT_AUTH_COOKIE = 'access_token'
JWT_AUTH_REFRESH_COOKIE = 'refresh_token'

# ══════════════════════════════════════════════════════════════════════════════
# CORS (Cross-Origin Resource Sharing)
# ══════════════════════════════════════════════════════════════════════════════

# ✅ Whitelist de domínios permitidos (NUNCA use '*' em produção!)
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000,http://localhost:5173', cast=Csv())

# Permitir credenciais (cookies, headers de auth)
CORS_ALLOW_CREDENTIALS = True

# Métodos HTTP permitidos
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Headers permitidos
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# CSRF - Domínios que podem fazer POST, PUT, DELETE
CSRF_TRUSTED_ORIGINS = config('CSRF_TRUSTED_ORIGINS', default='http://localhost:3000,http://localhost:5173', cast=Csv())

# ══════════════════════════════════════════════════════════════════════════════
# STORAGE
# ══════════════════════════════════════════════════════════════════════════════

if config('USE_S3', default=False, cast=bool):
    STORAGES = {
        'default': {
            'BACKEND': 'storages.backends.s3boto3.S3Boto3Storage',
            'OPTIONS': {
                'AWS_ACCESS_KEY_ID': config('AWS_ACCESS_KEY_ID'),
                'AWS_SECRET_ACCESS_KEY': config('AWS_SECRET_ACCESS_KEY'),
                'AWS_STORAGE_BUCKET_NAME': config('AWS_STORAGE_BUCKET_NAME'),
                'AWS_S3_REGION_NAME': config('AWS_S3_REGION_NAME', default='us-east-1'),
                'AWS_S3_CUSTOM_DOMAIN': f"{config('AWS_STORAGE_BUCKET_NAME')}.s3.amazonaws.com",
                'AWS_S3_OBJECT_PARAMETERS': {'CacheControl': 'max-age=86400'},
            }
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
        }
    }
    STATIC_URL = f"https://{config('AWS_STORAGE_BUCKET_NAME')}.s3.amazonaws.com/static/"
else:
    STORAGES = {
        'default': {
            'BACKEND': 'django.core.files.storage.FileSystemStorage',
        },
        'staticfiles': {
            'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
        }
    }
    STATIC_URL = '/static/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ══════════════════════════════════════════════════════════════════════════════
# CELERY
# ══════════════════════════════════════════════════════════════════════════════

# Celery configuration (requires Redis and celery)
# Uncomment below to enable Celery
# CELERY_BROKER_URL = config('REDIS_URL', default='redis://localhost:6379/0')
# CELERY_RESULT_BACKEND = config('REDIS_URL', default='redis://localhost:6379/0')
# CELERY_ACCEPT_CONTENT = ['json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'
# CELERY_TIMEZONE = 'UTC'

# ══════════════════════════════════════════════════════════════════════════════
# CACHING
# ══════════════════════════════════════════════════════════════════════════════

# Use simple in-memory cache for minimal setup
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'acadlink-cache',
    }
}

# Uncomment below for Redis caching (requires redis and django_redis)
# CACHES = {
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': config('REDIS_URL', default='redis://localhost:6379/1'),
#         'OPTIONS': {
#             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
#         }
#     }
# }

# ══════════════════════════════════════════════════════════════════════════════
# SECURITY
# ══════════════════════════════════════════════════════════════════════════════
# SECURITY HEADERS
# ══════════════════════════════════════════════════════════════════════════════

# SSL/TLS Redirect
SECURE_SSL_REDIRECT = not DEBUG

# HSTS (HTTP Strict Transport Security) - Force HTTPS
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0  # 1 ano
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG  # Incluir no HSTS preload list

# ✅ Proteção contra Clickjacking
SECURE_FRAME_DENY = True  # X-Frame-Options: DENY
X_FRAME_OPTIONS = 'DENY'

# ✅ Proteção contra MIME Sniffing
SECURE_CONTENT_TYPE_NOSNIFF = True  # X-Content-Type-Options: nosniff

# ✅ Proteção contra XSS
SECURE_BROWSER_XSS_FILTER = True  # X-XSS-Protection: 1; mode=block

# ✅ Content Security Policy (CSP)
SECURE_CONTENT_SECURITY_POLICY = {
    "default-src": ("'self'",),
    "script-src": ("'self'", "'unsafe-inline'"),  # unsafe-inline para dev (remover em produção)
    "style-src": ("'self'", "'unsafe-inline'"),
    "img-src": ("'self'", "data:", "https:"),
    "font-src": ("'self'", "https:", "data:"),
    "connect-src": ("'self'", "https:"),  # APIs
    "frame-ancestors": ("'none'",),  # Clickjacking
    "upgrade-insecure-requests": (),  # Upgrade HTTP para HTTPS
}

# ✅ Referrer Policy
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# ✅ Permissions Policy (ex-Feature Policy)
PERMISSIONS_POLICY = {
    'geolocation': '()',
    'microphone': '()',
    'camera': '()',
    'payment': '()',
    'usb': '()',
    'accelerometer': '()',
    'gyroscope': '()',
}

# ══════════════════════════════════════════════════════════════════════════════
# AXES (Brute-force protection) - Rate Limiting
# ══════════════════════════════════════════════════════════════════════════════

# Máximo de tentativas de login falhadas
AXES_FAILURE_LIMIT = 5

# Tempo de bloqueio após atingir limite (15 minutos)
AXES_COOLOFF_DURATION = timedelta(minutes=15)

# Bloquear imediatamente ao atingir limite
AXES_LOCK_OUT_AT_FAILURE = True

# Usar IP + Username como chave de rastreamento (mais seguro)
AXES_LOCKOUT_TEMPLATE = 'axes/lockout.html'  # Template customizado
AXES_USE_USER_AGENT = True  # Adicionar User-Agent à chave
AXES_LOCK_OUT_BY_COMBINATION_USER_AND_IP = True  # IP + Username

# Endpoints específicos para monitorar
AXES_VERBOSE = True  # Log detalhado

# Considerar reset de tentativas após sucesso
AXES_RESET_ON_SUCCESS = True

# ══════════════════════════════════════════════════════════════════════════════
# INTERNATIONALIZATION
# ══════════════════════════════════════════════════════════════════════════════

LANGUAGE_CODE = 'pt-pt'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ══════════════════════════════════════════════════════════════════════════════
# LOGGING
# ══════════════════════════════════════════════════════════════════════════════

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# ══════════════════════════════════════════════════════════════════════════════
# SENTRY
# ══════════════════════════════════════════════════════════════════════════════

if config('SENTRY_DSN', default=''):
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    
    sentry_sdk.init(
        dsn=config('SENTRY_DSN'),
        integrations=[DjangoIntegration()],
        traces_sample_rate=0.1,
        send_default_pii=False,
    )

# ══════════════════════════════════════════════════════════════════════════════
# EMAIL CONFIGURATION
# ══════════════════════════════════════════════════════════════════════════════

EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@acadlink.com')

# ══════════════════════════════════════════════════════════════════════════════
# FRONTEND CONFIGURATION
# ══════════════════════════════════════════════════════════════════════════════

FRONTEND_URL = config('FRONTEND_URL', default='http://localhost:3000')
