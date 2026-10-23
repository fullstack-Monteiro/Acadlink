# 📋 Índice Centralizado - AcadLink

## 🎯 Comece Por Aqui
1. [STRUCTURE.md](STRUCTURE.md) - Visão geral da estrutura
2. [docs/START_HERE.md](docs/START_HERE.md) - Guia inicial
3. [SYSTEM_STATUS.txt](SYSTEM_STATUS.txt) - Status completo

## 🚀 Como Rodar
```bash
# 1. Setup
.\scripts\run_setup.ps1

# 2. Backend
cd backend && python manage.py runserver

# 3. Frontend  
cd acadlink && npm run dev
```

## 📁 Estrutura Principal

```
🎓 AcadLink (Sistema de Validação de Universidades)
│
├─📦 acadlink/          → Frontend (Vue/Vite)
├─🔧 backend/           → Backend (Django)
├─📚 docs/              → Documentação completa
├─🚀 scripts/           → Scripts de automação
├─🐳 infrastructure/    → Docker e deployment
└─⚙️ config/            → Configurações
```

## 📚 Documentação Organizada

### 🟢 Guia Rápido (Inicien aqui)
- [START_HERE.md](docs/START_HERE.md)
- [QUICK_START.md](docs/QUICK_START.md)
- [QUICK_RUN.md](docs/QUICK_RUN.md)

### 🟡 Referência
- [SYSTEM_STATUS.txt](SYSTEM_STATUS.txt) - Status completo
- [BACKEND_STRUCTURE.txt](docs/BACKEND_STRUCTURE.txt)
- [COMPLETE_UNIVERSITIES_LIST.md](docs/COMPLETE_UNIVERSITIES_LIST.md)

### 🔵 Técnico
- [APIS_IMPLEMENTED.md](docs/APIS_IMPLEMENTED.md)
- [IMPLEMENTATION_GUIDE_VERIFIED.md](docs/IMPLEMENTATION_GUIDE_VERIFIED.md)
- [REGISTRATION_FLOW_DIAGRAM.md](docs/REGISTRATION_FLOW_DIAGRAM.md)

### 🟣 Troubleshooting
- [BLANK_SCREEN_TROUBLESHOOTING.md](docs/BLANK_SCREEN_TROUBLESHOOTING.md)
- [QUICK_FIX_BLANK_SCREEN.md](docs/QUICK_FIX_BLANK_SCREEN.md)

## ✅ Checklist de Implementação

### Backend
- ✅ Modelos (University, Course, User)
- ✅ APIs RESTful
- ✅ Validação de cursos
- ✅ Banco de dados

### Frontend  
- ✅ Componentes (UniversitySelect, CourseSelect)
- ✅ Integração com API
- ✅ Validação em tempo real
- ✅ Tratamento de erros

### Data
- ✅ 20 universidades moçambicanas verificadas
- ✅ 110+ cursos realistas
- ✅ Sistema de validação de integridade

## 🔧 Scripts Disponíveis

| Script | Propósito |
|--------|-----------|
| `scripts/run_setup.ps1` | Setup completo do projeto |
| `scripts/run_migration.ps1` | Executar migrações Django |
| `scripts/setup.bat` | Setup (Windows batch) |

## 📊 Status do Projeto

```
🟢 COMPLETO - Pronto para Produção

Frontend:  ✅ Integrado
Backend:   ✅ Implementado  
Data:      ✅ Verificada
Tests:     ✅ Realizados
Docs:      ✅ Completa
```

---

**Dica:** Use `STRUCTURE.md` para entender a organização. Use `SYSTEM_STATUS.txt` para detalhes técnicos.

