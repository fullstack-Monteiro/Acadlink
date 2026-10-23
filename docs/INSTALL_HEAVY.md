# 🔧 Instalação de Dependências Pesadas - AcadLink

## 📦 O que São Dependências Pesadas?

Dependências pesadas são bibliotecas que adicionam funcionalidades avançadas mas aumentam o tamanho e tempo de instalação:

- **WebSockets** (Mensagens e notificações em tempo real)
- **Celery** (Processamento assíncrono de vídeos)
- **Redis** (Cache e message broker)
- **FFmpeg** (Processamento de vídeos)
- **OpenCV** (Visão computacional)
- **AWS S3** (Armazenamento em nuvem)
- **Sentry** (Monitoramento de erros)

---

## 🚀 Instalação Rápida

### Windows

```bash
cd backend

# Ativar ambiente virtual
venv\Scripts\activate

# Instalar dependências pesadas
pip install -r requirements/heavy.txt
```

### Linux/Mac

```bash
cd backend

# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências pesadas
pip install -r requirements/heavy.txt
```

---

## 📋 Dependências Pesadas Disponíveis

### 1. WebSockets (Tempo Real)

```bash
pip install channels==4.0.0 daphne==4.0.0
```

**Funcionalidades:**
- ✅ Mensagens em tempo real
- ✅ Notificações em tempo real
- ✅ Atualizações ao vivo

**Tamanho**: ~20MB  
**Tempo**: ~30 segundos

### 2. Celery + Redis (Async)

```bash
pip install celery==5.3.4 redis==5.0.1
```

**Funcionalidades:**
- ✅ Processamento de vídeos em background
- ✅ Envio de emails assíncrono
- ✅ Tarefas agendadas

**Tamanho**: ~30MB  
**Tempo**: ~1 minuto

### 3. Video Processing (FFmpeg)

```bash
pip install ffmpeg-python==0.2.1 moviepy==1.0.3 opencv-python==4.8.1.78
```

**Funcionalidades:**
- ✅ Processamento de vídeos
- ✅ Geração de thumbnails
- ✅ Conversão de formatos

**Tamanho**: ~200MB  
**Tempo**: ~3 minutos

**Pré-requisito**: FFmpeg instalado no sistema
```bash
# Windows (com Chocolatey)
choco install ffmpeg

# Linux
sudo apt install ffmpeg

# Mac
brew install ffmpeg
```

### 4. AWS S3 (Cloud Storage)

```bash
pip install boto3==1.34.0 django-storages==1.14.2
```

**Funcionalidades:**
- ✅ Upload de arquivos para AWS S3
- ✅ CDN para imagens e vídeos
- ✅ Backup automático

**Tamanho**: ~15MB  
**Tempo**: ~30 segundos

### 5. Monitoring (Sentry)

```bash
pip install sentry-sdk==1.39.1 newrelic==9.0.0
```

**Funcionalidades:**
- ✅ Rastreamento de erros
- ✅ Monitoramento de performance
- ✅ Alertas

**Tamanho**: ~10MB  
**Tempo**: ~30 segundos

### 6. Performance (Cache)

```bash
pip install django-cacheops==7.0.2 django-ratelimit==4.1.0
```

**Funcionalidades:**
- ✅ Cache avançado
- ✅ Rate limiting
- ✅ Otimização de queries

**Tamanho**: ~5MB  
**Tempo**: ~20 segundos

### 7. Testing

```bash
pip install pytest==7.4.3 pytest-django==4.7.0 factory-boy==3.3.0
```

**Funcionalidades:**
- ✅ Testes automatizados
- ✅ Fixtures de dados
- ✅ Cobertura de testes

**Tamanho**: ~20MB  
**Tempo**: ~1 minuto

---

## 🎯 Combinações Recomendadas

### Desenvolvimento Local Completo
```bash
pip install -r requirements/dev-minimal.txt
pip install channels==4.0.0 daphne==4.0.0
pip install celery==5.3.4 redis==5.0.1
pip install pytest==7.4.3 pytest-django==4.7.0
```

**Tamanho**: ~150MB  
**Tempo**: ~3 minutos

### Produção Completa
```bash
pip install -r requirements/dev-minimal.txt
pip install -r requirements/heavy.txt
```

**Tamanho**: ~500MB  
**Tempo**: ~10 minutos

### Apenas WebSockets
```bash
pip install -r requirements/dev-minimal.txt
pip install channels==4.0.0 daphne==4.0.0
```

**Tamanho**: ~70MB  
**Tempo**: ~1 minuto

### Apenas Video Processing
```bash
pip install -r requirements/dev-minimal.txt
pip install ffmpeg-python==0.2.1 moviepy==1.0.3 opencv-python==4.8.1.78
```

**Tamanho**: ~250MB  
**Tempo**: ~3 minutos

---

## 🔧 Configuração Após Instalação

### WebSockets

Editar `backend/config/settings/base.py`:

```python
INSTALLED_APPS = [
    ...
    'daphne',
    'channels',
]

ASGI_APPLICATION = 'config.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6379)],
        },
    },
}
```

### Celery

Editar `backend/config/celery.py`:

```python
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')

app = Celery('config')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
```

### Redis

Instalar Redis:

```bash
# Windows (com Chocolatey)
choco install redis

# Linux
sudo apt install redis-server

# Mac
brew install redis
```

Iniciar Redis:

```bash
# Windows
redis-server

# Linux/Mac
redis-server
```

---

## 📊 Comparação de Tamanho

| Componente | Tamanho | Tempo |
|-----------|---------|-------|
| Mínimo | 50MB | 1 min |
| + WebSockets | 70MB | 1.5 min |
| + Celery | 100MB | 2 min |
| + Video | 250MB | 3 min |
| + AWS | 65MB | 1.5 min |
| + Monitoring | 60MB | 1 min |
| + Testing | 70MB | 1.5 min |
| **Completo** | **500MB** | **10 min** |

---

## 🚀 Próximos Passos

1. Instalar dependências pesadas desejadas
2. Configurar cada componente
3. Testar funcionalidades
4. Fazer deployment

---

## 📞 Problemas?

### Erro ao instalar FFmpeg
```bash
# Verificar se FFmpeg está instalado
ffmpeg -version

# Se não estiver, instalar:
# Windows: choco install ffmpeg
# Linux: sudo apt install ffmpeg
# Mac: brew install ffmpeg
```

### Erro ao conectar Redis
```bash
# Verificar se Redis está rodando
redis-cli ping

# Se não estiver, iniciar:
# Windows: redis-server
# Linux/Mac: redis-server
```

### Erro ao instalar OpenCV
```bash
# Pode precisar de compilação
pip install --upgrade opencv-python

# Se falhar, tentar:
pip install opencv-python-headless
```

---

## 📚 Documentação

- **QUICK_INSTALL.md** - Instalação rápida
- **BACKEND_START.md** - Setup backend
- **DEPLOYMENT.md** - Deployment com dependências pesadas

---

**Pronto para instalar dependências pesadas! 🚀**
