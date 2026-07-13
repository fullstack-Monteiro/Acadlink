# Configurar Variáveis de Ambiente no Vercel

## Passo 1: Acessar Dashboard Vercel

1. Ir para https://vercel.com/dashboard
2. Selecionar seu projeto `Acadlink`
3. Clicar na aba "Settings"

## Passo 2: Adicionar Variáveis de Ambiente

1. No menu lateral, ir para "Environment Variables"
2. Clicar "Add New"
3. Adicionar as seguintes variáveis:

### Variáveis Necessárias

```
Nome da Variável          | Valor
--------------------------|--------------------------------------
VITE_API_URL             | https://seu-backend.com/api
VITE_GOOGLE_CLIENT_ID    | seu_google_client_id_aqui
VITE_APP_ENV             | production
```

## Passo 3: Configuração Detalhada

### 1. VITE_API_URL (Obrigatório)
- **Valor**: URL do seu backend Django
- **Exemplo**: `https://acadlink-api.railway.app/api`
- **Desenvolvimento**: `http://localhost:8000/api`
- **Produção**: seu domínio/API remota

### 2. VITE_GOOGLE_CLIENT_ID (Opcional - se usar Google Auth)
- **Valor**: Seu ID de cliente Google OAuth
- **Onde conseguir**: https://console.cloud.google.com
- **Exemplo**: `123456789-abcdef.apps.googleusercontent.com`

### 3. VITE_APP_ENV (Opcional)
- **Valor**: `production` ou `development`
- **Padrão**: `production`

## Passo 4: Redeploy Automático

Após adicionar as variáveis:
1. Vercel vai detectar as mudanças
2. Clique em "Redeploy" (ou faça um novo push no GitHub)
3. Aguarde o build completar

## Arquivo .env Local (Desenvolvimento)

Para desenvolvimento local, crie `acadlink/.env`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
VITE_APP_ENV=development
```

## Usar Variáveis no Código

No seu código React, acesse assim:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log(apiUrl); // http://localhost:8000/api (dev) ou https://acadlink-api.com/api (prod)
```

## Exemplo: Usar API URL

```javascript
// Em seu arquivo de API (acadlink/src/services/api.js)
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
```

## Verificar Variáveis no Build

No Dashboard Vercel, você pode ver as variáveis usadas em cada deploy:
1. Ir para "Deployments"
2. Selecionar um deploy
3. Clicar na aba "Build & Development Logs"
4. Ver as variáveis que foram injected

## Troubleshooting

### Variável não está funcionando
- Verificar se o nome começa com `VITE_`
- Fazer redeploy (push novo ou clicar "Redeploy")
- Limpar cache do navegador (Ctrl+Shift+Delete)

### API não conecta
- Verificar se `VITE_API_URL` está correto
- Confirmar que backend está rodando
- Verificar CORS no backend

### Google Auth não funciona
- Verificar `VITE_GOOGLE_CLIENT_ID`
- Adicionar domínio Vercel em Google Cloud Console
- Authorized Redirect URIs: `https://seu-projeto.vercel.app`

## Variáveis por Ambiente

Vercel permite variáveis diferentes por ambiente (Preview, Production, Development):

1. Clicar "Add New"
2. Adicionar valor
3. Selecionar ambiente desejado em "Select Environments"
4. Salvar

Exemplo:
- **Production**: `VITE_API_URL=https://api.acadlink.com`
- **Preview**: `VITE_API_URL=https://api-staging.acadlink.com`
- **Development**: `VITE_API_URL=http://localhost:8000/api`

## Próximas Fases

1. ✅ Adicionar variáveis no Vercel
2. ⏳ Configurar backend em produção
3. ⏳ Testar conexão frontend ↔ backend
4. ⏳ Configurar domínio customizado
5. ⏳ Setup SSL/TLS

