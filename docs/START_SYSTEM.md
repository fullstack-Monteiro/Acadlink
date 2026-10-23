# 🚀 Como Iniciar o Sistema AcadLink

## Pré-requisitos

- ✅ Python 3.8+ instalado
- ✅ Node.js 14+ instalado
- ✅ npm instalado
- ✅ Ambiente virtual (.venv) criado

---

## Opção 1: Usar Script Batch (Windows - Recomendado)

### Passo 1: Executar Setup
```bash
setup.bat
```

Este script vai:
1. Executar migrations do banco de dados
2. Popular universidades com cursos verificados
3. Mostrar instruções para iniciar os servidores

### Passo 2: Abrir 2 Terminais

**Terminal 1 - Backend**
```bash
cd backend
python manage.py runserver
```

Você deve ver:
```
Starting development server at http://127.0.0.1:8000/
```

**Terminal 2 - Frontend**
```bash
cd acadlink
npm run dev
```

Você deve ver:
```
VITE v5.4.2  ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Passo 3: Acessar Sistema
Abrir navegador em: **http://localhost:3000**

---

## Opção 2: Fazer Manualmente (Passo a Passo)

### Passo 1: Ativar Ambiente Virtual

**Windows (PowerShell)**
```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows (CMD)**
```cmd
.venv\Scripts\activate.bat
```

**Mac/Linux**
```bash
source .venv/bin/activate
```

### Passo 2: Executar Migrations

```bash
cd backend
python manage.py migrate
```

Esperado:
```
Operations to perform:
  Apply all migrations: admin, auth, contenttypes, sessions, users, posts, reels
Running migrations:
  Applying users.0003_add_courses_to_university... OK
```

### Passo 3: Popular Universidades

```bash
python manage.py populate_universities
```

Esperado:
```
Criada: UEM — Universidade Eduardo Mondlane com 15 cursos
Criada: ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique com 5 cursos
...
Criada: Instituto Superior Politécnico de Manica com 6 cursos
Universidades populadas com sucesso!
```

### Passo 4: Iniciar Backend

```bash
python manage.py runserver
```

Esperado:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

### Passo 5: Abrir Novo Terminal e Iniciar Frontend

```bash
cd acadlink
npm run dev
```

Esperado:
```
VITE v5.4.2  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

### Passo 6: Acessar Sistema

Abrir navegador em: **http://localhost:3000**

---

## Verificação

### ✅ Backend Funcionando
```bash
curl http://localhost:8000/api/universities/
```

Deve retornar JSON com lista de universidades.

### ✅ Frontend Funcionando
Você deve ver:
- Logo do AcadLink
- Spinner de carregamento
- Após 3 segundos: Página Welcome com botões "Criar conta" e "Já tenho conta"

### ✅ Universidades Carregadas
1. Ir para http://localhost:3000/register
2. Clicar em "Criar conta"
3. Preencher dados
4. Clicar no dropdown de universidade
5. Deve aparecer lista de 20 universidades

### ✅ Cursos Carregando
1. Selecionar uma universidade (ex: UEM)
2. Clicar no dropdown de curso
3. Deve aparecer lista de cursos daquela universidade

---

## Troubleshooting

### Problema: "ModuleNotFoundError: No module named 'django'"

**Solução**: Ativar ambiente virtual
```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Windows CMD
.venv\Scripts\activate.bat

# Mac/Linux
source .venv/bin/activate
```

### Problema: "Port 8000 already in use"

**Solução**: Usar outra porta
```bash
python manage.py runserver 8001
```

### Problema: "Port 3000 already in use"

**Solução**: Mudar porta no vite.config.js
```javascript
server: {
  port: 5173,  // Mudar para outra porta
}
```

### Problema: Tela em branco no navegador

**Solução**:
1. Abrir console (F12)
2. Procurar por erros vermelhos
3. Verificar se backend está rodando: `curl http://localhost:8000/api/universities/`
4. Verificar se frontend está rodando: `curl http://localhost:3000`

### Problema: Universidades não aparecem

**Solução**:
1. Verificar se migration foi executada: `python manage.py showmigrations`
2. Verificar se populate_universities foi executado
3. Verificar banco de dados: `python manage.py shell`
   ```python
   from apps.users.models import University
   print(University.objects.count())  # Deve retornar 20
   ```

---

## Próximas Ações

1. ✅ Executar setup.bat (ou passos manuais)
2. ✅ Iniciar backend e frontend
3. ✅ Acessar http://localhost:3000
4. ✅ Testar fluxo de registro
5. ✅ Selecionar universidade e curso

---

## Documentação Relacionada

- **UNIVERSITIES_COURSES_VERIFICATION.md** - Verificação de cursos
- **IMPLEMENTATION_GUIDE_VERIFIED.md** - Guia de implementação
- **BLANK_SCREEN_TROUBLESHOOTING.md** - Solução de problemas
- **TEST_FRONTEND.md** - Teste do frontend

