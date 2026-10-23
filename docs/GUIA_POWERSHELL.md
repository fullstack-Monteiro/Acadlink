# 🔧 Guia PowerShell - Comandos Corretos

## Problema
Você está usando PowerShell, que não reconhece comandos bash como `rm -rf`.

## Solução: Comandos PowerShell Corretos

### Limpar Cache do Vite
```powershell
Remove-Item -Recurse -Force acadlink\.vite
```

### Limpar node_modules
```powershell
Remove-Item -Recurse -Force acadlink\node_modules
```

### Limpar package-lock.json
```powershell
Remove-Item -Force acadlink\package-lock.json
```

### Reinstalar Dependências
```powershell
cd acadlink
npm install
```

### Iniciar Frontend
```powershell
npm run dev
```

---

## Atalhos Úteis

| Ação | Comando PowerShell |
|---|---|
| Listar arquivos | `Get-ChildItem` ou `ls` |
| Mudar diretório | `cd caminho` |
| Criar pasta | `New-Item -ItemType Directory -Path nome` |
| Deletar arquivo | `Remove-Item arquivo.txt` |
| Deletar pasta | `Remove-Item -Recurse -Force pasta` |
| Limpar tela | `Clear-Host` ou `cls` |

---

## Passo a Passo Completo

### 1. Abrir PowerShell
Pressione `Win+X` e selecione "Windows PowerShell" ou "Terminal"

### 2. Ir para o diretório do projeto
```powershell
cd "D:\MEUS PROJETOS\Projetos_BLUEVISIONSOLUTIONS\AcadLink"
```

### 3. Limpar tudo
```powershell
Remove-Item -Recurse -Force acadlink\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force acadlink\node_modules -ErrorAction SilentlyContinue
Remove-Item -Force acadlink\package-lock.json -ErrorAction SilentlyContinue
```

### 4. Reinstalar
```powershell
cd acadlink
npm install
```

### 5. Iniciar
```powershell
npm run dev
```

---

## Se npm install Demorar Muito

É normal! npm install pode demorar 5-10 minutos na primeira vez.

Se quiser ver o progresso:
```powershell
npm install --verbose
```

---

## Próximas Ações

1. ✅ Abrir PowerShell
2. ✅ Ir para diretório do projeto
3. ✅ Executar comandos de limpeza
4. ✅ Executar `npm install`
5. ✅ Executar `npm run dev`
6. ✅ Recarregar navegador (Ctrl+Shift+R)

