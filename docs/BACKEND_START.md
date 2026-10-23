# 🚀 Como Iniciar o Backend Django

## Pré-requisitos
- Python 3.9+
- pip (gerenciador de pacotes Python)

## Passo 1: Abrir Terminal na Pasta Backend

```bash
cd backend
```

## Passo 2: Criar Ambiente Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

## Passo 3: Instalar Dependências

```bash
pip install -r requirements/base.txt
```

## Passo 4: Configurar Banco de Dados

```bash
# Criar arquivo .env (se não existir)
cp .env.example .env
```

Em `backend/.env`, configure o banco de dados:

- Para usar SQLite (padrão): mantenha os valores atuais.
- Para usar PostgreSQL, altere os valores para:

```env
DB_ENGINE=django.db.backends.postgresql
DB_NAME=acadlink_db
DB_USER=acadlink_user
DB_PASSWORD=sua_senha_segura
DB_HOST=localhost
DB_PORT=5432
```

> Certifique-se de que o PostgreSQL esteja instalado e rodando antes de executar as migrações.

## Passo 5: Executar Migrações

```bash
python manage.py migrate
```

## Passo 6: Criar Superusuário (Admin)

```bash
python manage.py createsuperuser
# Seguir as instruções na tela
```

## Passo 7: Iniciar Servidor Django

```bash
python manage.py runserver
```

**Esperado:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

---

## ✅ Verificar se Backend está Rodando

Abrir no navegador: `http://localhost:8000/api/`

Deve aparecer uma página com a API REST.

---

## 🔗 Conectar Frontend ao Backend

O frontend já está configurado para conectar em `http://localhost:8000/api`

Agora você pode:
1. ✅ Abrir `http://localhost:3000` (frontend)
2. ✅ Clicar em "Criar Conta" ou "Entrar"
3. ✅ O sistema vai conectar ao backend

---

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'django'"
```bash
pip install -r requirements/base.txt
```

### Erro: "Port 8000 is already in use"
```bash
python manage.py runserver 8001
```

### Erro: "No such table: users_user"
```bash
python manage.py migrate
```

### Erro: "CORS error"
Verificar `backend/config/settings/base.py` - CORS_ALLOWED_ORIGINS deve incluir `http://localhost:3000`

---

## 📊 Estrutura de Pastas

```
backend/
├── config/              # Configurações Django
├── apps/               # 7 aplicações
│   ├── users/         # Autenticação
│   ├── posts/         # Posts
│   ├── reels/         # Reels
│   ├── messages/      # Mensagens
│   ├── notifications/ # Notificações
│   ├── connections/   # Conexões
│   └── moderation/    # Moderação
├── manage.py          # Django CLI
└── requirements/      # Dependências
```

---

## 🎯 Próximos Passos

1. ✅ Iniciar backend: `python manage.py runserver`
2. ✅ Abrir `http://localhost:3000`
3. ✅ Criar conta ou fazer login
4. ✅ Testar funcionalidades

**Pronto! Sistema funcionando! 🎉**
