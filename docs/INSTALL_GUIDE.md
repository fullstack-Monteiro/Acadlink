# 📦 Guia Completo de Instalação - AcadLink

## 🎯 Escolha Sua Opção

### ⚡ Opção 1: Rápida (2 minutos)
- Funcionalidades básicas
- Sem WebSockets
- Sem processamento de vídeos
- Ideal para: Testes rápidos, desenvolvimento inicial

**Ir para**: [QUICK_INSTALL.md](QUICK_INSTALL.md)

### 🚀 Opção 2: Completa (10 minutos)
- Todas as funcionalidades
- WebSockets inclusos
- Processamento de vídeos
- Ideal para: Desenvolvimento completo, deployment

**Ir para**: [INSTALL_HEAVY.md](INSTALL_HEAVY.md)

### 🔧 Opção 3: Customizada
- Escolher quais dependências instalar
- Combinar componentes
- Ideal para: Controle total

**Ir para**: [INSTALL_HEAVY.md](INSTALL_HEAVY.md)

---

## 📊 Comparação Rápida

| Aspecto | Rápida | Completa |
|--------|--------|----------|
| **Tempo** | 2 min | 10 min |
| **Tamanho** | 50MB | 500MB |
| **Posts** | ✅ | ✅ |
| **Reels** | ✅ | ✅ |
| **Mensagens** | ❌ | ✅ |
| **Notificações** | ❌ | ✅ |
| **Processamento Vídeo** | ❌ | ✅ |
| **WebSockets** | ❌ | ✅ |

---

## 🚀 Começar Agora

### Opção 1: Rápida

**Windows:**
```bash
cd backend && run-quick.bat
cd acadlink && npm install && npm run dev
```

**Linux/Mac:**
```bash
cd backend && chmod +x run-quick.sh && ./run-quick.sh
cd acadlink && npm install && npm run dev
```

### Opção 2: Completa

**Windows:**
```bash
cd backend && run.bat
cd acadlink && npm install && npm run dev
```

**Linux/Mac:**
```bash
cd backend && chmod +x run.sh && ./run.sh
cd acadlink && npm install && npm run dev
```

---

## 📋 Arquivos de Requirements

### `requirements/dev-minimal.txt`
- Django
- REST Framework
- CORS
- JWT
- Pillow

**Tamanho**: ~50MB  
**Tempo**: ~1 minuto

### `requirements/base.txt`
- Tudo do dev-minimal
- Channels (WebSockets)
- Celery (Async)
- Redis

**Tamanho**: ~150MB  
**Tempo**: ~3 minutos

### `requirements/heavy.txt`
- Tudo do base
- FFmpeg (Video)
- OpenCV (Visão)
- AWS S3
- Sentry
- Testing

**Tamanho**: ~500MB  
**Tempo**: ~10 minutos

---

## 🎯 Recomendações

### Para Começar
```bash
pip install -r requirements/dev-minimal.txt
```

### Para Desenvolvimento Completo
```bash
pip install -r requirements/base.txt
```

### Para Produção
```bash
pip install -r requirements/heavy.txt
```

---

## 🔄 Atualizar Dependências

### Adicionar WebSockets Depois
```bash
pip install channels==4.0.0 daphne==4.0.0
```

### Adicionar Celery Depois
```bash
pip install celery==5.3.4 redis==5.0.1
```

### Adicionar Video Processing Depois
```bash
pip install ffmpeg-python==0.2.1 moviepy==1.0.3 opencv-python==4.8.1.78
```

---

## 📞 Precisa de Ajuda?

- **Instalação Rápida**: [QUICK_INSTALL.md](QUICK_INSTALL.md)
- **Dependências Pesadas**: [INSTALL_HEAVY.md](INSTALL_HEAVY.md)
- **Setup Backend**: [BACKEND_START.md](BACKEND_START.md)
- **Troubleshooting**: [FINAL_SETUP_GUIDE.md](FINAL_SETUP_GUIDE.md)

---

## ✅ Checklist de Instalação

- [ ] Python 3.9+ instalado
- [ ] Node.js 16+ instalado
- [ ] Escolheu opção (Rápida/Completa)
- [ ] Executou script de instalação
- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:3000
- [ ] Criou conta com sucesso
- [ ] Testou funcionalidades básicas

---

## 🎉 Pronto!

Escolha sua opção acima e comece!

**Recomendação**: Comece com a opção **Rápida** e depois atualize para **Completa** se precisar.

---

**AcadLink - Conectando a comunidade acadêmica 🎓**
