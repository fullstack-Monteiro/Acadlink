# 🔍 Diagnóstico - Tela em Branco

## Passo 1: Abrir Console (F12)

1. Pressione **F12** no navegador
2. Vá para aba **"Console"**
3. Procure por erros em **vermelho**
4. Copie qualquer mensagem de erro

---

## Passo 2: Verificar Aba "Network"

1. Vá para aba **"Network"**
2. Procure por requisições com status **404** ou **500**
3. Verifique se há requisições falhadas

---

## Passo 3: Verificar Aba "Elements"

1. Vá para aba **"Elements"** (ou "Inspector")
2. Procure por `<div id="root"></div>`
3. Verifique se o elemento existe

---

## Passo 4: Testar Versão Simplificada

Se o console mostrar erros, vamos testar uma versão simplificada:

1. Abra `acadlink/src/main.jsx`
2. Mude a importação de:
   ```javascript
   import App from './App.jsx'
   ```
   Para:
   ```javascript
   import App from './App.simple.jsx'
   ```
3. Salve o arquivo
4. O navegador deve recarregar automaticamente
5. Você deve ver "🎓 AcadLink - Sistema funcionando!"

Se isso funcionar, o problema está no App.jsx.

---

## Passo 5: Verificar Backend

Abra outro terminal e execute:
```bash
curl http://localhost:8000/api/universities/
```

Se retornar JSON, o backend está funcionando.
Se retornar erro, o backend não está rodando.

---

## Possíveis Causas

### 1. Erro no App.jsx
- Sintaxe incorreta
- Import faltando
- Componente não renderizando

### 2. Erro no Context
- AuthProvider com erro
- ThemeProvider com erro
- Outro provider com erro

### 3. Erro no Router
- Rotas duplicadas (já corrigidas)
- Rota padrão não funcionando

### 4. Erro de Conexão
- Backend não está rodando
- CORS não configurado
- Porta errada

### 5. Erro de Build
- Tailwind CSS não compilando
- Vite não compilando corretamente

---

## Solução Rápida

Se nada funcionar:

1. Parar frontend (Ctrl+C)
2. Limpar cache:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

3. Se ainda não funcionar, compartilhe:
   - Screenshot do console (F12)
   - Output do terminal do frontend
   - Output do terminal do backend

