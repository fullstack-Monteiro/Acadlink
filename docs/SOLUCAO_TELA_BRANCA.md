# ✅ Solução - Tela em Branco

## O Problema
O App.jsx tinha rotas duplicadas que podem estar causando o problema.

## A Solução

### Passo 1: Parar o Frontend
Pressione **Ctrl+C** no terminal onde o `npm run dev` está rodando.

### Passo 2: Limpar Cache do Navegador
1. Abrir DevTools (F12)
2. Ir para aba "Application" (ou "Storage")
3. Clicar em "Clear site data"
4. Marcar todas as opções
5. Clicar "Clear"

### Passo 3: Limpar Cache do Vite
```bash
cd acadlink
rm -rf .vite
```

### Passo 4: Reiniciar Frontend
```bash
npm run dev
```

### Passo 5: Recarregar Navegador
Pressione **Ctrl+Shift+R** (ou **Cmd+Shift+R** no Mac) para recarregar sem cache.

---

## Se Ainda Não Funcionar

### Opção 1: Limpar Tudo
```bash
cd acadlink
rm -rf node_modules package-lock.json .vite
npm install
npm run dev
```

### Opção 2: Verificar Console (F12)
1. Abrir DevTools (F12)
2. Ir para aba "Console"
3. Procurar por erros em vermelho
4. Copiar a mensagem de erro

### Opção 3: Testar Versão Simplificada
Se o console mostrar erros, edite `acadlink/src/main.jsx`:

Mude de:
```javascript
import App from './App.jsx'
```

Para:
```javascript
import App from './App.simple.jsx'
```

Salve e veja se aparece "🎓 AcadLink - Sistema funcionando!"

Se funcionar, o problema está no App.jsx (já foi corrigido).

---

## Checklist

- [ ] Parei o frontend (Ctrl+C)
- [ ] Limpei cache do navegador (F12 → Application → Clear site data)
- [ ] Limpei cache do Vite (rm -rf .vite)
- [ ] Reiniciei frontend (npm run dev)
- [ ] Recarreguei navegador (Ctrl+Shift+R)
- [ ] Vejo Splash screen com logo

---

## Próximas Ações

Se tudo funcionar:
1. Você deve ver Splash screen com logo
2. Após 3 segundos, deve ir para Welcome page
3. Clicar em "Criar conta"
4. Preencher formulário
5. Selecionar universidade
6. Selecionar curso

---

## Suporte

Se nada funcionar:
1. Compartilhe screenshot do console (F12)
2. Compartilhe output do terminal
3. Verifique se backend está rodando

