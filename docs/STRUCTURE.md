# 📁 Estrutura do Projeto AcadLink

## Visão Geral
```
AcadLink/
├── 📦 acadlink/              # Frontend (Vue/Vite)
│   ├── src/                  # Código-fonte frontend
│   ├── public/               # Arquivos públicos
│   └── vite.config.js        # Configuração Vite
│
├── 🔧 backend/               # Backend (Django)
│   ├── apps/                 # Aplicações Django
│   ├── config/               # Configuração Django
│   ├── requirements/         # Dependências Python
│   ├── manage.py             # Gerenciador Django
│   └── db.sqlite3            # Banco de dados
│
├── 📚 docs/                  # Documentação centralizada
│   ├── guides/               # Guias de implementação e uso
│   ├── api/                  # Documentação das APIs
│   ├── technical/            # Documentação técnica
│   └── [arquivos gerais]     # Guias rápidos e referências
│
├── 🚀 scripts/               # Scripts de automação
│   ├── run_setup.ps1         # Setup do projeto (PowerShell)
│   ├── run_migration.ps1     # Executar migrações (PowerShell)
│   └── setup.bat             # Setup (Batch)
│
├── 🐳 infrastructure/        # Configuração de deployment
│   ├── Dockerfile            # Configuração Docker backend
│   ├── docker-compose.yml    # Orquestração de containers
│   └── [configurações]       # Outras configs de infra
│
├── ⚙️ config/                # Configurações compartilhadas
│   └── [arquivos config]     # Configurações globais
│
├── 🔄 .venv/                 # Ambiente virtual Python
├── 📝 .vscode/               # Configurações VS Code
└── 🎯 .kiro/                 # Cache/Build files
```

## 🚀 Como Iniciar

### 1️⃣ Setup Inicial
```bash
# Windows PowerShell
.\scripts\run_setup.ps1

# Ou Windows CMD
.\scripts\setup.bat
```

### 2️⃣ Executar Backend
```bash
cd backend
python manage.py runserver
```

### 3️⃣ Executar Frontend
```bash
cd acadlink
npm run dev
```

## 📖 Documentação

### Guias Rápidos
- [START_HERE.md](docs/START_HERE.md) - Comece aqui
- [QUICK_START.md](docs/QUICK_START.md) - 5 minutos de setup
- [QUICK_RUN.md](docs/QUICK_RUN.md) - Como rodar o projeto

### Documentação Técnica
- [SYSTEM_STATUS.txt](docs/SYSTEM_STATUS.txt) - Status completo do sistema
- [BACKEND_STRUCTURE.txt](docs/BACKEND_STRUCTURE.txt) - Estrutura do backend
- [API_ENDPOINTS_REQUIRED.md](docs/API_ENDPOINTS_REQUIRED.md) - APIs necessárias
- [APIS_IMPLEMENTED.md](docs/APIS_IMPLEMENTED.md) - APIs implementadas

### Guias de Implementação
- [IMPLEMENTATION_GUIDE_VERIFIED.md](docs/IMPLEMENTATION_GUIDE_VERIFIED.md)
- [REGISTRATION_FLOW_DIAGRAM.md](docs/REGISTRATION_FLOW_DIAGRAM.md)
- [VALIDATION_SYSTEM.md](docs/VALIDATION_SYSTEM.md)

## 🔍 Estrutura de Pastas Explicada

### `/acadlink` - Frontend
- Projeto Vue 3 com Vite
- Componentes React no Tailwind CSS
- Integração com API backend

### `/backend` - Backend Django
- Models de User, University, Course
- APIs RESTful
- Autenticação e validação
- Banco de dados SQLite

### `/docs` - Documentação
- **guides/**: Guias passo-a-passo
- **api/**: Documentação das endpoints
- **technical/**: Detalhes técnicos de implementação

### `/scripts` - Scripts de Automação
- Setup inicial
- Migrações de banco
- Execução de testes

### `/infrastructure` - Deployment
- Configurações Docker
- Docker Compose
- Variáveis de ambiente

## 📋 Lista de Verificação

- [ ] Clonar repositório
- [ ] Executar `scripts/run_setup.ps1`
- [ ] Verificar `SYSTEM_STATUS.txt`
- [ ] Iniciar backend
- [ ] Iniciar frontend
- [ ] Testar APIs

## ✅ Status do Projeto

**Estado:** ✅ COMPLETO E PRONTO PARA PRODUÇÃO

- ✅ Backend implementado
- ✅ Frontend integrado
- ✅ Validação de universidades e cursos
- ✅ Documentação completa
- ✅ Testes realizados

---

**Última atualização:** 19 de maio de 2026

