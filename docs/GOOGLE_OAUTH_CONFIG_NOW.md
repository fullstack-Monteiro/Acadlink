# ⚡ Configurar Google OAuth AGORA (5 minutos)

## 🚨 Status: Client ID não configurado

Você precisa obter um Client ID do Google para testar.

---

## 📝 Opção 1: Configuração Completa (Recomendado)

### Passo 1: Acessar Google Cloud Console
🔗 https://console.cloud.google.com/

### Passo 2: Criar Projeto
1. Clique no dropdown de projetos (topo esquerdo)
2. Clique em "New Project"
3. Nome: **AcadLink** (ou qualquer nome)
4. Clique "Create"
5. Aguarde 30 segundos

### Passo 3: Configurar OAuth Consent Screen
1. Menu lateral → **APIs & Services** → **OAuth consent screen**
2. Escolha **External** (para testes)
3. Clique "Create"
4. Preencha apenas os obrigatórios:
   - **App name:** AcadLink
   - **User support email:** seu_email@gmail.com
   - **Developer contact email:** seu_email@gmail.com
5. Clique "Save and Continue" (3x até o fim)

### Passo 4: Criar Credenciais
1. Menu lateral → **APIs & Services** → **Credentials**
2. Clique "**+ Create Credentials**" → "**OAuth client ID**"
3. Application type: **Web application**
4. Name: AcadLink Web Client
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:5173
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:3000
   ```
7. Clique "**Create**"

### Passo 5: Copiar Client ID
```
Vai aparecer um popup com:
Client ID: 123456789-abc123def456.apps.googleusercontent.com
                     ↑ COPIE ISSO
```

### Passo 6: Configurar no Projeto
```bash
cd frontend
```

Edite o arquivo `.env` e adicione:
```env
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

### Passo 7: Reiniciar Frontend
```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente:
npm run dev
```

---

## 🏃 Opção 2: Client ID de Teste (Apenas Demo)

Se você não quer configurar agora, pode usar um Client ID de teste (funcionará apenas para demonstração, não produção):

⚠️ **ATENÇÃO:** Este é um exemplo, você DEVE criar seu próprio!

```env
VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

---

## ✅ Como Saber que Funcionou?

### No Console do Navegador (F12):
1. Abra http://localhost:3000/login
2. Abra DevTools (F12)
3. Aba Console
4. Digite:
   ```javascript
   import.meta.env.VITE_GOOGLE_CLIENT_ID
   ```
5. Deve exibir seu Client ID

### Visualmente:
1. Vá em http://localhost:3000/login
2. Botão "Continuar com Google" deve estar **habilitado**
3. Clique no botão
4. Popup do Google deve **abrir**
5. Se pedir para selecionar conta → ✅ FUNCIONOU!

---

## 🐛 Problemas Comuns

### Botão não funciona
**Causa:** Client ID vazio ou inválido  
**Solução:** Verificar .env e reiniciar npm

### Popup não abre
**Causa:** Bloqueador de popup  
**Solução:** Permitir popups para localhost

### Erro: "redirect_uri_mismatch"
**Causa:** URL não autorizada no Google Console  
**Solução:** Adicionar http://localhost:3000 nas URIs autorizadas

---

## 🎯 Próximos Passos Após Configurar

1. ✅ Configurar Client ID
2. ✅ Reiniciar frontend
3. ✅ Abrir http://localhost:3000/login
4. ✅ Clicar "Continuar com Google"
5. ✅ Selecionar conta
6. ✅ Ver se redireciona para /dashboard

---

## 📞 Precisa de Ajuda?

### Verificar se backend está pronto:
```bash
curl http://localhost:8000/api/users/google-login/
# Deve retornar: {"detail":"access_token é obrigatório"}
```

### Verificar logs do frontend:
```bash
# Console do navegador (F12)
# Procure por erros relacionados a "Google" ou "OAuth"
```

### Verificar logs do backend:
```bash
# Terminal onde o Django está rodando
# Procure por requisições POST /api/users/google-login/
```

---

## ⏱️ Tempo Estimado

- **Opção 1 (Completa):** 5-10 minutos
- **Opção 2 (Teste):** 1 minuto
- **Testar:** 30 segundos

---

**Depois de configurar, teste e me avise se funcionou! 🚀**

