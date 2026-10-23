# 🎯 PRIORIDADES DE IMPLEMENTAÇÃO DE APIs

## 📊 STATUS GERAL
- **Endpoints Implementados**: ~45/91 (50%)
- **Endpoints Faltando**: ~46/91 (50%)

---

## 🔴 FASE 1: CRÍTICO (MVP - Semanas 1-2)

### ✅ JÁ IMPLEMENTADO
1. **Autenticação** (5/5 endpoints)
   - Login
   - Register
   - Forgot Password
   - Reset Password
   - Token Refresh

2. **Utilizadores** (5/7 endpoints)
   - Get Me
   - Get Public Profile
   - Update Profile
   - Change Password
   - List Universities

3. **Posts** (11/14 endpoints)
   - CRUD Posts
   - Like/Unlike
   - Save/Unsave
   - Comments
   - Feed

4. **Reels** (13/15 endpoints)
   - Upload
   - CRUD
   - Like/Unlike/Save
   - Comments
   - View Tracking
   - Categories

### 🔴 PRECISA IMPLEMENTAR URGENTE

1. **Mensagens (Básico)**
   ```
   Priority: CRÍTICO
   Endpoints: 5/12
   
   [ ] Listar conversas com unread count
   [ ] Obter conversa com mensagens (paginadas)
   [ ] Enviar mensagem
   [ ] Criar conversa direct
   [ ] Marcar como lida
   
   Estimativa: 3-4 horas
   ```

2. **Notificações (Básico)**
   ```
   Priority: CRÍTICO
   Endpoints: 2/7
   
   [ ] Listar notificações (paginadas)
   [ ] Unread count
   [ ] Marcar como lida
   [ ] Marcar tudo como lido
   [ ] Preferências básicas
   
   Estimativa: 2-3 horas
   ```

3. **Conexões (Básico)**
   ```
   Priority: CRÍTICO
   Endpoints: 3/9
   
   [ ] Conectar com utilizador
   [ ] Aceitar/Rejeitar conexão
   [ ] Listar conexões
   [ ] Sugestões básicas
   
   Estimativa: 2-3 horas
   ```

4. **Verificação Email/Universidade**
   ```
   Priority: ALTO
   Endpoints: 0/2
   
   [ ] POST /api/users/verify_email/
   [ ] POST /api/users/verify_university/
   
   Estimativa: 2 horas
   ```

---

## 🟡 FASE 2: IMPORTANTE (Semanas 3-4)

### 1. Pesquisa & Descoberta (6 endpoints)
```
Priority: ALTO
Status: 0% Implementado

[ ] GET /api/search/users/ - Pesquisar utilizadores
    - Filtros: universidade, curso, nome
    - Resultado: lista com conexão status
    - Estimativa: 2 horas

[ ] GET /api/search/posts/ - Pesquisar posts
    - Filtros: categoria, autor, data
    - Full-text search
    - Estimativa: 2 horas

[ ] GET /api/search/reels/ - Pesquisar reels
    - Filtros: categoria, hashtags, autor
    - Estimativa: 1.5 horas

[ ] GET /api/search/trending_tags/ - Trending hashtags
    - Top 20 tags com contagem
    - Estimativa: 1 hora

[ ] GET /api/search/global/ - Pesquisa global
    - Combina todos os tipos
    - Estimativa: 1 hora

[ ] GET /api/search/suggestions/ - Auto-complete
    - Sugestões em tempo real
    - Estimativa: 1 hora

Total: 8.5 horas
```

### 2. Moderação & Segurança (5 endpoints)
```
Priority: ALTO
Status: 0% Implementado

[ ] POST /api/moderation/reports/posts/ - Denunciar post
[ ] POST /api/moderation/reports/users/ - Denunciar utilizador
[ ] POST /api/moderation/reports/comments/ - Denunciar comentário
[ ] GET /api/moderation/reports/ - Listar (Admin)
[ ] PUT /api/moderation/reports/{id}/review/ - Revisar (Admin)

Total: 4-5 horas
```

### 3. Melhorias em Mensagens (7 endpoints adicionais)
```
Priority: MÉDIO
Status: 40% Implementado

[ ] POST /api/messages/groups/create/ - Criar grupo
[ ] POST /api/messages/{id}/add_member/ - Adicionar membro
[ ] POST /api/messages/{id}/leave/ - Sair de grupo
[ ] DELETE /api/messages/{id}/ - Deletar mensagem
[ ] POST /api/messages/{id}/react/ - Reação a mensagem
[ ] PUT /api/messages/{id}/read/ - Marcar como lida
[ ] PUT /api/messages/{conversation_id}/mark_as_read/ - Marcar conversa como lida

Total: 3-4 horas
```

---

## 🟠 FASE 3: OTIMIZAÇÕES (Semanas 5-6)

### 1. Analytics & Relatórios (4 endpoints)
```
Priority: MÉDIO
Status: 0% Implementado

[ ] GET /api/analytics/profile/{user_id}/ - Stats do perfil
[ ] GET /api/analytics/posts/{post_id}/ - Stats do post
[ ] GET /api/analytics/reels/{reel_id}/ - Stats do reel
[ ] GET /api/analytics/creator/ - Dashboard criador

Total: 4-5 horas
```

### 2. Media & Upload Robusto (4 endpoints)
```
Priority: MÉDIO
Status: 30% Implementado

[ ] POST /api/media/upload/image/ - Upload com validação
    - Redimensionar
    - Múltiplos tamanhos
    - Otimizar
    - Estimativa: 2 horas

[ ] POST /api/media/upload/video/ - Upload de vídeo
    - Processar asynchronously
    - Gerar thumbnail
    - Múltiplos bitrates
    - Estimativa: 3 horas

[ ] POST /api/media/upload/file/ - Upload ficheiro
[ ] DELETE /api/media/{id}/ - Deletar media

Total: 6-7 horas
```

### 3. Features Sociais Avançadas
```
Priority: MÉDIO

[ ] Mencionar utilizadores (@user)
    - Autocomplete
    - Notificação
    - Estimativa: 2 horas

[ ] Hashtags
    - Parsing automático
    - Linking
    - Trending
    - Estimativa: 2 horas

[ ] Reels com hashtags
    - Filtrar por hashtag
    - Trending por hashtag
    - Estimativa: 1 hora

Total: 5 horas
```

---

## 🟢 FASE 4: BONUS (Semanas 7+)

### 1. Real-time (WebSocket)
```
Priority: BAIXO (Nice to have)
Status: 0%

[ ] Mensagens em tempo real
[ ] Online status
[ ] Typing indicator
[ ] Notificações push

Total: 8-10 horas
```

### 2. Filas & Background Tasks
```
Priority: BAIXO

[ ] Celery para:
    - Processamento de vídeo
    - Envio de emails
    - Notificações
    - Analytics

Total: 5-6 horas
```

---

## 📋 SEQUÊNCIA RECOMENDADA

### Semana 1
```
1. Mensagens (5 endpoints básicos) - 4h
2. Notificações (5 endpoints básicos) - 3h
3. Conexões (4 endpoints básicos) - 3h
4. Verificação Email/Universidade - 2h
Total: 12 horas
```

### Semana 2
```
1. Pesquisa Global (6 endpoints) - 8.5h
2. Moderação Básica (3 endpoints) - 2h
3. Testes & Correções - 3h
Total: 13.5 horas
```

### Semana 3
```
1. Mensagens Avançado (7 endpoints) - 4h
2. Media Robusto - 7h
3. Testes - 2h
Total: 13 horas
```

### Semana 4
```
1. Analytics (4 endpoints) - 5h
2. Features Sociais (hashtags, mentions) - 5h
3. Melhorias Geral - 3h
Total: 13 horas
```

---

## 🔧 CHECKLIST DE IMPLEMENTAÇÃO

### Para cada endpoint, considerar:

- [ ] Serializer completo (request/response)
- [ ] Validações robustas
- [ ] Permissões corretas
- [ ] Error handling
- [ ] Pagination (se aplicável)
- [ ] Filtering/Ordering
- [ ] Tests unitários
- [ ] Documentação
- [ ] Rate limiting
- [ ] Logging

---

## 📈 ESTIMATIVAS DE TEMPO

| Categoria | Endpoints | Horas | Semanas |
|-----------|-----------|-------|---------|
| Crítico | 15 | 15-16 | 2 |
| Importante | 18 | 16-18 | 2 |
| Otimizações | 12 | 15-17 | 2 |
| Bonus | 25+ | 20+ | 3+ |
| **Total** | **70+** | **66-71** | **4-5** |

---

## 🎯 MÉTRICAS DE SUCESSO

### MVP (Fase 1-2)
- ✅ 50+ endpoints funcionais
- ✅ Feed com posts e reels
- ✅ Mensagens diretas
- ✅ Conexões básicas
- ✅ Notificações

### Beta (Fase 3-4)
- ✅ 80+ endpoints
- ✅ Analytics
- ✅ Pesquisa avançada
- ✅ Moderação
- ✅ Upload robusto

### Produção
- ✅ 90+ endpoints
- ✅ Real-time
- ✅ Performance otimizado
- ✅ Segurança completa
- ✅ 99.9% uptime

---

## 💾 TECNOLOGIAS RECOMENDADAS

### Backend
- Django REST Framework ✅ (já em uso)
- Django Signals ✅ (notificações)
- Celery + Redis (async tasks)
- Django Channels (WebSocket)
- ElasticSearch (pesquisa full-text)

### Media
- Pillow (imagens)
- FFmpeg (vídeos)
- S3 or MinIO (storage)
- CloudFront (CDN)

### Analytics
- PostgreSQL JSON (relatórios)
- Pandas (processamento)
- Grafana (dashboards)

---

## 🔒 SEGURANÇA

Implementar em todos os endpoints:
- ✅ CSRF Protection
- ✅ Rate Limiting (django-ratelimit)
- ✅ Input Validation
- ✅ SQL Injection Prevention
- ✅ XSS Protection
- ✅ CORS Configurado
- ⚠️ 2FA (futuro)
- ⚠️ OAuth2 (futuro)

---

## 📞 SUPORTE

Manter documentação atualizada:
- OpenAPI/Swagger
- Postman Collection
- Código com exemplos
- Changelog
- Migration Guide

