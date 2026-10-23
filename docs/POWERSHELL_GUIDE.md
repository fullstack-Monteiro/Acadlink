# 🔧 Guia PowerShell - AcadLink

## ⚡ Problema: run.bat não funciona no PowerShell

Se você receber este erro:
```
run.bat : The term 'run.bat' is not recognized as the name of a cmdlet...
```

**Solução**: Use os scripts PowerShell (`.ps1`) em vez dos batch (`.bat`)

---

## 🚀 Opção 1: Rápida (2 minutos)

### Terminal 1 - Backend

```powershell
cd backend
.\run-quick.ps1
```

### Terminal 2 - Frontend

```powershell
cd acadlink
npm install
npm run dev
```

### Abrir Navegador
```
http://localhost:3000
```

---

## 🚀 Opção 2: Completa (10 minutos)

### Terminal 1 - Backend

```powershell
cd backend
.\run.ps1
```

### Terminal 2 - Frontend

```powershell
cd acadlink
npm install
npm run dev
```

### Abrir Navegador
```
http://localhost:3000
```

---

## 📋 Scripts PowerShell Disponíveis

### Backend

| Script | Descrição | Tempo |
|--------|-----------|-------|
| `.\run-quick.ps1` | Rápido (50MB) | 2 min |
| `.\run.ps1` | Completo (500MB) | 10 min |

### Frontend

| Script | Descrição |
|--------|-----------|
| `.\run.ps1` | Iniciar dev server |

---

## 🔧 Se Receber Erro de Execução

Se receber erro como:
```
cannot be loaded because running scripts is disabled on this system
```

Execute este comando uma vez:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois tente novamente:
```powershell
.\run-quick.ps1
```

---

## 📊 Comparação: .bat vs .ps1

| Aspecto | .bat | .ps1 |
|--------|------|------|
| **Windows CMD** | ✅ | ❌ |
| **Windows PowerShell** | ❌ | ✅ |
| **Windows Terminal** | ✅ | ✅ |
| **Funcionalidade** | Igual | Igual |

---

## 💡 Dica: Usar Windows Terminal

Se estiver usando PowerShell, recomendo usar **Windows Terminal** (mais moderno):

1. Abrir Microsoft Store
2. Procurar "Windows Terminal"
3. Instalar
4. Abrir Windows Terminal
5. Usar os scripts `.ps1`

---

## 🎯 Resumo Rápido

**PowerShell:**
```powershell
# Backend (Rápido)
cd backend && .\run-quick.ps1

# Frontend
cd acadlink && npm install && npm run dev

# Abrir
http://localhost:3000
```

**Windows Terminal (Recomendado):**
```powershell
# Mesmo comando acima
cd backend && .\run-quick.ps1
```

**Windows CMD (Se preferir):**
```cmd
# Backend (Rápido)
cd backend && run-quick.bat

# Frontend
cd acadlink && npm install && npm run dev

# Abrir
http://localhost:3000
```

---

## 📞 Problemas?

### Erro: "cannot be loaded because running scripts is disabled"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erro: "python: The term 'python' is not recognized"
```powershell
# Verificar se Python está instalado
python --version

# Se não estiver, instalar de https://python.org
```

### Erro: "npm: The term 'npm' is not recognized"
```powershell
# Verificar se Node está instalado
node --version

# Se não estiver, instalar de https://nodejs.org
```

---

## 📚 Documentação

- **START.md** - Comece aqui
- **QUICK_INSTALL.md** - Instalação rápida
- **INSTALL_GUIDE.md** - Guia de instalação

---

**Pronto para usar PowerShell! 🚀**
