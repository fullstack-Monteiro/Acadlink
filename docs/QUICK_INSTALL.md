# ⚡ Instalação Rápida - AcadLink

## 🚀 Opção 1: Scripts Rápidos (Recomendado - 2 minutos)

### Windows

**Terminal 1 - Backend:**
```bash
cd backend
run-quick.bat
```

**Terminal 2 - Frontend:**
```bash
cd acadlink
npm install
npm run dev
```

### Linux/Mac

**Terminal 1 - Backend:**
```bash
cd backend
chmod +x run-quick.sh
./run-quick.sh
```

**Terminal 2 - Frontend:**
```bash
cd acadlink
npm install
npm run dev
```

---

## 📦 O que é Instalado (Versão Rápida)

### Backend (Mínimo)
```
Django 4.2.11
Django REST Framework 3.14.0
Django CORS Headers 4.3.1
PostgreSQL Driver
JWT Authentication
Python Decouple
Pillow (Imagens)
```

**Tamanho**: ~50MB  
**Tempo**: ~1 minuto

### Frontend
```
React 18.3.1
Vite 5.4.2
Tailwind CSS 3.4.11
Axios 1.6.2
React Router 6.26.0
```

**Tamanho**: ~300MB  
**Tempo**: ~2 minutos

---

## ✅ Verificar Instalação

### Backend
```bash
# Abrir navegador
http://localhost:8000/api/

# Deve aparecer a API REST
```

### Frontend
```bash
# Abrir navegador
http://localhost:3000

# Deve aparecer a tela de splash
```

---

## 🔧 Instalação Manual (Se Scripts Não Funcionarem)

### Backend

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Instalar dependências mínimas
pip install -r requirements/dev-minimal.txt

# Executar migrações
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

### Frontend

```bash
cd acadlink

# Instalar dependências
npm install

# Iniciar servidor
npm run dev
```

---

## 📊 Comparação: Completo vs Rápido

| Componente | Completo | Rápido |
|-----------|----------|--------|
| Django | ✅ | ✅ |
| REST API | ✅ | ✅ |
| Autenticação | ✅ | ✅ |
| Posts | ✅ | ✅ |
| Reels | ✅ | ✅ |
| Mensagens | ✅ | ❌ (sem WebSocket) |
| Notificações | ✅ | ❌ (sem WebSocket) |
| Celery | ✅ | ❌ |
| Redis | ✅ | ❌ |
| Channels | ✅ | ❌ |
| **Tamanho** | ~500MB | ~50MB |
| **Tempo** | ~10 min | ~1 min |

---

## 🎯 Quando Usar Cada Uma

### Use Rápida Se:
- ✅ Quer testar rápido
- ✅ Não precisa de WebSockets
- ✅ Não precisa de processamento assíncrono
- ✅ Quer desenvolvimento rápido
- ✅ Tem internet lenta

### Use Completa Se:
- ✅ Quer todas as funcionalidades
- ✅ Precisa de mensagens em tempo real
- ✅ Precisa de notificações em tempo real
- ✅ Precisa de processamento de vídeos
- ✅ Quer fazer deployment

---

## 🚀 Próximos Passos

1. ✅ Executar scripts rápidos
2. ✅ Abrir `http://localhost:3000`
3. ✅ Criar conta
4. ✅ Testar funcionalidades básicas

---

## 📞 Problemas?

### Backend não inicia
```bash
# Verificar Python
python --version

# Reinstalar dependências
pip install -r requirements/dev-minimal.txt
```

### Frontend não inicia
```bash
# Verificar Node
node --version

# Limpar cache
rm -rf node_modules package-lock.json
npm install
```

### Porta em uso
```bash
# Backend em outra porta
python manage.py runserver 8001

# Frontend em outra porta
npm run dev -- --port 5173
```

---

## 📚 Documentação

- **START.md** - Comece aqui
- **QUICK_RUN.md** - Início rápido (versão completa)
- **BACKEND_START.md** - Setup backend detalhado
- **TESTING_GUIDE.md** - Guia de testes

---

## 🎉 Pronto!

Você tem um sistema de rede social acadêmica rodando em 2 minutos!

**Próximo passo**: Testar funcionalidades com [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

**AcadLink - Conectando a comunidade acadêmica 🎓**
