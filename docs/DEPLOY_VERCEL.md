# 🚀 Guia de Deploy do AcadLink para Vercel

Este guia explica passo a passo como fazer o deploy do frontend do AcadLink para a Vercel.

---

## 📋 Pré-requisitos

Antes de começar, certifica-te de que tens:

- ✅ Conta no GitHub (gratuita)
- ✅ Conta na Vercel (gratuita) - [vercel.com](https://vercel.com)
- ✅ Git instalado no teu computador
- ✅ Node.js instalado (v18 ou superior)

---

## 🔧 Passo 1: Preparar o Repositório Git

### 1.1. Verificar se o Git está inicializado

```bash
cd "d:\MEUS PROJETOS\Projetos_BLUEVISIONSOLUTIONS\AcadLink"
git status
```

Se der erro, inicializa o repositório:

```bash
git init
git add .
git commit -m "Initial commit: AcadLink project"
```

### 1.2. Criar Repositório no GitHub

1. Vai para [github.com](https://github.com)
2. Clica no botão **"+"** no canto superior direito
3. Seleciona **"New repository"**
4. Define:
   - **Repository name:** `acadlink`
   - **Description:** "Plataforma social académica para estudantes universitários moçambicanos"
   - **Visibility:** Private (recomendado) ou Public
5. **NÃO** marques nenhuma das opções (README, .gitignore, license)
6. Clica em **"Create repository"**

### 1.3. Conectar o Repositório Local ao GitHub

Copia os comandos que o GitHub mostra (algo como):

```bash
git remote add origin https://github.com/SEU-USUARIO/acadlink.git
git branch -M main
git push -u origin main
```

**Nota:** Substitui `SEU-USUARIO` pelo teu nome de utilizador do GitHub.

---

## 🌐 Passo 2: Deploy na Vercel

### Opção A: Deploy via Dashboard (Mais Fácil)

#### 2.1. Aceder à Vercel

1. Vai para [vercel.com](https://vercel.com)
2. Clica em **"Sign Up"** ou **"Log In"**
3. Escolhe **"Continue with GitHub"** para conectar a tua conta

#### 2.2. Importar o Projeto

1. No dashboard da Vercel, clica em **"Add New..."** → **"Project"**
2. Seleciona **"Import Git Repository"**
3. Procura e seleciona o repositório **`acadlink`**
4. Clica em **"Import"**

#### 2.3. Configurar o Projeto

Na página de configuração:

**Build Settings:**
- **Framework Preset:** Vite
- **Root Directory:** `frontend` ⚠️ **IMPORTANTE!**
- **Build Command:** `npm run build` (já preenchido)
- **Output Directory:** `dist` (já preenchido)

**Environment Variables:**

Clica em **"Environment Variables"** e adiciona as seguintes variáveis:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://seu-backend.railway.app/api` |
| `VITE_GOOGLE_CLIENT_ID` | `334501690060-g0btikdp1j27ugtnc9ngcaguvkodko04.apps.googleusercontent.com` |
| `VITE_APP_ENV` | `production` |
| `VITE_MOCK_MODE` | `true` |
| `VITE_DEBUG_MODE` | `false` |

⚠️ **IMPORTANTE:** 
- Se o backend ainda não estiver em produção, mantém `VITE_MOCK_MODE=true`
- Quando o backend estiver pronto, altera `VITE_API_URL` para o URL real
- Adiciona o domínio Vercel nas URLs autorizadas do Google OAuth Console

#### 2.4. Fazer Deploy

1. Clica em **"Deploy"**
2. Aguarda 2-3 minutos enquanto a Vercel faz o build
3. Quando terminar, verás uma mensagem de sucesso com o link do site

🎉 **Pronto!** O teu site está online em: `https://acadlink-SEU-PROJETO.vercel.app`

---

### Opção B: Deploy via CLI (Avançado)

Se preferires usar a linha de comandos:

#### 2.1. Instalar Vercel CLI

```bash
npm install -g vercel
```

#### 2.2. Login na Vercel

```bash
vercel login
```

#### 2.3. Deploy

```bash
cd "d:\MEUS PROJETOS\Projetos_BLUEVISIONSOLUTIONS\AcadLink\frontend"
vercel
```

Responde às perguntas:
- **Set up and deploy?** → `Y`
- **Which scope?** → Escolhe a tua conta
- **Link to existing project?** → `N`
- **What's your project's name?** → `acadlink`
- **In which directory is your code located?** → `./` (já está na pasta frontend)
- **Override settings?** → `Y`
  - **Framework Preset:** Vite
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`

Para fazer deploy em produção:

```bash
vercel --prod
```

---

## 🔐 Passo 3: Configurar Google OAuth (Obrigatório)

Depois do deploy, precisas adicionar o domínio Vercel no Google OAuth:

1. Vai para [Google Cloud Console](https://console.cloud.google.com/)
2. Seleciona o teu projeto
3. Menu **"APIs & Services"** → **"Credentials"**
4. Clica no teu **OAuth 2.0 Client ID**
5. Em **"Authorized JavaScript origins"**, adiciona:
   ```
   https://acadlink-SEU-PROJETO.vercel.app
   ```
6. Em **"Authorized redirect URIs"**, adiciona:
   ```
   https://acadlink-SEU-PROJETO.vercel.app
   ```
7. Clica em **"Save"**

---

## 🔄 Passo 4: Atualizações Automáticas

A partir de agora, sempre que fizeres `git push` para o repositório GitHub, a Vercel faz deploy automático! 🎉

**Workflow:**

```bash
# 1. Faz as tuas alterações no código
# 2. Commit as alterações
git add .
git commit -m "Descrição das alterações"

# 3. Push para o GitHub
git push

# 4. Vercel detecta automaticamente e faz deploy
```

---

## 📊 Passo 5: Monitorizar o Deploy

### Via Dashboard

1. Vai para [vercel.com](https://vercel.com)
2. Seleciona o projeto **acadlink**
3. Verás:
   - ✅ Status de cada deploy
   - 📈 Analytics de visitantes
   - ⚡ Performance metrics
   - 🐛 Logs de erros

### Via CLI

```bash
# Ver deployments
vercel list

# Ver logs do último deploy
vercel logs

# Ver informações do projeto
vercel inspect
```

---

## 🛠️ Comandos Úteis

### Testar Build Localmente

Antes de fazer push, podes testar se o build funciona:

```bash
cd "d:\MEUS PROJETOS\Projetos_BLUEVISIONSOLUTIONS\AcadLink\frontend"

# Build de produção
npm run build

# Testar o build localmente
npm run preview
```

Abre `http://localhost:4173` para ver o resultado.

### Rollback para Versão Anterior

Se algo correr mal:

1. Dashboard Vercel → Seleciona o projeto
2. Clica na tab **"Deployments"**
3. Encontra o deploy anterior que funcionava
4. Clica nos **"..."** → **"Promote to Production"**

---

## 🎯 Domínio Personalizado (Opcional)

Se tiveres um domínio próprio (ex: `acadlink.co.mz`):

1. Dashboard Vercel → Seleciona o projeto
2. Tab **"Settings"** → **"Domains"**
3. Clica em **"Add"**
4. Digita o teu domínio
5. Segue as instruções para configurar DNS

---

## ⚠️ Problemas Comuns

### Build Falha

**Erro:** `Module not found` ou `Cannot find package`

**Solução:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Fix: Update dependencies"
git push
```

### Variáveis de Ambiente Não Funcionam

**Problema:** As variáveis não foram carregadas

**Solução:**
1. Dashboard Vercel → Projeto → **"Settings"** → **"Environment Variables"**
2. Verifica se todas as variáveis estão corretas
3. Clica em **"Redeploy"** para aplicar as mudanças

### Página em Branco

**Problema:** Rotas do React Router não funcionam

**Solução:** O ficheiro `vercel.json` já está configurado com rewrites. Se o problema persistir:
1. Verifica se o ficheiro `vercel.json` está na raiz do frontend
2. Faz redeploy do projeto

### Google OAuth Não Funciona

**Problema:** Erro de redirect_uri_mismatch

**Solução:** 
- Confirma que adicionaste o domínio Vercel no Google Cloud Console
- Espera 5-10 minutos para as alterações propagarem

---

## 📞 Suporte

- **Documentação Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Vercel Discord:** [vercel.com/discord](https://vercel.com/discord)
- **Status Vercel:** [vercel-status.com](https://vercel-status.com)

---

## ✅ Checklist Final

Antes de considerar o deploy completo, verifica:

- [ ] Projeto no GitHub está atualizado
- [ ] Deploy na Vercel foi bem-sucedido
- [ ] Site abre no browser (https://acadlink-xxx.vercel.app)
- [ ] Domínio Vercel adicionado ao Google OAuth
- [ ] Login com Google funciona
- [ ] Navegação entre páginas funciona
- [ ] Tema dark/light funciona
- [ ] Responsivo mobile funciona
- [ ] Console do browser não tem erros críticos

---

**Desenvolvido por:** Let_Us_Dev Team  
**Projeto:** AcadLink - Plataforma Social Académica  
**Data:** Janeiro 2025

🎓 **Bom deploy!**
