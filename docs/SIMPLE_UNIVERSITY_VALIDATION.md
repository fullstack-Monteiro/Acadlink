# Validação Simples: Universidade e Curso

## O que fazer

Apenas validar que:
1. O curso selecionado existe na universidade selecionada
2. Nada mais. Sem documentos, sem moderadores, sem complicações.

---

## Backend - Modelo

```python
# backend/apps/users/models.py

class University(models.Model):
    name = models.CharField(max_length=255, unique=True)
    acronym = models.CharField(max_length=50, unique=True)
    country = models.CharField(max_length=100)
    website = models.URLField(blank=True)
    
    # Lista de cursos oferecidos
    courses = models.JSONField(default=list)
    
    class Meta:
        db_table = 'universities'
        verbose_name_plural = 'Universities'
    
    def __str__(self):
        return self.name
    
    def has_course(self, course_name):
        """Verifica se a universidade oferece este curso"""
        return course_name in self.courses
```

---

## Backend - Dados

```python
# Dados para popular no banco

UNIVERSITIES_DATA = [
    {
        'name': 'UEM — Universidade Eduardo Mondlane',
        'acronym': 'UEM',
        'country': 'Moçambique',
        'courses': [
            'Engenharia Informática',
            'Engenharia Civil',
            'Medicina',
            'Direito',
            'Economia',
            'Gestão de Empresas',
            'Arquitectura',
            'Enfermagem',
            'Educação',
            'Jornalismo',
            'Relações Internacionais',
            'Matemática',
            'Física',
            'Química',
            'Biologia',
        ],
    },
    {
        'name': 'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique',
        'acronym': 'ISCTEM',
        'country': 'Moçambique',
        'courses': [
            'Engenharia Informática',
            'Gestão de Empresas',
            'Marketing',
            'Contabilidade',
            'Economia',
        ],
    },
    {
        'name': 'UCM — Universidade Católica de Moçambique',
        'acronym': 'UCM',
        'country': 'Moçambique',
        'courses': [
            'Direito',
            'Teologia',
            'Educação',
            'Gestão de Empresas',
        ],
    },
    {
        'name': 'UniLúrio — Universidade Lúrio',
        'acronym': 'UniLúrio',
        'country': 'Moçambique',
        'courses': [
            'Medicina',
            'Enfermagem',
            'Educação',
            'Engenharia Informática',
        ],
    },
    {
        'name': 'UP — Universidade Pedagógica',
        'acronym': 'UP',
        'country': 'Moçambique',
        'courses': [
            'Educação',
            'Matemática',
            'Física',
            'Química',
            'Biologia',
            'Português',
            'Inglês',
        ],
    },
    {
        'name': 'ISRI — Instituto Superior de Relações Internacionais',
        'acronym': 'ISRI',
        'country': 'Moçambique',
        'courses': [
            'Relações Internacionais',
            'Diplomacia',
            'Direito Internacional',
        ],
    },
    {
        'name': 'A Politécnica — Universidade Politécnica',
        'acronym': 'A Politécnica',
        'country': 'Moçambique',
        'courses': [
            'Engenharia Informática',
            'Engenharia Civil',
            'Engenharia Electrónica',
            'Gestão de Empresas',
        ],
    },
    {
        'name': 'USTM — Universidade São Tomás de Moçambique',
        'acronym': 'USTM',
        'country': 'Moçambique',
        'courses': [
            'Direito',
            'Gestão de Empresas',
            'Economia',
        ],
    },
    {
        'name': 'ISPU — Instituto Superior Politécnico e Universitário',
        'acronym': 'ISPU',
        'country': 'Moçambique',
        'courses': [
            'Engenharia Informática',
            'Gestão de Empresas',
            'Contabilidade',
        ],
    },
    {
        'name': 'ISCISA — Instituto Superior de Ciências de Saúde',
        'acronym': 'ISCISA',
        'country': 'Moçambique',
        'courses': [
            'Enfermagem',
            'Saúde Pública',
            'Farmácia',
        ],
    },
]
```

---

## Backend - Validação no Registro

```python
# backend/apps/users/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import University, Profile

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    university_id = serializers.IntegerField(write_only=True)
    course = serializers.CharField(max_length=200)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'university_id', 'course', 'year',
        ]
    
    def validate(self, data):
        # Validar senhas
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        
        # Validar universidade existe
        try:
            university = University.objects.get(id=data['university_id'])
        except University.DoesNotExist:
            raise serializers.ValidationError({'university_id': 'University not found'})
        
        # Validar curso existe na universidade
        course = data.get('course', '').strip()
        if not university.has_course(course):
            raise serializers.ValidationError({
                'course': f'This course is not offered by {university.name}'
            })
        
        return data
    
    def create(self, validated_data):
        university_id = validated_data.pop('university_id')
        user = User.objects.create_user(
            university_id=university_id,
            **validated_data
        )
        Profile.objects.create(user=user)
        return user
```

---

## Frontend - Atualizar CourseSelect

```jsx
// acadlink/src/components/ui/CourseSelect.jsx

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'

export default function CourseSelect({ value, onChange, error, status, disabled, university }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState([])
  const [filtered, setFiltered] = useState([])
  const containerRef = useRef(null)

  // Quando universidade muda, atualizar cursos disponíveis
  useEffect(() => {
    if (university && university.courses) {
      setCourses(university.courses)
      setFiltered(university.courses)
    } else {
      setCourses([])
      setFiltered([])
    }
  }, [university])

  // Filtrar cursos conforme digita
  useEffect(() => {
    const filtered = courses.filter(c =>
      c.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(filtered)
  }, [search, courses])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusColor = () => {
    if (status === 'valid') return 'border-green-500'
    if (status === 'invalid') return 'border-red-500'
    if (status === 'warning') return 'border-yellow-500'
    return 'border-neutral-200 dark:border-[#3a3b3c]'
  }

  const isDisabled = disabled || !university

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-sm font-medium text-neutral-700 dark:text-[#e4e6ea]">
        Curso
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          disabled={isDisabled}
          className={`w-full rounded-xl border ${getStatusColor()} bg-white dark:bg-[#3a3b3c] text-neutral-900 dark:text-[#e4e6ea] px-4 py-2.5 flex items-center justify-between transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
        >
          <span className={value ? 'text-neutral-900 dark:text-[#e4e6ea]' : 'text-neutral-400'}>
            {value || (university ? 'Selecciona o curso' : 'Selecciona primeiro a universidade')}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#242526] border border-neutral-200 dark:border-[#3a3b3c] rounded-xl shadow-lg z-50">
            {/* Search */}
            <div className="p-3 border-b border-neutral-200 dark:border-[#3a3b3c]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Busca curso..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-[#3a3b3c] bg-white dark:bg-[#3a3b3c] text-neutral-900 dark:text-[#e4e6ea] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map(course => (
                  <button
                    key={course}
                    type="button"
                    onClick={() => {
                      onChange(course)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors ${
                      value === course ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-900 dark:text-[#e4e6ea]'
                    }`}
                  >
                    {course}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                  Nenhum curso encontrado
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  )
}
```

---

## Frontend - Atualizar UniversitySelect

```jsx
// acadlink/src/components/ui/UniversitySelect.jsx

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { UNIVERSITIES } from '../../data/mock'

export default function UniversitySelect({ value, onChange, error, status, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState(UNIVERSITIES)
  const containerRef = useRef(null)

  useEffect(() => {
    const filtered = UNIVERSITIES.filter(u =>
      u.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(filtered)
  }, [search])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusColor = () => {
    if (status === 'valid') return 'border-green-500'
    if (status === 'invalid') return 'border-red-500'
    if (status === 'warning') return 'border-yellow-500'
    return 'border-neutral-200 dark:border-[#3a3b3c]'
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-sm font-medium text-neutral-700 dark:text-[#e4e6ea]">
        Universidade
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full rounded-xl border ${getStatusColor()} bg-white dark:bg-[#3a3b3c] text-neutral-900 dark:text-[#e4e6ea] px-4 py-2.5 flex items-center justify-between transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
        >
          <span className={value ? 'text-neutral-900 dark:text-[#e4e6ea]' : 'text-neutral-400'}>
            {value || 'Selecciona a universidade'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#242526] border border-neutral-200 dark:border-[#3a3b3c] rounded-xl shadow-lg z-50">
            {/* Search */}
            <div className="p-3 border-b border-neutral-200 dark:border-[#3a3b3c]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Busca universidade..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-[#3a3b3c] bg-white dark:bg-[#3a3b3c] text-neutral-900 dark:text-[#e4e6ea] placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map(uni => (
                  <button
                    key={uni}
                    type="button"
                    onClick={() => {
                      onChange(uni)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-[#3a3b3c] transition-colors ${
                      value === uni ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' : 'text-neutral-900 dark:text-[#e4e6ea]'
                    }`}
                  >
                    {uni}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                  Nenhuma universidade encontrada
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  )
}
```

---

## Fluxo Simples

```
1. Usuário seleciona universidade
2. Sistema carrega cursos dessa universidade
3. Usuário seleciona curso (só pode escolher cursos válidos)
4. Ao registrar, backend valida:
   - Curso existe na universidade? ✓
5. Pronto. Sem complicações.
```

---

## Implementação

1. Adicionar campo `courses` ao modelo `University`
2. Popular banco de dados com universidades e cursos
3. Atualizar serializer para validar curso
4. Atualizar `CourseSelect` para carregar cursos da universidade
5. Pronto!

