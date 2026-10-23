# 🎯 Como Configurar Google Client ID - Passo a Passo

## ⏱️ Tempo estimado: 5 minutos

---

## ⚠️ NOTA IMPORTANTE - Leia antes de começar!

### Conta Google pessoal vs Google Workspace

**Se você usa Gmail pessoal (@gmail.com):**
- ✅ A tela de "Internal vs External" **NÃO APARECE**
- ✅ Seu app é automaticamente "External"
- ✅ Isso é NORMAL! Continue para o Passo 3.3

**Se você usa Google Workspace (empresa/organização):**
- ✅ A tela de "Internal vs External" **APARECE**
- ✅ Escolha "External"
- ✅ Continue normalmente

**Em resumo:** Se você não vê a opção Internal/External, está tudo certo! Pule direto para preencher o formulário.

---

## 📋 O que você vai fazer:

1. Criar projeto no Google Cloud
2. Configurar tela de consentimento OAuth
3. Criar credenciais OAuth 2.0
4. Copiar Client ID
5. Configurar no projeto
6. Testar!

---

## 🚀 PASSO 1: Acessar Google Cloud Console

### 1.1 Abra o link:
```
🔗 https://console.cloud.google.com/
```

### 1.2 Faça login com sua conta Google
- Use qualquer conta Gmail
- Pode ser conta pessoal

---

## 📦 PASSO 2: Criar Novo Projeto

### 2.1 Clique no seletor de projetos
```
┌─────────────────────────────────────┐
│ 📁 Select a project  ▼             │ ← Clique aqui (topo esquerdo)
└─────────────────────────────────────┘
```

### 2.2 Clique em "NEW PROJECT"
```
┌────────────────────────┐
│  + NEW PROJECT         │ ← Clique aqui (canto superior direito)
└────────────────────────┘
```

### 2.3 Preencha os dados:
```
Project name: AcadLink
              ^^^^^^^^ Digite isso

Location: No organization (deixe como está)

[CREATE] ← Clique aqui
```

### 2.4 Aguarde
- Aparecerá uma notificação "Creating project..."
- Aguarde 10-30 segundos
- Quando terminar, clique em "SELECT PROJECT"

---

## 🛡️ PASSO 3: Configurar OAuth Consent Screen

### 3.1 No menu lateral esquerdo, procure:
```
☰ Menu (ícone hamburguer)
  └── APIs & Services
       └── OAuth consent screen  ← Clique aqui
```

**Ou use o search bar no topo:**
```
🔍 Search: "OAuth consent screen"
```

### 3.2 Se aparecer escolha de tipo:

**Opção A - Se aparecer Internal vs External:**
```
┌─────────────────────────────────────┐
│ ⚪ Internal   (apenas Google Workspace) │
│                                     │
│ ⦿ External   (qualquer conta Google)│ ← Selecione este
│                                     │
└─────────────────────────────────────┘

[CREATE] ← Clique aqui
```

**Opção B - Se NÃO aparecer (conta pessoal):**
```
Você verá diretamente o formulário.
Pule para o Passo 3.3
```

⚠️ **NOTA:** Contas pessoais do Google (Gmail comum) não mostram a escolha Internal/External. Elas são automaticamente "External". Isso é NORMAL!

### 3.3 Preencha a Tela 1 - App Information:

**Campos obrigatórios (marcados com *):**

```
App name: *
  AcadLink
  ^^^^^^^^ Digite isso

User support email: *
  seu-email@gmail.com
  ^^^^^^^^^^^^^^^^^^^ Selecione seu email no dropdown
```

**Campos opcionais (pode deixar vazio):**
```
App logo: (deixe vazio)

App domain: (deixe vazio)
  - Application home page
  - Application privacy policy link
  - Application terms of service link

Authorized domains: (deixe vazio por enquanto)
```

**No final da página:**
```
Developer contact information: *
Email addresses: 
  seu-email@gmail.com
  ^^^^^^^^^^^^^^^^^^^ Digite seu email

[SAVE AND CONTINUE] ← Clique aqui (canto inferior direito)
```

### 3.4 Tela 2 - Scopes:
```
⚠️ IMPORTANTE: NÃO ADICIONE NENHUM SCOPE
   Deixe vazio

[SAVE AND CONTINUE] ← Clique aqui
```

### 3.5 Tela 3 - Test users (IMPORTANTE!):

⚠️ **Se você usar conta pessoal, PRECISA adicionar usuários de teste:**

```
+ ADD USERS  ← Clique aqui

Digite email:
┌──────────────────────────────┐
│ seu-email@gmail.com          │ Digite e pressione Enter
└──────────────────────────────┘

+ ADD USERS (adicione emails de quem vai testar)

[ADD] ← Confirme

[SAVE AND CONTINUE] ← Continue
```

⚠️ **ATENÇÃO:** Enquanto o app estiver em "Testing mode", APENAS os emails adicionados aqui poderão fazer login!

### 3.6 Tela 4 - Summary:
```
Revise as informações:
- App name: AcadLink ✓
- User support email: seu-email@gmail.com ✓
- Scopes: Nenhum ✓
- Test users: 1+ emails ✓

[BACK TO DASHBOARD] ← Clique aqui
```

✅ **OAuth Consent Screen configurado!**

---

## 🔑 PASSO 4: Criar OAuth Client ID (IMPORTANTE!)

### 4.1 No menu lateral:
```
☰ Menu
  └── APIs & Services
       └── Credentials  ← Clique aqui
```

### 4.2 Criar credenciais:
```
+ CREATE CREDENTIALS  ▼  ← Clique aqui (topo da página)
   │
   ├── API key
   ├── OAuth client ID    ← Selecione este
   └── Service account key
```

### 4.3 Escolha o tipo de aplicação:
```
Application type: Web application  ← Selecione no dropdown
                  ^^^^^^^^^^^^^^^
```

### 4.4 Configurar o Client:

#### Nome:
```
Name: AcadLink Web Client
      ^^^^^^^^^^^^^^^^^^^
```

#### Authorized JavaScript origins:
```
+ ADD URI

URIs:
┌──────────────────────────────────┐
│ http://localhost:3000            │ ← Digite e pressione Enter
└──────────────────────────────────┘

+ ADD URI (adicione outro)

┌──────────────────────────────────┐
│ http://localhost:5173            │ ← Digite e pressione Enter
└──────────────────────────────────┘
```

#### Authorized redirect URIs:
```
+ ADD URI

URIs:
┌──────────────────────────────────┐
│ http://localhost:3000            │ ← Digite e pressione Enter
└──────────────────────────────────┘
```

### 4.5 Criar:
```
[CREATE] ← Clique aqui (canto inferior direito)
```

---

## 📋 PASSO 5: Copiar Client ID

### 5.1 Um popup aparecerá com suas credenciais:

```
┌─────────────────────────────────────────────────────────┐
│ OAuth client created                                    │
│                                                         │
│ Your Client ID                                          │
│ ┌─────────────────────────────────────────────────────┐│
│ │ 123456789012-abc123def456ghi789jkl012mno345.apps... ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│ Your Client Secret                                      │
│ ┌─────────────────────────────────────────────────────┐│
│ │ GOCSPX-abc123def456                                 ││
│ └─────────────────────────────────────────────────────┘│
│                                                         │
│                                        [DOWNLOAD JSON]  │
│                                        [OK]             │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Copie o Client ID:
```
1. Clique no ícone de copiar ao lado do Client ID
   Ou selecione todo o texto e Ctrl+C

2. Ele vai parecer com isso:
   123456789012-abc123def456ghi789jkl012mno345.apps.googleusercontent.com
   
   ⚠️ IMPORTANTE: Copie TUDO, incluindo ".apps.googleusercontent.com"
```

### 5.3 Clique em [OK]

---

## ⚙️ PASSO 6: Configurar no Projeto

### 6.1 Abra o arquivo .env do frontend:

**No Windows:**
```
# Abra o VSCode ou qualquer editor
# Navegue até: frontend/.env
```

**No terminal:**
```bash
cd frontend
notepad .env      # Windows
nano .env         # Linux/Mac
code .env         # VSCode
```

### 6.2 Cole o Client ID:

**Antes:**
```env
VITE_GOOGLE_CLIENT_ID=
```

**Depois:**
```env
VITE_GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl012mno345.apps.googleusercontent.com
```

⚠️ **IMPORTANTE:** 
- NÃO adicione espaços
- NÃO adicione aspas
- NÃO quebre a linha
- Cole o ID COMPLETO

### 6.3 Salve o arquivo:
```
Ctrl + S  (Windows/Linux)
Cmd + S   (Mac)
```

---

## 🔄 PASSO 7: Reiniciar Frontend

### 7.1 Pare o servidor frontend:
```
Ctrl + C  (no terminal onde npm run dev está rodando)
```

### 7.2 Inicie novamente:
```bash
npm run dev
```

### 7.3 Aguarde iniciar:
```
  VITE v5.4.2  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## ✅ PASSO 8: TESTAR!

### 8.1 Abra o navegador:
```
http://localhost:3000/login
```

### 8.2 Abra DevTools (F12):
```
F12 (ou Ctrl+Shift+I)
→ Aba Console
```

### 8.3 Verifique o Client ID:
```javascript
// Digite no console:
import.meta.env.VITE_GOOGLE_CLIENT_ID

// Deve exibir seu Client ID completo:
"123456789012-abc123def456ghi789jkl012mno345.apps.googleusercontent.com"
```

### 8.4 Teste o botão:
```
1. Clique no botão "Continuar com Google"
2. Um popup do Google deve ABRIR
3. Selecione sua conta
4. Autorize o app
5. Popup fecha automaticamente
6. Você deve ser redirecionado para /dashboard
```

---

## 🎉 SUCESSO!

Se o popup do Google abriu, PARABÉNS! Está funcionando!

### O que aconteceu:
1. ✅ Frontend enviou requisição para Google
2. ✅ Google validou seu Client ID
3. ✅ Google mostrou tela de consentimento
4. ✅ Você autorizou
5. ✅ Google retornou access_token
6. ✅ Frontend enviou para seu backend
7. ✅ Backend validou com Google
8. ✅ Backend criou/buscou usuário
9. ✅ Backend retornou JWT tokens
10. ✅ Frontend armazenou tokens
11. ✅ Você foi redirecionado!

---

## 🐛 TROUBLESHOOTING

### Problema 0: Não vejo "Internal vs External"

**Isso é NORMAL!** 

Se você usa conta Gmail pessoal (@gmail.com), essa opção não aparece.

**O que fazer:**
1. ✅ Continue direto para o formulário (Passo 3.3)
2. ✅ Preencha os campos normalmente
3. ✅ Seu app será automaticamente "External"

---

### Problema 1: Popup não abre

**Erro no console:**
```
idpiframe_initialization_failed
```

**Solução:**
1. Verifique se o Client ID está correto no .env
2. Reinicie o frontend (Ctrl+C e npm run dev)
3. Limpe cache do browser (Ctrl+Shift+Delete)

---

### Problema 2: "redirect_uri_mismatch"

**Erro no popup:**
```
Error 400: redirect_uri_mismatch
```

**Solução:**
1. Volte no Google Cloud Console
2. Credentials → OAuth 2.0 Client IDs
3. Clique no seu client
4. Em "Authorized JavaScript origins", adicione:
   - http://localhost:3000
5. Em "Authorized redirect URIs", adicione:
   - http://localhost:3000
6. Clique SAVE
7. Aguarde 5 minutos (propagação)
8. Tente novamente

---

### Problema 3: Botão não faz nada

**Possíveis causas:**
1. Client ID vazio
2. Frontend não reiniciado
3. Backend não está rodando

**Solução:**
```bash
# 1. Verificar Client ID
cat frontend/.env | grep VITE_GOOGLE_CLIENT_ID

# 2. Reiniciar frontend
cd frontend
npm run dev

# 3. Verificar backend
curl http://localhost:8000/api/users/google-login/
# Deve retornar: {"detail":"access_token é obrigatório"}
```

---

### Problema 4: "This app isn't verified"

**Tela do Google mostra:**
```
⚠️ This app isn't verified
   This app hasn't been verified by Google yet.
```

**Solução:**
```
Clique em "Advanced" → "Go to AcadLink (unsafe)"

Isso é NORMAL em desenvolvimento!
Em produção você precisará verificar o app.
```

---

## 📊 Verificação Final

### Checklist:
- [ ] Projeto criado no Google Cloud
- [ ] OAuth Consent Screen configurado
- [ ] OAuth Client ID criado
- [ ] Client ID copiado
- [ ] Client ID colado no .env
- [ ] Frontend reiniciado
- [ ] Popup do Google abre
- [ ] Login funciona
- [ ] Redireciona para /dashboard

Se todos marcados: **VOCÊ CONSEGUIU!** 🎉

---

## 📝 Anotações Importantes

### Guarde essas informações:

**Client ID:**
```
123456789012-abc123def456ghi789jkl012mno345.apps.googleusercontent.com
```

**Client Secret:**
```
GOCSPX-abc123def456
(você não precisa por enquanto, mas guarde)
```

**Projeto Google Cloud:**
```
Nome: AcadLink
ID: acadlink-123456
```

---

## 🚀 Próximos Passos

Agora que o Google OAuth funciona:

1. **Testar com diferentes contas**
2. **Verificar criação de usuários no Django Admin**
3. **Testar logout e login novamente**
4. **Configurar Microsoft OAuth** (similar)
5. **Configurar GitHub OAuth** (similar)

---

## 📞 Precisa de Ajuda?

### Logs úteis:

**Frontend (Console do navegador):**
```
F12 → Console
Procure por erros relacionados a "Google" ou "OAuth"
```

**Backend (Terminal):**
```
Procure por:
POST /api/users/google-login/
Status 200 = Sucesso
Status 401/400 = Erro
```

---

## 🎓 Conceitos Aprendidos

Você acabou de configurar:
- ✅ OAuth 2.0 Authorization Flow
- ✅ Google Cloud Console
- ✅ OAuth Consent Screen
- ✅ Client Credentials
- ✅ Authorized Domains
- ✅ JWT Authentication
- ✅ Full-stack Integration

**Parabéns! Isso é conhecimento valioso!** 🎉

---

**Tempo total gasto:** ~5-10 minutos  
**Dificuldade:** ⭐⭐☆☆☆ (Fácil)  
**Status:** ✅ Pronto para usar!

---

**Data:** 18 de Agosto de 2026  
**Versão:** 1.0  
**Autor:** AcadLink Team
