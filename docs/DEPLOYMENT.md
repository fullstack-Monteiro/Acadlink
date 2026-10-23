# 🚀 Guia de Deployment - AcadLink

## Pré-requisitos

- Conta em plataforma de hosting (Heroku, AWS, DigitalOcean, etc)
- Domínio configurado
- Certificado SSL/HTTPS
- Banco de dados PostgreSQL
- Redis para cache

---

## 📦 Deployment Backend (Django)

### Opção 1: Heroku

#### 1. Instalar Heroku CLI
```bash
# Windows
choco install heroku-cli

# Linux/Mac
brew tap heroku/brew && brew install heroku
```

#### 2. Login no Heroku
```bash
heroku login
```

#### 3. Criar App
```bash
cd backend
heroku create acadlink-backend
```

#### 4. Configurar Variáveis de Ambiente
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key-here
heroku config:set ALLOWED_HOSTS=acadlink-backend.herokuapp.com
heroku config:set DATABASE_URL=postgresql://...
heroku config:set REDIS_URL=redis://...
```

#### 5. Adicionar Procfile
```bash
# Criar arquivo: backend/Procfile
web: gunicorn config.wsgi:application
worker: celery -A config worker -l info
beat: celery -A config beat -l info
```

#### 6. Deploy
```bash
git push heroku main
```

#### 7. Executar Migrações
```bash
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Opção 2: AWS EC2

#### 1. Criar Instância EC2
- Ubuntu 20.04 LTS
- t2.micro (free tier)
- Security group: abrir portas 80, 443, 8000

#### 2. Conectar via SSH
```bash
ssh -i key.pem ubuntu@your-instance-ip
```

#### 3. Instalar Dependências
```bash
sudo apt update
sudo apt install python3-pip python3-venv postgresql postgresql-contrib nginx
```

#### 4. Clonar Repositório
```bash
git clone https://github.com/seu-usuario/acadlink.git
cd acadlink/backend
```

#### 5. Setup Django
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements/prod.txt
```

#### 6. Configurar Banco de Dados
```bash
sudo -u postgres psql
CREATE DATABASE acadlink;
CREATE USER acadlink WITH PASSWORD 'senha-segura';
ALTER ROLE acadlink SET client_encoding TO 'utf8';
ALTER ROLE acadlink SET default_transaction_isolation TO 'read committed';
ALTER ROLE acadlink SET default_transaction_deferrable TO on;
ALTER ROLE acadlink SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE acadlink TO acadlink;
\q
```

#### 7. Executar Migrações
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

#### 8. Configurar Gunicorn
```bash
# Criar arquivo: /etc/systemd/system/gunicorn.service
[Unit]
Description=gunicorn daemon for acadlink
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/acadlink/backend
ExecStart=/home/ubuntu/acadlink/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          config.wsgi:application

[Install]
WantedBy=multi-user.target
```

#### 9. Iniciar Gunicorn
```bash
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
```

#### 10. Configurar Nginx
```bash
# Criar arquivo: /etc/nginx/sites-available/acadlink
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://unix:/run/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /home/ubuntu/acadlink/backend/staticfiles/;
    }

    location /media/ {
        alias /home/ubuntu/acadlink/backend/media/;
    }
}
```

#### 11. Ativar Nginx
```bash
sudo ln -s /etc/nginx/sites-available/acadlink /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

#### 12. Configurar SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## 📦 Deployment Frontend (React)

### Opção 1: Vercel (Recomendado)

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login
```bash
vercel login
```

#### 3. Deploy
```bash
cd acadlink
vercel
```

#### 4. Configurar Variáveis de Ambiente
```bash
vercel env add VITE_API_URL
vercel env add VITE_WEBSOCKET_URL
```

### Opção 2: Netlify

#### 1. Instalar Netlify CLI
```bash
npm install -g netlify-cli
```

#### 2. Login
```bash
netlify login
```

#### 3. Deploy
```bash
cd acadlink
npm run build
netlify deploy --prod --dir=dist
```

### Opção 3: AWS S3 + CloudFront

#### 1. Criar S3 Bucket
```bash
aws s3 mb s3://acadlink-frontend
```

#### 2. Build
```bash
cd acadlink
npm run build
```

#### 3. Upload para S3
```bash
aws s3 sync dist/ s3://acadlink-frontend --delete
```

#### 4. Configurar CloudFront
- Criar distribuição
- Apontar para S3 bucket
- Configurar SSL

---

## 🔐 Segurança em Produção

### Backend

#### 1. Variáveis de Ambiente
```bash
DEBUG=False
SECRET_KEY=generate-strong-key
ALLOWED_HOSTS=seu-dominio.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

#### 2. Banco de Dados
```bash
# Usar PostgreSQL em produção
# Fazer backups regulares
# Usar SSL para conexão
```

#### 3. Redis
```bash
# Usar Redis gerenciado
# Configurar autenticação
# Usar SSL
```

#### 4. Firewall
```bash
# Abrir apenas portas necessárias
# 80 (HTTP)
# 443 (HTTPS)
# 22 (SSH - apenas para você)
```

### Frontend

#### 1. HTTPS
```bash
# Sempre usar HTTPS
# Configurar redirecionamento HTTP -> HTTPS
```

#### 2. Headers de Segurança
```bash
# Content-Security-Policy
# X-Frame-Options
# X-Content-Type-Options
# Strict-Transport-Security
```

#### 3. Variáveis de Ambiente
```bash
# Não incluir secrets no código
# Usar .env files
# Não fazer commit de .env
```

---

## 📊 Monitoramento

### Logs

#### Backend
```bash
# Heroku
heroku logs --tail

# AWS
tail -f /var/log/syslog
```

#### Frontend
```bash
# Vercel
vercel logs

# Netlify
netlify logs
```

### Alertas

#### Sentry (Error Tracking)
```bash
# Instalar
pip install sentry-sdk

# Configurar em settings.py
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

#### New Relic (Performance)
```bash
# Instalar
pip install newrelic

# Configurar
NEW_RELIC_CONFIG_FILE=newrelic.ini newrelic-admin run-program gunicorn ...
```

---

## 🔄 CI/CD

### GitHub Actions

#### 1. Criar workflow
```bash
# Arquivo: .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Backend
        run: |
          cd backend
          # Deploy commands
      
      - name: Deploy Frontend
        run: |
          cd acadlink
          # Deploy commands
```

---

## 📋 Checklist de Deployment

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado
- [ ] Redis configurado
- [ ] SSL/HTTPS ativado
- [ ] Migrações executadas
- [ ] Superusuário criado
- [ ] Arquivos estáticos coletados
- [ ] Logs configurados
- [ ] Alertas configurados
- [ ] Backups configurados
- [ ] Domínio apontando
- [ ] Testes em produção
- [ ] Monitoramento ativo

---

## 🚨 Troubleshooting

### Backend não inicia
```bash
# Verificar logs
heroku logs --tail

# Verificar variáveis
heroku config

# Verificar banco de dados
heroku pg:info
```

### Frontend não carrega
```bash
# Verificar build
npm run build

# Verificar variáveis de ambiente
vercel env list

# Verificar logs
vercel logs
```

### WebSocket não conecta
```bash
# Verificar Daphne
# Verificar VITE_WEBSOCKET_URL
# Verificar CORS
```

---

## 📞 Suporte

- Documentação: `README.md`
- Backend: `BACKEND_START.md`
- Testes: `TESTING_GUIDE.md`

---

**Pronto para deploy! 🚀**
