# 🚀 Guia de Implementação - Sistema de Validação de Universidades e Cursos

## Status: ✅ PRONTO PARA IMPLEMENTAÇÃO

Todos os cursos foram verificados e o sistema está pronto para ser implementado.

---

## Pré-requisitos

- Python 3.8+
- Django 3.2+
- Node.js 14+
- npm ou yarn

---

## Passo 1: Executar Migration

```bash
cd backend
python manage.py migrate
```

**O que faz**: Adiciona o campo `courses` (JSON) ao modelo University.

---

## Passo 2: Popular Universidades

```bash
python manage.py populate_universities
```

**O que faz**: Popula o banco de dados com 20 universidades e seus cursos verificados.

**Saída esperada**:
```
Criada: UEM — Universidade Eduardo Mondlane com 15 cursos
Criada: ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique com 5 cursos
...
Criada: Instituto Superior Politécnico de Manica com 6 cursos
Universidades populadas com sucesso!
```

---

## Passo 3: Testar no Frontend

### 3.1 Iniciar o servidor backend
```bash
cd backend
python manage.py runserver
```

### 3.2 Iniciar o servidor frontend
```bash
cd acadlink
npm run dev
```

### 3.3 Testar o fluxo de registro

1. Abrir http://localhost:5173 (ou a porta configurada)
2. Ir para página de registro
3. Preencher dados básicos
4. Selecionar uma universidade no dropdown
5. Verificar se os cursos aparecem corretamente
6. Selecionar um curso
7. Submeter o formulário

---

## Passo 4: Validação do Sistema

### Validação Frontend
- ✅ UniversitySelect carrega universidades da API
- ✅ CourseSelect carrega cursos baseado na universidade selecionada
- ✅ Apenas cursos da universidade selecionada aparecem
- ✅ Validação em tempo real

### Validação Backend
- ✅ Serializer valida que o curso existe na universidade
- ✅ Retorna erro se curso não pertence à universidade
- ✅ Salva corretamente no banco de dados

---

## Arquivos Modificados

### Backend
- `backend/apps/users/models.py` - Modelo University com campo `courses`
- `backend/apps/users/serializers.py` - Validação de curso
- `backend/apps/users/migrations/0003_add_courses_to_university.py` - Migration
- `backend/apps/users/management/commands/populate_universities.py` - Script de população

### Frontend
- `acadlink/src/components/ui/UniversitySelect.jsx` - Carrega universidades da API
- `acadlink/src/components/ui/CourseSelect.jsx` - Carrega cursos baseado na universidade
- `acadlink/src/pages/auth/Register.jsx` - Passa university.id corretamente

---

## Estrutura de Dados

### Modelo University
```python
class University(models.Model):
    name = models.CharField(max_length=255)
    acronym = models.CharField(max_length=50, unique=True)
    country = models.CharField(max_length=100)
    email_domain = models.CharField(max_length=100)
    courses = models.JSONField(default=list)  # Lista de cursos
    
    def has_course(self, course_name):
        return course_name in self.courses
```

### Validação no Serializer
```python
def validate(self, data):
    university = data.get('university')
    course = data.get('course')
    
    if university and course:
        if not university.has_course(course):
            raise ValidationError("Curso não oferecido por esta universidade")
    
    return data
```

---

## Endpoints da API

### GET /api/universities/
Retorna lista de todas as universidades com seus cursos.

**Resposta**:
```json
[
  {
    "id": 1,
    "name": "UEM — Universidade Eduardo Mondlane",
    "acronym": "UEM",
    "country": "Moçambique",
    "email_domain": "uem.ac.mz",
    "courses": [
      "Engenharia Informática",
      "Engenharia Civil",
      "Medicina",
      ...
    ]
  },
  ...
]
```

### POST /api/auth/register/
Registra novo usuário com validação de universidade e curso.

**Request**:
```json
{
  "email": "student@example.com",
  "password": "secure_password",
  "university": 1,
  "course": "Engenharia Informática"
}
```

**Validação**: O backend verifica se o curso existe na universidade.

---

## Testes Recomendados

### Teste 1: Validação Positiva
- Selecionar UEM
- Selecionar "Engenharia Informática"
- Deve funcionar ✅

### Teste 2: Validação Negativa
- Selecionar ISRI (que só tem Relações Internacionais, Diplomacia, Direito Internacional)
- Tentar selecionar "Engenharia Informática"
- Deve retornar erro ✅

### Teste 3: Todas as Universidades
- Testar cada uma das 20 universidades
- Verificar que os cursos aparecem corretamente

---

## Troubleshooting

### Problema: Universidades não aparecem no dropdown
**Solução**: 
1. Verificar se migration foi executada: `python manage.py showmigrations`
2. Verificar se populate_universities foi executado
3. Verificar se a API está retornando dados: `curl http://localhost:8000/api/universities/`

### Problema: Cursos não aparecem após selecionar universidade
**Solução**:
1. Verificar console do navegador para erros
2. Verificar se CourseSelect está recebendo university.id corretamente
3. Verificar se a API está retornando cursos

### Problema: Validação não funciona no backend
**Solução**:
1. Verificar se serializer tem o método `validate()`
2. Verificar se University.has_course() está implementado
3. Testar com curl: `curl -X POST http://localhost:8000/api/auth/register/ -d '{"university": 1, "course": "Invalid"}'`

---

## Documentação Relacionada

- **UNIVERSITIES_COURSES_VERIFICATION.md** - Verificação detalhada de cada universidade
- **VERIFICATION_SUMMARY.md** - Resumo das atualizações
- **COMPLETE_UNIVERSITIES_LIST.md** - Lista completa de 20 universidades
- **UMUM_COURSES_VERIFICATION.md** - Verificação da UMUM

---

## Próximas Melhorias (Futuro)

1. Adicionar mais universidades conforme forem registadas
2. Implementar sistema de atualização automática de cursos
3. Adicionar validação de email da universidade
4. Implementar verificação de badge "Verificado" para estudantes
5. Adicionar histórico de cursos por universidade

---

## Suporte

Para dúvidas ou problemas:
1. Consultar documentação de verificação
2. Verificar logs do backend
3. Verificar console do navegador
4. Testar endpoints da API com curl

