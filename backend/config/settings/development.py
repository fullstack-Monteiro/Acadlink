from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS += [
    # 'debug_toolbar',  # comentado para dev rápido
    # 'django_extensions',  # comentado para dev rápido
    'drf_spectacular',
]

MIDDLEWARE += [
    # 'debug_toolbar.middleware.DebugToolbarMiddleware',  # comentado para dev rápido
]

INTERNAL_IPS = ['127.0.0.1']

# Email backend para desenvolvimento
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Desabilitar HTTPS em desenvolvimento
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Desabilitar throttling em desenvolvimento
REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = []

# Swagger / OpenAPI
REST_FRAMEWORK['DEFAULT_SCHEMA_CLASS'] = 'drf_spectacular.openapi.AutoSchema'

SPECTACULAR_SETTINGS = {
    'TITLE': 'AcadLink API',
    'DESCRIPTION': 'API da plataforma académica AcadLink — Moçambique',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'SWAGGER_UI_SETTINGS': {
        'persistAuthorization': True,
        'displayRequestDuration': True,
    },
    'COMPONENT_SPLIT_REQUEST': True,
    'SECURITY': [{'jwtAuth': []}],
    'APPEND_COMPONENTS': {
        'securitySchemes': {
            'jwtAuth': {
                'type': 'http',
                'scheme': 'bearer',
                'bearerFormat': 'JWT',
            }
        }
    },
}
