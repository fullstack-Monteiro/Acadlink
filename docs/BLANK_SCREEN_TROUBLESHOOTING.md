# 🔧 Solução de Problemas - Tela em Branco

## Problema
O sistema está aparecendo em branco quando você acessa http://localhost:3000 (ou a porta configurada).

---

## Checklist de Diagnóstico

### 1. Verificar se o servidor está rodando
```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd acadlink
npm run dev
```

**Esperado**: 
- Backend: `Starting development server at http://127.0.0.1:8000/`
- Frontend: `VITE v5.4.2 ready in XXX ms` e `➜ Local: http://localhost:3000`

---

### 2. Abrir Console do Navegador
1. Pressionar `F12` ou `Ctrl+Shift+I`
2. Ir para aba "Console"
3. Procurar por erros em vermelho

**Erros Comuns**:
- `Cannot GET /` - Servidor frontend não está rodando
- `Failed to fetch` - Servidor backend não está acessível
- `Module not found` - Problema com imports

---

### 3. Verificar Conectividade

#### Backend está rodando?
```bash
curl http://localhost:8000/api/universities/
```

**Esperado**: Retorna JSON com lista de universidades

#### Frontend está rodando?
```bash
curl http://localhost:3000
```

**Esperado**: Retorna HTML com `<div id="root"></div>`

---

### 4. Limpar Cache e Reinstalar

```bash
# Frontend
cd acadlink
rm -rf node_modules package-lock.json
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### 5. Verificar Arquivo HTML

O arquivo `acadlink/index.html` deve ter:
```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

✅ **Status**: Verificado e correto

---

### 6. Verificar Imports no App.jsx

Todos os imports devem estar corretos:
- ✅ React Router
- ✅ Context Providers
- ✅ Pages
- ✅ Components

**Problema Encontrado**: Rotas duplicadas (CORRIGIDO)

---

### 7. Verificar Tailwind CSS

O Tailwind deve estar compilando corretamente:
```bash
cd acadlink
npm run dev
```

Procurar por mensagens de erro relacionadas a Tailwind.

---

## Soluções Rápidas

### Solução 1: Reiniciar Servidores
```bash
# Parar todos os servidores (Ctrl+C)
# Limpar cache
rm -rf acadlink/.vite
rm -rf backend/__pycache__

# Reiniciar
cd backend && python manage.py runserver
cd acadlink && npm run dev
```

### Solução 2: Verificar Porta
Se a porta 3000 está em uso:
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

Mudar porta no `vite.config.js`:
```javascript
server: {
  port: 5173,  // Mudar para outra porta
}
```

### Solução 3: Verificar Variáveis de Ambiente
```bash
# Backend - verificar .env
cat backend/.env

# Frontend - verificar .env (se existir)
cat acadlink/.env
```

---

## Logs para Verificar

### Backend
```bash
cd backend
python manage.py runserver --verbosity 2
```

### Frontend
```bash
cd acadlink
npm run dev -- --debug
```

---

## Próximas Ações

1. ✅ Abrir console do navegador (F12)
2. ✅ Procurar por erros em vermelho
3. ✅ Verificar se ambos os servidores estão rodando
4. ✅ Tentar limpar cache e reinstalar
5. ✅ Verificar conectividade entre frontend e backend

---

## Contato

Se o problema persistir:
1. Compartilhar screenshot do console (F12)
2. Compartilhar output dos servidores
3. Verificar se há firewall bloqueando portas

