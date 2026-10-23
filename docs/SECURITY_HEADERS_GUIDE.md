# Security Headers - Proteção Adicional

## O que são Security Headers?

São HTTP headers que instruem o navegador como se comportar, protegendo contra ataques comuns.

---

## Headers Implementados

### 1️⃣ X-Content-Type-Options: nosniff
**Proteção:** MIME sniffing attacks

```
Sem: Navegador pode interpretar .txt como .js ❌
Com: Navegador respeita Content-Type correto ✅
```

### 2️⃣ X-Frame-Options: DENY
**Proteção:** Clickjacking

```
Sem: Site malicioso pode encapsular seu site em <iframe> ❌
Com: Seu site nunca pode ser embarcado em iframe ✅
```

### 3️⃣ X-XSS-Protection: 1; mode=block
**Proteção:** XSS (Cross-Site Scripting)

```
Sem: Navegador pode executar scripts injetados ❌
Com: Navegador bloqueia scripts detectados como XSS ✅
```

### 4️⃣ Strict-Transport-Security (HSTS)
**Proteção:** Man-in-the-Middle (MITM)

```
Sem: Usuário conecta HTTP → pode ser interceptado ❌
Com: Navegador força HTTPS sempre ✅
```

### 5️⃣ Content-Security-Policy (CSP)
**Proteção:** XSS, Injection attacks

```
Antes: <script src="https://malicioso.com/steal.js"></script> ✅ Executava
Depois: CSP bloqueia ❌
```

### 6️⃣ Referrer-Policy: strict-origin-when-cross-origin
**Proteção:** Vazamento de dados

```
Sem: URL completa é enviada em Links (pode ter tokens) ❌
Com: Apenas origem é enviada (seguro) ✅
```

### 7️⃣ Permissions-Policy
**Proteção:** Acesso a recursos do dispositivo

```
Sem: Site pode acessar câmera, microfone, geolocalização ❌
Com: Site bloqueado de acessar ✅
```

---

## Headers por Ambiente

### 🟢 Desenvolvimento

```javascript
// vite.config.js
headers: {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
}
```

### 🔵 Produção (Django)

```python
# settings/base.py
SECURE_FRAME_DENY = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True

SECURE_CONTENT_SECURITY_POLICY = {
    "default-src": ("'self'",),
    "script-src": ("'self'", "'unsafe-inline'"),
    "style-src": ("'self'", "'unsafe-inline'"),
}
```

### 🟢 Vercel (Frontend)

```json
// vercel.json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {"key": "X-Content-Type-Options", "value": "nosniff"},
      {"key": "X-Frame-Options", "value": "DENY"},
      {"key": "Strict-Transport-Security", "value": "max-age=31536000"}
    ]
  }
]
```

---

## Teste de Headers

### Local (Backend):
```bash
curl -i http://localhost:8000/api/users/
```

Procure por headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Local (Frontend):
```bash
curl -i http://localhost:3000/
```

Procure por headers do vite.

### Produção (Vercel):
```bash
curl -i https://seu-projeto.vercel.app/
```

---

## Content Security Policy (CSP) Detalhado

### O que é CSP?

Whitelist de recursos que podem ser carregados/executados.

### Exemplo: Bloquear XSS

```html
<!-- Sem CSP: Script executa ❌ -->
<img src=x onerror="alert('XSS')">

<!-- Com CSP: Script bloqueado ✅ -->
<!-- CSP: default-src 'self' -->
<!-- Resultado: Bloqueado (não está em 'self') -->
```

### Exemplo: Bloquear External Scripts

```html
<!-- Sem CSP: Script carrega ❌ -->
<script src="https://malicioso.com/steal.js"></script>

<!-- Com CSP: Script bloqueado ✅ -->
<!-- CSP: script-src 'self' -->
<!-- Resultado: Bloqueado (não está em 'self') -->
```

### CSP Directives:

| Diretiva | Controla |
|----------|----------|
| `default-src` | Padrão para todas as origens |
| `script-src` | Scripts (.js) |
| `style-src` | Estilos (.css) |
| `img-src` | Imagens |
| `font-src` | Fontes |
| `connect-src` | XMLHttpRequest, fetch, WebSocket |
| `frame-ancestors` | Pode ser embarcado em iframe? |
| `upgrade-insecure-requests` | Forçar HTTPS |

### Valores CSP:

```python
{
    "default-src": ("'self'",),  # Apenas do mesmo domínio
    "script-src": ("'self'", "cdn.example.com"),  # Domínio + CDN
    "img-src": ("'self'", "data:", "https:"),  # Domínio + Data URLs + HTTPS
    "style-src": ("'self'", "'unsafe-inline'"),  # Inline CSS (cuidado!)
}
```

---

## Melhores Práticas

✅ **Fazer:**
- Whitelist específica (não use *)
- HSTS habilitado em produção
- CSP habilitado
- X-Frame-Options: DENY
- HTTPS sempre (Strict-Transport-Security)

❌ **Evitar:**
- Usar `*` (permite tudo)
- Usar `unsafe-inline` (abre para XSS)
- Desabilitar headers em produção
- Misturar HTTP e HTTPS

---

## Monitorar Violações de CSP

### Ver erros no console:
```javascript
// Qualquer violação de CSP aparece no console
Refused to load the script 'https://malicioso.com/steal.js' 
because it violates the following Content Security Policy
```

### Logar violações no servidor:
```python
# settings.py
CSP_REPORT_URI = '/api/csp-report/'  # Endpoint para logar

# urls.py
@csrf_exempt
def csp_report(request):
    data = json.loads(request.body)
    logger.warning(f"CSP violation: {data}")
    return JsonResponse({'success': True})
```

---

## Verificar Score de Segurança

### Use estas ferramentas:

1. **Mozilla Observatory:** https://observatory.mozilla.org/
   - Scans seus headers
   - Score A+ = Excelente

2. **SSL Labs:** https://www.ssllabs.com/ssltest/
   - Verifica HTTPS/SSL
   - Score A = Bom

3. **Security Headers:** https://securityheaders.com/
   - Específico para headers
   - Score A = Excelente

---

## Checklist

- [x] X-Content-Type-Options ✅
- [x] X-Frame-Options ✅
- [x] X-XSS-Protection ✅
- [x] HSTS ✅
- [x] CSP ✅
- [x] Referrer-Policy ✅
- [x] Permissions-Policy ✅
- [ ] Testado em produção
- [ ] Score A+ em Mozilla Observatory

---

## Recursos

- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [CSP Reference](https://content-security-policy.com/)
- [HTTP Headers Security](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html)
