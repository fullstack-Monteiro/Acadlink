# ⚡ Solução Rápida - Tela em Branco

## O Problema
O sistema está aparecendo em branco quando você acessa http://localhost:3000

## A Solução

### Passo 1: Abrir 2 Terminais

**Terminal 1 - Backend**
```bash
cd backend
python manage.py runserver
```

Você deve ver:
```
Starting development server at http://127.0.0.1:8000/
```

**Terminal 2 - Frontend**
```bash
cd acadlink
npm run dev
```

Você deve ver:
```
VITE v5.4.2  ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

### Passo 2: Abrir Navegador
1. Ir para http://localhost:3000
2. Pressionar F12 para abrir console
3. Procurar por erros em vermelho

---

### Passo 3: Se Ainda Estiver em Branco

**Opção A: Limpar Cache**
```bash
# Parar frontend (Ctrl+C no Terminal 2)
cd acadlink
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Opção B: Verificar Conectividade**
```bash
# Em outro terminal, testar backend
curl http://localhost:8000/api/universities/

# Deve retornar JSON com universidades
```

**Opção C: Verificar Console (F12)**
- Aba "Console" - procurar erros vermelhos
- Aba "Network" - procurar requisições falhadas (404, 500)
- Aba "Elements" - verificar se `<div id="root"></div>` existe

---

## Checklist Rápido

- [ ] Backend rodando em http://localhost:8000
- [ ] Frontend rodando em http://localhost:3000
- [ ] Console (F12) sem erros vermelhos
- [ ] Network (F12) sem requisições falhadas
- [ ] Página mostrando Splash screen com logo

---

## Se Nada Funcionar

1. Compartilhar screenshot do console (F12)
2. Compartilhar output dos terminais
3. Verificar se há firewall bloqueando portas

