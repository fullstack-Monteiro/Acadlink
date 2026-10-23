# ⚡ Deploy Rápido do AcadLink na Vercel

**Tempo estimado:** 10-15 minutos

---

## 🎯 Método Mais Rápido (Recomendado)

### 1️⃣ GitHub (3 minutos)

```bash
# Abrir terminal na pasta do projeto
cd "d:\MEUS PROJETOS\Projetos_BLUEVISIONSOLUTIONS\AcadLink"

# Verificar status do Git
git status

# Se necessário, fazer commit
git add .
git commit -m "Preparar deploy para Vercel"
```

**No GitHub:**
1. Criar novo repositório: `acadlink`
2. Marcar como **Private**
3. **NÃO** marcar nenhuma opção de inicialização
4. Copiar e colar os comandos mostrados:

```bash
git remote add origin https://github.com/SEU-USUARIO/acadlink.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Vercel (5 minutos)

**No browser:**

1. **Abrir:** [vercel.com](https://vercel.com)
2. **Login:** Com a conta GitHub
3. **Clicar:** "Add New..." → "Project"
4. **Selecionar:** Repositório `acadlink`
5. **Configurar:**

```
Framework Preset: Vite
Root Directory: frontend  ⚠️ IMPORTANTE!
Build Command: npm run build
Output Directory: dist
```

6. **Variáveis de Ambiente** (clicar em "Environment Variables"):

```env
VITE_API_URL=https://seu-backend.railway.app/api
VITE_GOOGLE_CLIENT_ID=334501690060-g0btikdp1j27ugtnc9ngcaguvkodko04.apps.googleusercontent.com
VITE_APP_ENV=production
VITE_MOCK_MODE=true
VITE_DEBUG_MODE=false
```

7. **Clicar:** "Deploy" e aguardar 2-3 minutos

---

### 3️⃣ Google OAuth (2 minutos)

1. **Abrir:** [console.cloud.google.com](https://console.cloud.google.com/)
2. **Ir para:** APIs & Services → Credentials
3. **Editar** o OAuth Client ID
4. **Adicionar** nos "Authorized JavaScript origins":
   ```
   https://acadlink-SEU-PROJETO.vercel.app
   ```
5. **Adicionar** nos "Authorized redirect URIs":
   ```
   https://acadlink-SEU-PROJETO.vercel.app
   ```
6. **Salvar**

---

## ✅ Pronto!

Agora podes aceder ao teu site em: **https://acadlink-SEU-PROJETO.vercel.app**

---

## 🔄 Para Atualizar o Site

Sempre que fizeres alterações:

```bash
git add .
git commit -m "Descrição das alterações"
git push
```

A Vercel atualiza automaticamente! 🚀

---

## ⚠️ Se Algo Correr Mal

### Build Falhou?

```bash
cd frontend
npm run build
```

Se funcionar localmente mas falhar na Vercel:
- Vai para Vercel Dashboard → Settings → Environment Variables
- Verifica se todas as variáveis estão corretas
- Clica em "Redeploy"

### Página em Branco?

Verifica se:
- O ficheiro `vercel.json` existe na pasta `frontend`
- O Root Directory está definido como `frontend`

### Google OAuth Não Funciona?

- Confirma que adicionaste o domínio Vercel no Google Console
- Aguarda 5-10 minutos para propagar

---

## 📱 Testar

Depois do deploy, testa:

- ✅ Abrir o site no desktop
- ✅ Abrir o site no mobile
- ✅ Login com Google
- ✅ Navegar entre páginas
- ✅ Alternar tema dark/light

---

**🎓 Bom deploy!**
