# Deploy Frontend no Vercel

## Passo 1: Preparar Variáveis de Ambiente

Crie arquivo `acadlink/.env` (opcional para desenvolvimento):

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=seu_google_id_aqui
```

## Passo 2: Deploy no Vercel

### Opção A: Dashboard Vercel (Recomendado)

1. Ir para https://vercel.com
2. Fazer login com sua conta
3. Clicar "Add New" → "Project"
4. Selecionar repositório `fullstack-Monteiro/Acadlink`
5. Clicar "Import"
6. Vercel detecta Vite automaticamente
7. Clicar "Deploy"

**Pronto!** Seu frontend estará online em minutos.

### Opção B: CLI Vercel

```bash
cd acadlink
vercel --prod
```

## Passo 3: Configurar Variáveis de Ambiente no Vercel

Após o primeiro deploy:

1. Dashboard Vercel → Seu projeto `Acadlink`
2. Clicar "Settings" → "Environment Variables"
3. Adicionar variáveis:
   - `VITE_API_URL`: URL do seu backend (ex: `https://api.acadlink.com`)
   - `VITE_GOOGLE_CLIENT_ID`: ID Google OAuth (opcional)

4. Fazer "Redeploy" para aplicar as variáveis

## Passo 4: Verificar Deploy

- URL: `https://acadlink.vercel.app` (ou similar)
- Auto-deploy a cada push no GitHub
- HTTPS e CDN automáticos

## Acessar Variáveis no Código

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
console.log(apiUrl); // http://localhost:8000/api (dev) ou https://seu-backend.com/api (prod)
```

## Troubleshooting

### Build falha
```bash
# Testar localmente
npm run build
npm run preview
```

### Variáveis não funcionam
- Verificar se o nome começa com `VITE_`
- Fazer novo push ou clicar "Redeploy" no Vercel

### Domínio customizado
1. Settings → Domains
2. Adicionar seu domínio
3. Configurar DNS conforme instruções Vercel

---

**Pronto para ir ao ar!** 🚀
