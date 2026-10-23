# Instruções de Uso da Estrutura Reorganizada

## ✅ O Que Foi Feito

### 1. Criadas Pastas Lógicas
- **`/scripts`** - Scripts de setup, migração e execução
- **`/infrastructure`** - Docker, docker-compose, configurações de deploy
- **`/config`** - Configurações compartilhadas
- **`/docs/guides`** - Guias de implementação
- **`/docs/api`** - Documentação de APIs
- **`/docs/technical`** - Documentação técnica

### 2. Movidos Arquivos
✅ `run_migration.ps1` → `scripts/`  
✅ `run_setup.ps1` → `scripts/`  
✅ `setup.bat` → `scripts/`  
✅ `Dockerfile` → `infrastructure/`  
✅ `docker-compose.yml` → `infrastructure/`

### 3. Criados Índices
- **STRUCTURE.md** - Mapa visual completo da estrutura
- **INDEX.md** - Índice centralizado com links
- **ORGANIZATION.md** - Este arquivo

## 📂 Nova Estrutura

```
AcadLink/
├─ 📦 acadlink/              (Frontend - ORIGINAL)
├─ 🔧 backend/               (Backend - ORIGINAL)
├─ 📚 docs/
│  ├─ guides/                (NOVO - Guias)
│  ├─ api/                   (NOVO - APIs)
│  ├─ technical/             (NOVO - Técnico)
│  └─ [arquivos originais]   (PRESERVADOS)
├─ 🚀 scripts/               (NOVO - Automatização)
├─ 🐳 infrastructure/        (NOVO - Deploy)
├─ ⚙️ config/                (NOVO - Configuração)
├─ INDEX.md                  (NOVO - Índice)
└─ STRUCTURE.md              (NOVO - Estrutura)
```

## 🎯 Próximos Passos Sugeridos

### Fase 2: Organizar Documentação
```
/docs/guides           → Mover QUICK_*.md, IMPLEMENTATION_*.md
/docs/api              → Mover API_*.md, APIS_*.md  
/docs/technical        → Mover BACKEND_*.md, SYSTEM_*.md
/docs/troubleshoot     → Mover *TROUBLESHOOT*, *DIAGNÓSTICO*
```

### Fase 3: Limpar e Referenciar
- Todos os .md serão mantidos
- Criados aliases/symlinks se necessário
- Documentação raiz aponta para INDEX.md

## 🔗 Arquivos Importantes

| Arquivo | Novo Local | Propósito |
|---------|-----------|-----------|
| STRUCTURE.md | `/` | 📋 Mapa da estrutura |
| INDEX.md | `/` | 📍 Central de documentação |
| SYSTEM_STATUS.txt | `docs/` | ✅ Status do projeto |
| START_HERE.md | `docs/` | 🚀 Começar |

## 💡 Boas Práticas

✅ Manter toda documentação em `/docs`  
✅ Scripts executáveis em `/scripts`  
✅ Configurações de infra em `/infrastructure`  
✅ Configurações compartilhadas em `/config`  
✅ Nada foi deletado, apenas reorganizado

## 📌 Como Usar Agora

### 1. Entender Estrutura
```bash
# Leia o mapa
cat STRUCTURE.md
cat INDEX.md
```

### 2. Executar Projeto
```bash
# Use scripts organizados
.\scripts\run_setup.ps1
```

### 3. Navegar Documentação
```bash
# Abra INDEX.md como ponto central
# Tudo está linkado para referência
```

## 🚀 Próximas Melhorias Opcionais

- [ ] Criar `.env.example` em `/config`
- [ ] Adicionar `/tests` com testes consolidados
- [ ] Criar `/assets` para imagens/mídia
- [ ] Adicionar `/local-dev` para configurações locais

---

**Estrutura criada:** 19 de maio de 2026  
**Status:** ✅ ORGANIZADA E FUNCIONAL

