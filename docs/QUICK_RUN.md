# ⚡ Início Rápido - AcadLink

## 🚀 Opção 1: Scripts Automáticos (Recomendado)

### Windows

**Terminal 1 - Backend:**
```bash
cd backend
run.bat
```

**Terminal 2 - Frontend:**
```bash
cd acadlink
run.bat
```

### Linux/Mac

**Terminal 1 - Backend:**
```bash
cd backend
chmod +x run.sh
./run.sh
```

**Terminal 2 - Frontend:**
```bash
cd acadlink
chmod +x run.sh
./run.sh
```

---

## 🔧 Opção 2: Comandos Manuais

### Backend (Terminal 1)

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements/base.txt

# Executar migrações
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

### Frontend (Terminal 2)

```bash
cd acadlink

# Instalar dependências (primeira vez)
npm install

# Iniciar servidor
npm run dev
```

---

## ✅ Verificar se Está Funcionando

1. **Backend**: Abrir `http://localhost:8000/api/`
   - Deve aparecer a API REST

2. **Frontend**: Abrir `http://localhost:3000`
   - Deve aparecer a tela de splash com logo

3. **Criar Conta**: Clicar em "Criar Conta"
   - Preencher formulário
   - Clicar em "Criar conta"
   - Deve redirecionar para Dashboard

---

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verificar se Python está instalado
python --version

# Reinstalar dependências
pip install --upgrade -r requirements/base.txt
```

### Frontend não inicia
```bash
# Verificar se Node está instalado
node --version

# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Porta 8000 já em uso
```bash
python manage.py runserver 8001
# Depois atualizar VITE_API_URL em acadlink/.env
```

### Porta 3000 já em uso
```bash
npm run dev -- --port 5173
```

---

## 📊 Estrutura de Pastas

```
AcadLink/
├── backend/
│   ├── run.bat          ← Clique aqui (Windows)
│   ├── run.sh           ← Execute aqui (Linux/Mac)
│   └── manage.py
├── acadlink/
│   ├── run.bat          ← Clique aqui (Windows)
│   ├── run.sh           ← Execute aqui (Linux/Mac)
│   └── package.json
└── QUICK_RUN.md         ← Este arquivo
```

---

## 🎯 Próximos Passos

1. ✅ Executar scripts de inicialização
2. ✅ Abrir `http://localhost:3000`
3. ✅ Criar conta
4. ✅ Fazer login
5. ✅ Testar funcionalidades

---

## 📞 Precisa de Ajuda?

- Leia `BACKEND_START.md` para mais detalhes do backend
- Leia `FINAL_SETUP_GUIDE.md` para setup completo
- Leia `README_PT.md` para visão geral do projeto

**Pronto! Sistema funcionando! 🎉**
