# 🔧 Como Rodar no PowerShell - AcadLink

## ⚡ Solução Rápida

Se você está usando **PowerShell** e recebeu erro ao tentar `run.bat`, use os scripts `.ps1`:

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

## ⚠️ Se Receber Erro de Execução

Se receber:
```
cannot be loaded because running scripts is disabled on this system
```

Execute **uma única vez**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois tente novamente:
```powershell
.\run-quick.ps1
```

---

## 📋 Scripts Disponíveis

### Backend

```powershell
# Rápido (50MB, 2 min)
.\run-quick.ps1

# Completo (500MB, 10 min)
.\run.ps1
```

### Frontend

```powershell
# Iniciar dev server
.\run.ps1
```

---

## 🎯 Resumo

```powershell
# Terminal 1
cd backend
.\run-quick.ps1

# Terminal 2
cd acadlink
npm install
npm run dev

# Abrir navegador
http://localhost:3000
```

---

## 💡 Alternativas

### Usar Windows Terminal (Recomendado)
1. Abrir Microsoft Store
2. Procurar "Windows Terminal"
3. Instalar
4. Usar os mesmos comandos acima

### Usar Windows CMD
```cmd
cd backend
run-quick.bat

cd acadlink
npm install
npm run dev
```

### Usar Git Bash
```bash
cd backend
./run-quick.sh

cd acadlink
npm install
npm run dev
```

---

## ✅ Checklist

- [ ] Abrir PowerShell
- [ ] Navegar para `backend`
- [ ] Executar `.\run-quick.ps1`
- [ ] Abrir outro PowerShell
- [ ] Navegar para `acadlink`
- [ ] Executar `npm install && npm run dev`
- [ ] Abrir `http://localhost:3000`
- [ ] Criar conta
- [ ] Fazer login

---

## 📞 Problemas?

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

### Erro: "pip: The term 'pip' is not recognized"
```powershell
# Reinstalar Python com pip incluído
# Ou usar: python -m pip install -r requirements/dev-minimal.txt
```

---

## 🎉 Pronto!

Você tem um sistema de rede social acadêmica rodando no PowerShell!

**Próximo passo**: Testar funcionalidades com [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

**AcadLink - Conectando a comunidade acadêmica 🎓**
