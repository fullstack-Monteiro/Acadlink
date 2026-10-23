# 🧪 Teste do Frontend - Passo a Passo

## Passo 1: Verificar Node.js
```bash
node --version
npm --version
```

**Esperado**: Node.js v14+ e npm v6+

---

## Passo 2: Instalar Dependências
```bash
cd acadlink
npm install
```

**Esperado**: Sem erros, todas as dependências instaladas

---

## Passo 3: Iniciar Servidor Frontend
```bash
npm run dev
```

**Esperado**:
```
VITE v5.4.2  ready in XXX ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

---

## Passo 4: Abrir no Navegador
1. Abrir http://localhost:3000
2. Pressionar F12 para abrir console
3. Procurar por erros

---

## Passo 5: Verificar Splash Screen
Você deve ver:
- Logo do AcadLink
- Spinner de carregamento
- Texto "Carregando..."

Após 3 segundos, deve ir para Welcome page.

---

## Passo 6: Verificar Welcome Page
Você deve ver:
- Logo do AcadLink
- Botão "Criar conta"
- Botão "Já tenho conta"

---

## Se Tela Ficar em Branco

### Opção 1: Verificar Console (F12)
Procurar por erros como:
- `Cannot find module`
- `Failed to fetch`
- `Syntax error`

### Opção 2: Verificar Network (F12 → Network)
- Procurar por requisições falhadas (status 404, 500)
- Verificar se há requisições para backend

### Opção 3: Limpar Cache
```bash
# Parar servidor (Ctrl+C)
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Opção 4: Verificar Porta
Se porta 3000 está em uso:
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

Mudar em `vite.config.js`:
```javascript
server: {
  port: 5173,  // Mudar para outra porta
}
```

---

## Checklist Final

- [ ] Node.js instalado (v14+)
- [ ] npm install executado sem erros
- [ ] npm run dev rodando
- [ ] http://localhost:3000 acessível
- [ ] Splash screen aparecendo
- [ ] Console sem erros vermelhos
- [ ] Network sem requisições falhadas

---

## Próximas Ações

Se tudo estiver funcionando:
1. Clicar em "Criar conta"
2. Preencher formulário de registro
3. Selecionar universidade
4. Selecionar curso
5. Submeter

