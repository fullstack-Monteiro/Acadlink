# 🚀 Quick Start - Validação de Universidade e Curso

## 3 Passos Rápidos

### 1️⃣ Ativar Ambiente Virtual
```powershell
.\.venv\Scripts\Activate.ps1
```

### 2️⃣ Executar Setup
```bash
cd backend
python manage.py migrate
python manage.py populate_universities
cd ..
```

### 3️⃣ Iniciar Aplicação
```bash
# Terminal 1
python backend/manage.py runserver

# Terminal 2
cd acadlink && npm run dev
```

---

## ✅ Verificar Funcionamento

1. Abrir http://localhost:5173/register
2. Selecionar universidade
3. Verificar que apenas cursos dessa universidade aparecem
4. Registar com um curso válido

---

## 📊 O que foi feito

| Componente | Status | Descrição |
|---|---|---|
| Backend Model | ✅ | Campo `courses` adicionado |
| Backend Validation | ✅ | Validação de curso implementada |
| Frontend UniversitySelect | ✅ | Carrega universidades do backend |
| Frontend CourseSelect | ✅ | Carrega cursos da universidade |
| Migration | ✅ | Criada e pronta para aplicar |
| Dados | ✅ | 10 universidades, 55 cursos |

---

## 🎯 Resultado

✅ Universidade e curso validados
✅ Impossível selecionar curso inválido
✅ Sistema simples e eficaz
✅ Pronto para usar

