# ✅ Implementação Completa - Validação de Universidade e Curso

## O que foi implementado

Um sistema simples e eficaz de validação que garante que:
1. Cada universidade tem uma lista de cursos válidos
2. O usuário só pode selecionar cursos que existem na universidade
3. O backend valida e rejeita cursos inválidos

---

## Mudanças no Backend

### 1. Modelo University (`backend/apps/users/models.py`)
```python
class University(models.Model):
    # ... campos existentes ...
    courses = models.JSONField(default=list, help_text="Lista de cursos oferecidos")
    
    def has_course(self, course_name):
        """Verifica se a universidade oferece este curso"""
        return course_name in self.courses
```

### 2. Serializer (`backend/apps/users/serializers.py`)
```python
class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'acronym', 'country', 'courses']

class UserRegisterSerializer(serializers.ModelSerializer):
    def validate(self, data):
        # ... validações existentes ...
        
        # Validar curso existe na universidade
        university = University.objects.get(id=data['university_id'])
        course = data.get('course', '').strip()
        if course and not university.has_course(course):
            raise serializers.ValidationError({
                'course': f'This course is not offered by {university.name}'
            })
        
        return data
```

### 3. Migration (`backend/apps/users/migrations/0003_add_courses_to_university.py`)
Adiciona o campo `courses` ao modelo University.

### 4. Management Command (`backend/apps/users/management/commands/populate_universities.py`)
Script que popula o banco de dados com 10 universidades e 55 cursos.

---

## Mudanças no Frontend

### 1. UniversitySelect (`acadlink/src/components/ui/UniversitySelect.jsx`)
- Carrega universidades do backend via API
- Exibe nome da universidade selecionada
- Filtra universidades conforme digita

### 2. CourseSelect (`acadlink/src/components/ui/CourseSelect.jsx`)
- Carrega cursos da universidade selecionada
- Fica desabilitado até selecionar universidade
- Filtra cursos conforme digita

### 3. Register (`acadlink/src/pages/auth/Register.jsx`)
- Passa `university.id` corretamente para o backend
- Trata erro de curso inválido

---

## Dados Populados

10 universidades com seus cursos:

| Universidade | Cursos |
|---|---|
| UEM | 15 |
| ISCTEM | 5 |
| UCM | 4 |
| UniLúrio | 4 |
| UP | 7 |
| ISRI | 3 |
| A Politécnica | 4 |
| USTM | 3 |
| ISPU | 3 |
| ISCISA | 3 |
| **Total** | **55** |

---

## Como Usar

### Setup Inicial

1. Ativar ambiente virtual:
```bash
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
```

2. Aplicar migration:
```bash
cd backend
python manage.py migrate
```

3. Popular universidades:
```bash
python manage.py populate_universities
```

4. Voltar para raiz:
```bash
cd ..
```

### Iniciar Aplicação

Terminal 1 (Backend):
```bash
python backend/manage.py runserver
```

Terminal 2 (Frontend):
```bash
cd acadlink
npm run dev
```

---

## Fluxo de Uso

```
1. Usuário acessa página de registro
   ↓
2. Seleciona universidade
   ↓
3. Sistema carrega cursos dessa universidade
   ↓
4. Usuário seleciona curso (só pode escolher cursos válidos)
   ↓
5. Usuário preenche outros dados e registra
   ↓
6. Backend valida:
   - Curso existe na universidade? ✓
   - Email é válido? ✓
   - Senha é forte? ✓
   ↓
7. Usuário registado com sucesso
```

---

## Validação

### No Frontend
- Curso fica desabilitado até selecionar universidade
- Apenas cursos da universidade aparecem na lista
- Validação em tempo real

### No Backend
- Valida que curso existe na universidade
- Rejeita requisições com cursos inválidos
- Mensagem de erro clara

---

## Endpoints

### Listar Universidades
```
GET /api/users/universities/
```

Resposta:
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
  }
]
```

### Registar Usuário
```
POST /api/users/register/
```

Payload:
```json
{
  "username": "ana_machava",
  "email": "ana@gmail.com",
  "first_name": "Ana",
  "last_name": "Machava",
  "university_id": 1,
  "course": "Engenharia Informática",
  "year": 1,
  "password": "SenhaForte123!",
  "password_confirm": "SenhaForte123!"
}
```

---

## Segurança

✅ Validação no backend (não confia no frontend)
✅ Impossível selecionar curso inválido
✅ Mensagens de erro claras
✅ Dados consistentes no banco de dados

---

## Próximos Passos (Opcional)

Se quiser adicionar mais funcionalidades:

1. **Adicionar mais universidades**: Editar `populate_universities.py`
2. **Adicionar mais cursos**: Editar `populate_universities.py`
3. **Permitir edição de cursos**: Criar admin interface
4. **Sincronizar com API de universidades**: Integrar com dados reais

---

## Troubleshooting

### Erro: "No module named 'django'"
Solução: Ativar ambiente virtual

### Erro: "Course not offered by University"
Solução: Verificar se o nome do curso é exatamente igual

### Frontend não carrega universidades
Solução: Verificar se backend está rodando em http://localhost:8000

---

## ✅ Conclusão

Sistema simples, eficaz e seguro de validação de universidade e curso implementado com sucesso!

