# Configuração de CORS - Segurança

## ⚠️ IMPORTANTE

**NUNCA** use `CORS_ALLOWED_ORIGINS = '*'` em produção!  
Isso permite requisições de QUALQUER domínio e abre a aplicação para CSRF attacks.

---

## Configuração por Ambiente

### 🟢 Desenvolvimento (localhost)

`.env`:
```env
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000
```

### 🔵 Produção (Seus Domínios)

`.env`:
```env
DEBUG=False
CORS_ALLOWED_ORIGINS=https://acadlink.vercel.app,https://www.acadlink.com
CSRF_TRUSTED_ORIGINS=https://acadlink.vercel.app,https://www.acadlink.com
```

**Substitua pelos SEUS domínios!**

---

## Como Funciona

### CORS (GET, HEAD, OPTIONS)
- ✅ Permite GET de qualquer domínio em `CORS_ALLOWED_ORIGINS`
- ✅ Exemplo: `fetch('https://api.acadlink.com/reels')`

### CSRF (POST, PUT, DELETE, PATCH)
- ✅ Permite apenas de domínios em `CSRF_TRUSTED_ORIGINS`
- ✅ Requer CSRF token ou será rejeitado
- ✅ Protege contra ataques maliciosos

---

## Exemplo: Bloquear Ataque CSRF

### ❌ Sem CSRF_TRUSTED_ORIGINS (Vulnerável):
```html
<!-- site-malicioso.com/attack.html -->
<form action="https://api.acadlink.com/reels/" method="POST">
  <input name="title" value="Reel malicioso">
  <input name="description" value="Spam">
  <button>Clique aqui</button>
</form>
<!-- Se usuário clicar, POST é enviado de site-malicioso.com -->
<!-- SEM CSRF_TRUSTED_ORIGINS, seria aceito! 😱 -->
```

### ✅ Com CSRF_TRUSTED_ORIGINS (Protegido):
```
Site-malicioso.com não está em CSRF_TRUSTED_ORIGINS
↓
Django rejeita o POST com erro 403 Forbidden
```

---

## Teste de Configuração

### 1. Verificar CORS

```bash
# GET - Deve funcionar
curl -i http://localhost:8000/api/users/

# GET com CORS header
curl -i -H "Origin: http://localhost:3000" http://localhost:8000/api/users/
```

### 2. Verificar CSRF

```bash
# POST sem CSRF token - Deve falhar (403)
curl -i -X POST http://localhost:8000/api/reels/ \
  -H "Content-Type: application/json" \
  -d '{"title": "test"}'

# Resposta esperada:
# "CSRF verification failed. Request aborted."
```

---

## Domínios por Caso de Uso

### Frontend em Vercel + Backend em Django
```env
CORS_ALLOWED_ORIGINS=https://seu-projeto.vercel.app
CSRF_TRUSTED_ORIGINS=https://seu-projeto.vercel.app
```

### Frontend Local + Backend em Server
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend em múltiplos domínios
```env
CORS_ALLOWED_ORIGINS=https://app.acadlink.com,https://www.acadlink.com,https://api.acadlink.com
CSRF_TRUSTED_ORIGINS=https://app.acadlink.com,https://www.acadlink.com,https://api.acadlink.com
```

---

## Headers de Segurança Configurados

| Header | Valor | Razão |
|--------|-------|-------|
| Access-Control-Allow-Origin | Whitelist | Apenas domínios confiáveis |
| Access-Control-Allow-Credentials | True | Permite cookies com auth |
| Access-Control-Allow-Methods | GET, POST, PUT, DELETE | Métodos HTTP |
| Access-Control-Allow-Headers | Content-Type, Authorization | Headers requisitados |

---

## Roteiro de Deploy

1. **Local**: `http://localhost:3000`
2. **Staging**: `https://staging.acadlink.com`
3. **Produção**: `https://acadlink.com,https://www.acadlink.com`

Sempre atualizar `.env` para cada ambiente!

---

## Checklist

- [ ] CORS_ALLOWED_ORIGINS configurado (sem *)
- [ ] CSRF_TRUSTED_ORIGINS configurado (sem *)
- [ ] DEBUG = False em produção
- [ ] HTTPS habilitado em produção
- [ ] Cookies Secure=True em produção
- [ ] Testado GET/POST/PUT/DELETE
- [ ] Testado de domínio não-autorizado (deve falhar)
