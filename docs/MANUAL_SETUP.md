# Setup Manual - Validação de Universidade e Curso

## Passo 1: Ativar Ambiente Virtual

### Windows (PowerShell)
```powershell
.\.venv\Scripts\Activate.ps1
```

### Windows (CMD)
```cmd
.venv\Scripts\activate.bat
```

### Linux/Mac
```bash
source .venv/bin/activate
```

## Passo 2: Aplicar Migration

```bash
cd backend
python manage.py migrate
```

Você verá:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, users, posts, reels, connections, messages
Running migrations:
  Applying users.0003_add_courses_to_university... OK
```

## Passo 3: Popular Universidades e Cursos

```bash
python manage.py populate_universities
```

Você verá:
```
Criada: UEM — Universidade Eduardo Mondlane com 15 cursos
Criada: ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique com 5 cursos
Criada: UCM — Universidade Católica de Moçambique com 4 cursos
Criada: UniLúrio — Universidade Lúrio com 4 cursos
Criada: UP — Universidade Pedagógica com 7 cursos
Criada: ISRI — Instituto Superior de Relações Internacionais com 3 cursos
Criada: A Politécnica — Universidade Politécnica com 4 cursos
Criada: USTM — Universidade São Tomás de Moçambique com 3 cursos
Criada: ISPU — Instituto Superior Politécnico e Universitário com 3 cursos
Criada: ISCISA — Instituto Superior de Ciências de Saúde com 3 cursos
Universidades populadas com sucesso!
```

## Passo 4: Voltar para Raiz

```bash
cd ..
```

## Passo 5: Iniciar Backend

```bash
python backend/manage.py runserver
```

## Passo 6: Iniciar Frontend (em outro terminal)

```bash
cd acadlink
npm run dev
```

---

## ✅ Verificação

### 1. Verificar Universidades no Admin

Aceder a: http://localhost:8000/admin/users/university/

Deve ver 10 universidades com seus cursos.

### 2. Testar Endpoint de Universidades

```bash
curl http://localhost:8000/api/users/universities/
```

### 3. Testar Registro com Validação

Abrir http://localhost:5173/register e:
1. Selecionar uma universidade
2. Verificar que apenas os cursos dessa universidade aparecem
3. Registar com um curso válido

---

## 🎯 Pronto!

O sistema de validação de universidade e curso está funcionando!

