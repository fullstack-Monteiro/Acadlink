# 📊 Estrutura Completa do Banco de Dados - AcadLink

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Entidades Principais](#entidades-principais)
3. [Esquema Detalhado](#esquema-detalhado)
4. [Relacionamentos](#relacionamentos)
5. [Tipos de Dados](#tipos-de-dados)
6. [Índices e Performance](#índices-e-performance)
7. [Diagrama ER](#diagrama-er)
8. [Queries Úteis](#queries-úteis)

---

## 🎯 Visão Geral

O AcadLink é um sistema acadêmico completo que gerencia:
- **Usuários**: Alunos, Professores, Administradores
- **Instituições**: Universidades e Faculdades
- **Acadêmico**: Cursos, Disciplinas, Turmas, Matriculas
- **Avaliação**: Notas, Frequência, Boletins
- **Comunicação**: Mensagens, Notificações
- **Conteúdo**: Materiais, Recursos, Reels

---

## 👥 Entidades Principais

```
┌─────────────────────────────────────────────┐
│        User (Usuários do Sistema)           │
├─────────────────────────────────────────────┤
│ ID | Email | Senha | Nome | Avatar | Role  │
└─────────────────────────────────────────────┘
      ↓                ↓              ↓
  ┌────────┐    ┌──────────┐   ┌──────────┐
  │Student │    │ Professor│   │  Admin   │
  └────────┘    └──────────┘   └──────────┘
```

---

## 📐 Esquema Detalhado

### 1. **USERS (Usuários)**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(20) NOT NULL, -- 'student', 'professor', 'admin', 'director'
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20), -- 'M', 'F', 'Other'
    cpf VARCHAR(14) UNIQUE, -- CPF do Brasil
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP -- soft delete
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_is_active ON users(is_active);
```

---

### 2. **UNIVERSITIES (Universidades/Instituições)**

```sql
CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(50),
    description TEXT,
    logo_url VARCHAR(500),
    website VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    -- Localização
    street VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL, -- UF
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'Brasil',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    -- Informações administrativas
    cnpj VARCHAR(18) UNIQUE,
    established_year INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_universities_name ON universities(name);
CREATE INDEX idx_universities_city ON universities(city);
CREATE INDEX idx_universities_state ON universities(state);
```

---

### 3. **DEPARTMENTS (Departamentos)**

```sql
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    university_id INTEGER NOT NULL REFERENCES universities(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    head_professor_id INTEGER REFERENCES users(id),
    phone VARCHAR(20),
    email VARCHAR(255),
    building VARCHAR(100),
    room VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(university_id, name)
);

CREATE INDEX idx_departments_university ON departments(university_id);
CREATE INDEX idx_departments_head ON departments(head_professor_id);
```

---

### 4. **PROGRAMS (Programas/Cursos)**

```sql
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(id),
    university_id INTEGER NOT NULL REFERENCES universities(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE,
    description TEXT,
    degree_type VARCHAR(50), -- 'Bacharelado', 'Licenciatura', 'Tecnólogo', 'Mestrado', 'Doutorado'
    duration_semesters INTEGER,
    credits_required INTEGER,
    coordinator_id INTEGER REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_programs_department ON programs(department_id);
CREATE INDEX idx_programs_university ON programs(university_id);
CREATE INDEX idx_programs_code ON programs(code);
```

---

### 5. **SUBJECTS (Disciplinas/Matérias)**

```sql
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES programs(id),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    workload_hours INTEGER NOT NULL,
    semester INTEGER, -- 1º, 2º, 3º semestre
    prerequisites TEXT, -- JSON com IDs de pré-requisitos
    is_mandatory BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_program ON subjects(program_id);
CREATE INDEX idx_subjects_code ON subjects(code);
CREATE INDEX idx_subjects_semester ON subjects(semester);
```

---

### 6. **CLASSES (Turmas/Seções)**

```sql
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    section VARCHAR(10) NOT NULL, -- 'A', 'B', 'C', etc.
    professor_id INTEGER NOT NULL REFERENCES users(id),
    university_id INTEGER NOT NULL REFERENCES universities(id),
    -- Período letivo
    semester INTEGER NOT NULL, -- 2024.1
    year INTEGER NOT NULL,
    -- Horários
    day_of_week VARCHAR(20) NOT NULL, -- 'Monday', 'Tuesday', etc.
    start_time TIME,
    end_time TIME,
    room VARCHAR(50),
    building VARCHAR(100),
    -- Limite de vagas
    max_students INTEGER DEFAULT 60,
    current_enrollment INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, section, semester, year)
);

CREATE INDEX idx_classes_subject ON classes(subject_id);
CREATE INDEX idx_classes_professor ON classes(professor_id);
CREATE INDEX idx_classes_semester_year ON classes(semester, year);
CREATE INDEX idx_classes_university ON classes(university_id);
```

---

### 7. **ENROLLMENTS (Matrículas)**

```sql
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    program_id INTEGER NOT NULL REFERENCES programs(id),
    university_id INTEGER NOT NULL REFERENCES universities(id),
    -- Situação
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'dropped', 'suspended', 'completed'
    enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completion_date DATE,
    -- Avaliação
    final_grade DECIMAL(5,2),
    gpa DECIMAL(5,2),
    attendance_percentage DECIMAL(5,2),
    -- Custos
    tuition_paid BOOLEAN DEFAULT FALSE,
    amount_paid DECIMAL(10,2),
    -- Anotações
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, class_id)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_program ON enrollments(program_id);
CREATE INDEX idx_enrollments_university ON enrollments(university_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

---

### 8. **GRADES (Notas)**

```sql
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES enrollments(id),
    assessment_id INTEGER REFERENCES assessments(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    -- Nota
    grade DECIMAL(5,2),
    weight DECIMAL(5,2) DEFAULT 1.0, -- Peso da avaliação
    grade_type VARCHAR(20), -- 'exam', 'project', 'participation', 'homework'
    -- Timestamps
    recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    feedback TEXT,
    is_final BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grades_enrollment ON grades(enrollment_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_class ON grades(class_id);
CREATE INDEX idx_grades_assessment ON grades(assessment_id);
```

---

### 9. **ASSESSMENTS (Avaliações)**

```sql
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(50), -- 'exam', 'project', 'quiz', 'homework'
    weight DECIMAL(5,2), -- Peso na nota final (0-1)
    max_score DECIMAL(5,2) DEFAULT 100,
    due_date TIMESTAMP,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    allow_late_submission BOOLEAN DEFAULT FALSE,
    late_days_allowed INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_class ON assessments(class_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_due_date ON assessments(due_date);
```

---

### 10. **ATTENDANCE (Frequência)**

```sql
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER NOT NULL REFERENCES enrollments(id),
    class_id INTEGER NOT NULL REFERENCES classes(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    attendance_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'present', -- 'present', 'absent', 'late', 'justified'
    justification TEXT,
    recorded_by INTEGER REFERENCES users(id), -- Professor que registrou
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, attendance_date)
);

CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);
```

---

### 11. **MATERIALS (Materiais de Aula)**

```sql
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    uploaded_by INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    file_type VARCHAR(50), -- 'pdf', 'doc', 'video', 'image', 'other'
    file_size INTEGER, -- em bytes
    file_path VARCHAR(500),
    material_type VARCHAR(50), -- 'lecture', 'reading', 'exercise', 'solution'
    week NUMBER,
    is_published BOOLEAN DEFAULT TRUE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_materials_class ON materials(class_id);
CREATE INDEX idx_materials_uploaded_by ON materials(uploaded_by);
CREATE INDEX idx_materials_type ON materials(material_type);
```

---

### 12. **REELS (Vídeo-Aulas / Shorts)**

```sql
CREATE TABLE reels (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    subject_id INTEGER REFERENCES subjects(id),
    uploaded_by INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration_seconds INTEGER,
    video_key VARCHAR(100), -- ID do Vimeo/YouTube
    platform VARCHAR(50), -- 'vimeo', 'youtube', 's3', 'cloudinary'
    -- Metadados
    tags TEXT, -- JSON array
    category VARCHAR(100),
    topic VARCHAR(100),
    difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    -- Engajamento
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    -- Configurações
    is_published BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    requires_authentication BOOLEAN DEFAULT TRUE,
    -- Timestamps
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reels_class ON reels(class_id);
CREATE INDEX idx_reels_subject ON reels(subject_id);
CREATE INDEX idx_reels_uploaded_by ON reels(uploaded_by);
CREATE INDEX idx_reels_category ON reels(category);
CREATE INDEX idx_reels_published ON reels(is_published);
CREATE INDEX idx_reels_views ON reels(views_count);
```

---

### 13. **COMMENTS (Comentários em Reels)**

```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    reel_id INTEGER NOT NULL REFERENCES reels(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    parent_comment_id INTEGER REFERENCES comments(id), -- Para respostas
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_reel ON comments(reel_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
```

---

### 14. **MESSAGES (Mensagens/Chat)**

```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id), -- Nulo se for grupo
    class_id INTEGER REFERENCES classes(id), -- Para chat da turma
    group_chat_id INTEGER REFERENCES group_chats(id),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'file', 'video'
    attachment_url VARCHAR(500),
    attachment_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    edited_at TIMESTAMP,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_class ON messages(class_id);
CREATE INDEX idx_messages_group ON messages(group_chat_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
```

---

### 15. **GROUP_CHATS (Grupos de Chat)**

```sql
CREATE TABLE group_chats (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    avatar_url VARCHAR(500),
    created_by INTEGER NOT NULL REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    member_count INTEGER DEFAULT 0,
    last_message_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_group_chats_class ON group_chats(class_id);
```

---

### 16. **GROUP_MEMBERS (Membros do Grupo)**

```sql
CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_chat_id INTEGER NOT NULL REFERENCES group_chats(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    role VARCHAR(20) DEFAULT 'member', -- 'admin', 'moderator', 'member'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_chat_id, user_id)
);

CREATE INDEX idx_group_members_group ON group_members(group_chat_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);
```

---

### 17. **NOTIFICATIONS (Notificações)**

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    notification_type VARCHAR(50), -- 'grade_posted', 'assignment_due', 'message', 'announcement'
    title VARCHAR(255),
    message TEXT,
    reference_id INTEGER, -- ID do objeto relacionado
    reference_type VARCHAR(50), -- 'grade', 'assignment', 'message', 'announcement'
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
```

---

### 18. **ANNOUNCEMENTS (Avisos/Comunicados)**

```sql
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id),
    university_id INTEGER REFERENCES universities(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    is_pinned BOOLEAN DEFAULT FALSE,
    published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiration_date TIMESTAMP,
    visibility VARCHAR(50) DEFAULT 'all', -- 'all', 'students', 'professors'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_announcements_class ON announcements(class_id);
CREATE INDEX idx_announcements_university ON announcements(university_id);
CREATE INDEX idx_announcements_priority ON announcements(priority);
```

---

### 19. **ASSIGNMENTS (Tarefas/Trabalhos)**

```sql
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id),
    created_by INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP NOT NULL,
    max_score DECIMAL(5,2) DEFAULT 100,
    allow_late_submission BOOLEAN DEFAULT TRUE,
    grading_rubric TEXT, -- JSON com critérios
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
```

---

### 20. **SUBMISSIONS (Entregas de Tarefas)**

```sql
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id),
    student_id INTEGER NOT NULL REFERENCES users(id),
    submission_file_url VARCHAR(500),
    submission_text TEXT,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_late BOOLEAN DEFAULT FALSE,
    grade DECIMAL(5,2),
    feedback TEXT,
    feedback_date TIMESTAMP,
    graded_by INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'submitted', -- 'draft', 'submitted', 'graded', 'returned'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
```

---

### 21. **USER_PROFILES (Perfis/Perfil Estendido)**

```sql
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
    bio TEXT,
    avatar_url VARCHAR(500),
    banner_url VARCHAR(500),
    website VARCHAR(255),
    location VARCHAR(255),
    -- Redes sociais
    social_links JSONB, -- {'github': '...', 'linkedin': '...'}
    -- Preferências
    notification_preferences JSONB,
    language VARCHAR(20) DEFAULT 'pt-BR',
    theme VARCHAR(20) DEFAULT 'light',
    privacy_level VARCHAR(20) DEFAULT 'public', -- 'public', 'friends', 'private'
    -- Estatísticas
    total_courses INTEGER DEFAULT 0,
    completed_courses INTEGER DEFAULT 0,
    current_gpa DECIMAL(5,2),
    total_comments INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    -- Timestamps
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
```

---

### 22. **STUDENT_DOCUMENTS (Documentos do Aluno)**

```sql
CREATE TABLE student_documents (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    document_type VARCHAR(50), -- 'transcript', 'certificate', 'id', 'passport'
    file_url VARCHAR(500),
    file_path VARCHAR(500),
    issue_date DATE,
    expiration_date DATE,
    verified BOOLEAN DEFAULT FALSE,
    verified_by INTEGER REFERENCES users(id),
    verified_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_student_documents_student ON student_documents(student_id);
```

---

### 23. **PAYMENT_RECORDS (Registros de Pagamento)**

```sql
CREATE TABLE payment_records (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    enrollment_id INTEGER REFERENCES enrollments(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- 'credit_card', 'banco_slip', 'pix', 'transfer'
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    transaction_id VARCHAR(255),
    invoice_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_records_student ON payment_records(student_id);
CREATE INDEX idx_payment_records_status ON payment_records(status);
CREATE INDEX idx_payment_records_date ON payment_records(payment_date);
```

---

### 24. **AUDIT_LOGS (Logs de Auditoria)**

```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100), -- 'User', 'Class', 'Grade', etc.
    entity_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'success', -- 'success', 'error'
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

---

### 25. **SETTINGS (Configurações do Sistema)**

```sql
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    value_type VARCHAR(50), -- 'string', 'integer', 'boolean', 'json'
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);
```

---

### 26. **SCHEDULE (Cronograma Acadêmico)**

```sql
CREATE TABLE academic_calendar (
    id SERIAL PRIMARY KEY,
    university_id INTEGER NOT NULL REFERENCES universities(id),
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL, -- 1 ou 2
    -- Datas importantes
    semester_start DATE NOT NULL,
    semester_end DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    add_drop_deadline DATE,
    withdrawal_deadline DATE,
    exam_start DATE,
    exam_end DATE,
    grades_due DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(university_id, year, semester)
);

CREATE INDEX idx_academic_calendar_university ON academic_calendar(university_id);
CREATE INDEX idx_academic_calendar_year_semester ON academic_calendar(year, semester);
```

---

## 🔗 Relacionamentos

### Diagrama de Relacionamentos Principais:

```
UNIVERSITIES
    ├── DEPARTMENTS
    │   └── PROGRAMS
    │       ├── SUBJECTS
    │       │   └── CLASSES
    │       │       ├── ENROLLMENTS
    │       │       │   ├── GRADES
    │       │       │   ├── ATTENDANCE
    │       │       │   └── SUBMISSIONS
    │       │       ├── ASSESSMENTS
    │       │       ├── MATERIALS
    │       │       ├── ASSIGNMENTS
    │       │       ├── ANNOUNCEMENTS
    │       │       └── MESSAGES
    │       └── REELS
    ├── ACADEMIC_CALENDAR
    └── USERS (multiple roles)

USERS
├── USER_PROFILES
├── STUDENT_DOCUMENTS
├── PAYMENT_RECORDS
├── MESSAGES
├── NOTIFICATIONS
├── AUDIT_LOGS
└── GROUP_CHATS
    └── GROUP_MEMBERS

REELS
├── COMMENTS
└── VIEWS (via audit)

COMMENTS
└── REEL_LIKES (via junction)
```

---

## 📊 Tipos de Dados

| Tipo | Descrição | Uso |
|------|-----------|-----|
| `SERIAL` | Auto-incremento | IDs primárias |
| `VARCHAR(n)` | String até n caracteres | Textos curtos |
| `TEXT` | String ilimitada | Descrições, conteúdo |
| `INTEGER` | Número inteiro | Contadores, códigos |
| `DECIMAL(p,s)` | Número decimal preciso | Notas, valores monetários |
| `DATE` | Data (YYYY-MM-DD) | Datas sem hora |
| `TIMESTAMP` | Data e hora | Logs, criação/atualização |
| `TIME` | Hora (HH:MM:SS) | Horários de aula |
| `BOOLEAN` | Verdadeiro/Falso | Flags, status binários |
| `JSONB` | JSON Binary (PostgreSQL) | Dados semi-estruturados |

---

## 🚀 Índices e Performance

### Índices Recomendados:

```sql
-- Buscas frequentes por usuário
CREATE INDEX idx_users_email_active ON users(email, is_active);

-- Consultas de matrículas por aluno
CREATE INDEX idx_enrollments_student_status ON enrollments(student_id, status);

-- Notas de uma turma
CREATE INDEX idx_grades_class_final ON grades(class_id, is_final);

-- Mensagens não lidas
CREATE INDEX idx_messages_recipient_unread ON messages(recipient_id, is_read);

-- Reels populares
CREATE INDEX idx_reels_published_views ON reels(is_published, views_count DESC);

-- Frequência de uma aula
CREATE INDEX idx_attendance_class_date ON attendance(class_id, attendance_date);

-- Tarefas pendentes
CREATE INDEX idx_assignments_class_published ON assignments(class_id, is_published, due_date);

-- Auditar ações recentes
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(created_at DESC);
```

---

## 📈 Diagrama ER

```
┌─────────────────────────┐
│        USERS            │
├─────────────────────────┤
│ id (PK)                 │
│ email                   │
│ password_hash           │
│ first_name              │
│ last_name               │
│ role                    │
│ avatar_url              │
│ cpf                     │
│ is_active               │
│ created_at              │
└────────────┬────────────┘
             │ 1
             │
         └───┴──────────────────────────────┐
                                           │ *
                                    ┌──────────────────┐
                                    │   ENROLLMENTS    │
                                    ├──────────────────┤
                                    │ id (PK)          │
                                    │ student_id (FK)  │
                                    │ class_id (FK)    │
                                    │ final_grade      │
                                    │ status           │
                                    │ enrollment_date  │
                                    └──────────────────┘
```

---

## 🔍 Queries Úteis

### 1. **Total de Alunos Matriculados por Turma**
```sql
SELECT c.id, s.name as subject, c.section, COUNT(e.id) as total_students
FROM classes c
JOIN subjects s ON c.subject_id = s.id
LEFT JOIN enrollments e ON c.id = e.class_id AND e.status = 'active'
GROUP BY c.id, s.name, c.section
ORDER BY total_students DESC;
```

### 2. **Média de Notas de um Aluno**
```sql
SELECT 
    u.first_name,
    u.last_name,
    AVG(g.grade) as average_grade,
    COUNT(g.id) as total_grades
FROM users u
JOIN enrollments e ON u.id = e.student_id
JOIN grades g ON e.id = g.enrollment_id
WHERE u.id = $1
GROUP BY u.id, u.first_name, u.last_name;
```

### 3. **Frequência de um Aluno**
```sql
SELECT 
    (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*))::DECIMAL(5,2) as attendance_percentage
FROM attendance
WHERE student_id = $1 AND enrollment_id = $2;
```

### 4. **Reels Mais Assistidos da Semana**
```sql
SELECT id, title, views_count, likes_count
FROM reels
WHERE published_date >= CURRENT_DATE - INTERVAL '7 days'
AND is_published = TRUE
ORDER BY views_count DESC
LIMIT 10;
```

### 5. **Tarefas Pendentes de Correção**
```sql
SELECT a.title, COUNT(s.id) as pending_submissions
FROM assignments a
LEFT JOIN submissions s ON a.id = s.assignment_id
  AND (s.grade IS NULL OR s.status IN ('submitted', 'draft'))
GROUP BY a.id, a.title
ORDER BY pending_submissions DESC;
```

### 6. **Alunos com Baixo Desempenho**
```sql
SELECT 
    u.first_name,
    u.last_name,
    AVG(g.grade) as average_grade
FROM users u
JOIN enrollments e ON u.id = e.student_id
JOIN grades g ON e.id = g.enrollment_id
GROUP BY u.id, u.first_name, u.last_name
HAVING AVG(g.grade) < 6.0
ORDER BY average_grade ASC;
```

### 7. **Notificações Não Lidas por Usuário**
```sql
SELECT 
    user_id,
    notification_type,
    COUNT(*) as count
FROM notifications
WHERE is_read = FALSE
GROUP BY user_id, notification_type
ORDER BY user_id;
```

### 8. **Análise de Engajamento em Reels**
```sql
SELECT 
    id,
    title,
    views_count,
    likes_count,
    comments_count,
    ROUND((likes_count::NUMERIC / NULLIF(views_count, 0) * 100), 2) as engagement_rate
FROM reels
WHERE is_published = TRUE
ORDER BY engagement_rate DESC
LIMIT 20;
```

---

## 📋 Checklist de Implementação

- [ ] Criar tabela USERS
- [ ] Criar tabela UNIVERSITIES
- [ ] Criar tabela DEPARTMENTS
- [ ] Criar tabela PROGRAMS
- [ ] Criar tabela SUBJECTS
- [ ] Criar tabela CLASSES
- [ ] Criar tabela ENROLLMENTS
- [ ] Criar tabela GRADES
- [ ] Criar tabela ASSESSMENTS
- [ ] Criar tabela ATTENDANCE
- [ ] Criar tabela MATERIALS
- [ ] Criar tabela REELS
- [ ] Criar tabela COMMENTS
- [ ] Criar tabela MESSAGES
- [ ] Criar tabela GROUP_CHATS
- [ ] Criar tabela GROUP_MEMBERS
- [ ] Criar tabela NOTIFICATIONS
- [ ] Criar tabela ANNOUNCEMENTS
- [ ] Criar tabela ASSIGNMENTS
- [ ] Criar tabela SUBMISSIONS
- [ ] Criar tabela USER_PROFILES
- [ ] Criar tabela STUDENT_DOCUMENTS
- [ ] Criar tabela PAYMENT_RECORDS
- [ ] Criar tabela AUDIT_LOGS
- [ ] Criar tabela SETTINGS
- [ ] Criar tabela ACADEMIC_CALENDAR
- [ ] Criar índices recomendados
- [ ] Validar relacionamentos foreign keys
- [ ] Testar constraints

---

## 🔐 Considerações de Segurança

1. **Senhas**: Usar bcrypt ou Argon2 (Django faz isso automaticamente)
2. **Dados sensíveis**: Criptografar CPF, documentos
3. **Auditoria**: Todas as mudanças devem ser registradas
4. **Soft Delete**: Usar `deleted_at` para manter histórico
5. **GDPR/LGPD**: Implementar direito ao esquecimento
6. **Validação**: Usar constraints no banco de dados
7. **Backup**: Realizar backups regulares

---

## 📱 Campos Recomendados para Frontend

- **Perfil do Usuário**: Nome, Avatar, Bio, Email, Telefone
- **Dashboard do Aluno**: GPA, Próximas avaliações, Frequência, Mensagens não lidas
- **Turmas**: Lista de disciplinas, Horários, Professor, Material recente
- **Reels**: Título, Thumbnail, Duração, Views, Likes, Data
- **Notas**: Disciplina, Nota, Peso, Feedback
- **Tarefas**: Título, Data de entrega, Status, Nota

---

**Última atualização:** 1 de julho de 2026
**Status:** ✅ Completo e Pronto para Implementação
