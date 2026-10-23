# Passos de Implementação - Validação de Universidade e Curso

## ✅ O que foi feito

### Backend
- ✅ Adicionado campo `courses` ao modelo `University`
- ✅ Adicionado método `has_course()` ao modelo `University`
- ✅ Atualizado `UniversitySerializer` para incluir `courses`
- ✅ Atualizado `UserRegisterSerializer` para validar curso
- ✅ Criada migration `0003_add_courses_to_university.py`
- ✅ Criado script `populate_universities.py` para popular dados

### Frontend
- ✅ Atualizado `UniversitySelect.jsx` para carregar universidades do backend
- ✅ Atualizado `CourseSelect.jsx` para carregar cursos da universidade selecionada
- ✅ Atualizado `Register.jsx` para passar `university.id` corretamente

---

## 🚀 Próximos Passos

### 1. Aplicar Migration no Backend

```bash
cd backend
python manage.py migrate
```

### 2. Popular Universidades e Cursos

```bash
python manage.py populate_universities
```

Você verá algo como:
```
Criada: UEM — Universidade Eduardo Mondlane com 15 cursos
Criada: ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique com 5 cursos
...
Universidades populadas com sucesso!
```

### 3. Testar o Endpoint de Universidades

```bash
curl http://localhost:8000/api/users/universities/
```

Resposta esperada:
```json
[
  {
    "id": 1,
    "name": "UEM — Universidade Eduardo Mondlane",
    "acronym": "UEM",
    "country": "Moçambique",
    "courses": [
      "Engenharia Informática",
      "Engenharia Civil",
      ...
    ]
  },
  ...
]
```

### 4. Testar o Registro com Validação

**Teste 1: Curso válido (deve funcionar)**
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ana_machava",
    "email": "ana@gmail.com",
    "first_name": "Ana",
    "last_name": "Machava",
    "university_id": 1,
    "course": "Engenharia Informática",
    "year": 1,
    "password": "SenhaForte123!",
    "password_confirm": "SenhaForte123!"
  }'
```

**Teste 2: Curso inválido (deve falhar)**
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "carlos_silva",
    "email": "carlos@gmail.com",
    "first_name": "Carlos",
    "last_name": "Silva",
    "university_id": 1,
    "course": "Curso Inexistente",
    "year": 1,
    "password": "SenhaForte123!",
    "password_confirm": "SenhaForte123!"
  }'
```

Resposta esperada:
```json
{
  "course": ["This course is not offered by UEM — Universidade Eduardo Mondlane"]
}
```

### 5. Testar no Frontend

1. Abrir a página de registro
2. Selecionar uma universidade
3. Verificar que apenas os cursos dessa universidade aparecem
4. Tentar registar com um curso válido
5. Verificar que o registro funciona

---

## 📋 Checklist de Verificação

- [ ] Migration aplicada com sucesso
- [ ] Universidades populadas no banco de dados
- [ ] Endpoint `/api/users/universities/` retorna dados com `courses`
- [ ] Registro com curso válido funciona
- [ ] Registro com curso inválido é rejeitado
- [ ] Frontend carrega universidades do backend
- [ ] Frontend carrega cursos da universidade selecionada
- [ ] Seletor de curso fica desabilitado até selecionar universidade

---

## 🔍 Troubleshooting

### Erro: "No module named 'apps.users.management'"

Solução: Criar os arquivos `__init__.py`:
```bash
touch backend/apps/users/management/__init__.py
touch backend/apps/users/management/commands/__init__.py
```

### Erro: "Course not offered by University"

Verificar:
1. O curso está na lista de cursos da universidade?
2. O nome do curso é exatamente igual (maiúsculas/minúsculas)?
3. Não há espaços extras no nome do curso?

### Frontend não carrega universidades

Verificar:
1. Backend está rodando?
2. Endpoint `/api/users/universities/` está acessível?
3. Verificar console do navegador para erros de CORS

---

## 📝 Dados Populados

As seguintes universidades foram adicionadas com seus cursos:

1. **UEM** - 15 cursos
2. **ISCTEM** - 5 cursos
3. **UCM** - 4 cursos
4. **UniLúrio** - 4 cursos
5. **UP** - 7 cursos
6. **ISRI** - 3 cursos
7. **A Politécnica** - 4 cursos
8. **USTM** - 3 cursos
9. **ISPU** - 3 cursos
10. **ISCISA** - 3 cursos

Total: 55 cursos em 10 universidades

---

## 🎯 Resultado Final

✅ Sistema de validação simples e eficaz:
- Universidades carregadas do backend
- Cursos validados contra universidade
- Impossível selecionar curso inválido
- Validação no backend garante segurança

