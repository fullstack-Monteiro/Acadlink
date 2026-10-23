# 🎯 COMECE AQUI - AcadLink

## Bem-vindo! 👋

O sistema de validação de universidades e cursos está **100% pronto** para usar.

---

## ⚡ Início Rápido (2 minutos)

### Passo 1: Executar Setup
```bash
setup.bat
```

Este comando vai:
- ✅ Executar migrations do banco de dados
- ✅ Popular 20 universidades com 120+ cursos
- ✅ Mostrar instruções para iniciar

### Passo 2: Abrir 2 Terminais

**Terminal 1 - Backend**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend**
```bash
cd acadlink
npm run dev
```

### Passo 3: Abrir Navegador
```
http://localhost:3000
```

---

## 📋 O Que Você Vai Ver

### Splash Screen (3 segundos)
- Logo do AcadLink
- Spinner de carregamento

### Welcome Page
- Botão "Criar conta"
- Botão "Já tenho conta"

### Página de Registro
- Formulário com campos
- **Dropdown de Universidade** (20 opções)
- **Dropdown de Curso** (cursos da universidade selecionada)

---

## ✨ Funcionalidades Implementadas

### ✅ 20 Universidades
```
UEM, ISCTEM, UCM, UniLúrio, UP, ISRI, A Politécnica, USTM, ISPU, ISCISA,
UMUM, UJC, UniZambeze, UJPM, UMBB, UniSave, UniWutivi, UTM, ISPG, ISPM
```

### ✅ 120+ Cursos Verificados
```
Engenharia Informática, Gestão de Empresas, Educação, Economia,
Engenharia Civil, Direito, Agricultura, e muitos mais...
```

### ✅ Validação Inteligente
```
Seleciona UEM → Vê cursos da UEM
Seleciona ISRI → Vê apenas Relações Internacionais, Diplomacia, Direito Internacional
```

---

## 🔍 Verificação Rápida

### Verificar Backend
```bash
curl http://localhost:8000/api/universities/
```

Deve retornar JSON com 20 universidades.

### Verificar Frontend
Abrir http://localhost:3000 e ver Splash screen.

### Verificar Universidades
1. Ir para http://localhost:3000/register
2. Clicar em dropdown de universidade
3. Deve aparecer 20 universidades

### Verificar Cursos
1. Selecionar uma universidade
2. Clicar em dropdown de curso
3. Deve aparecer cursos daquela universidade

---

## 📚 Documentação

| Arquivo | Para Quem |
|---|---|
| **START_SYSTEM.md** | Instruções detalhadas de como iniciar |
| **FINAL_CHECKLIST.md** | Verificação completa do sistema |
| **BLANK_SCREEN_TROUBLESHOOTING.md** | Se tela ficar em branco |
| **UNIVERSITIES_COURSES_VERIFICATION.md** | Detalhes de cada universidade |
| **IMPLEMENTATION_GUIDE_VERIFIED.md** | Guia técnico de implementação |

---

## ❓ Problemas Comuns

### Problema: "ModuleNotFoundError: No module named 'django'"
**Solução**: Ativar ambiente virtual
```bash
.venv\Scripts\activate.bat
```

### Problema: Tela em branco
**Solução**: 
1. Abrir console (F12)
2. Procurar por erros vermelhos
3. Consultar BLANK_SCREEN_TROUBLESHOOTING.md

### Problema: Universidades não aparecem
**Solução**:
1. Verificar se backend está rodando
2. Verificar se migration foi executada
3. Verificar se populate_universities foi executado

---

## 🎓 Próximos Passos

1. ✅ Executar setup.bat
2. ✅ Iniciar backend e frontend
3. ✅ Testar fluxo de registro
4. ✅ Selecionar universidade e curso
5. ✅ Submeter formulário

---

## 📊 Estatísticas

- **20 universidades** registadas
- **120+ cursos** verificados
- **9 universidades** com cursos atualizados
- **27 novos cursos** adicionados
- **100% pronto** para usar

---

## ✅ Checklist Rápido

- [ ] Executei setup.bat
- [ ] Backend está rodando em http://localhost:8000
- [ ] Frontend está rodando em http://localhost:3000
- [ ] Vejo Splash screen
- [ ] Vejo Welcome page
- [ ] Consigo criar conta
- [ ] Consigo selecionar universidade
- [ ] Consigo selecionar curso
- [ ] Consigo submeter formulário

---

## 🚀 Você Está Pronto!

O sistema está **100% funcional** e pronto para usar.

**Próximo passo**: Executar `setup.bat`

---

## 💬 Dúvidas?

Consulte os arquivos de documentação ou abra o console (F12) para ver erros.

**Boa sorte! 🎉**

