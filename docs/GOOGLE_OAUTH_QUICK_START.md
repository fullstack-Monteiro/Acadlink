# 🚀 Google OAuth - Início Rápido

## ✅ Status Atual

**Frontend:** ✅ Completo e pronto  
**Backend:** ⏳ Pendente de implementação

---

## 🎯 Para começar AGORA:

### 1. Obter Google Client ID (5 minutos)

1. Acesse: https://console.cloud.google.com/
2. Crie projeto: "AcadLink"
3. Vá em: APIs & Services > Credentials
4. Create Credentials > OAuth 2.0 Client ID
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```
6. Copie o Client ID

### 2. Configurar Frontend (1 minuto)

```bash
cd frontend
```

Edite `.env`:
```env
VITE_GOOGLE_CLIENT_ID=SEU_CLIENT_ID_AQUI.apps.googleusercontent.com
```

### 3. Testar Frontend

```bash
npm run dev
```

1. Abra http://localhost:3000/login
2. Clique "Continuar com Google"
3. Popup do Google abre ✅
4. Selecione sua conta ✅
5. Verá erro 404 (normal - backend não existe ainda)

---

## 🐍 Implementar Backend (Para Devs Backend)

### Instalar dependências:
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
```

### Criar endpoint em `backend/apps/users/views.py`:

```python
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get('access_token')
    
    # Validar com Google
    response = requests.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        headers={'Authorization': f'Bearer {token}'}
    )
    google_user = response.json()
    
    # Criar/buscar usuário
    user, created = User.objects.get_or_create(
        email=google_user['email'],
        defaults={
            'username': google_user['email'].split('@')[0],
            'first_name': google_user.get('given_name', ''),
            'is_email_verified': True,
        }
    )
    
    # Retornar JWT
    refresh = RefreshToken.for_user(user)
    return Response({
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
    })
```

### Adicionar rota em `backend/apps/users/urls.py`:
```python
path('google-login/', google_login, name='google-login'),
```

---

## 📚 Documentação Completa

Ver: `docs/GOOGLE_OAUTH_SETUP.md`

---

## 🎉 O que funciona agora:

✅ Botão "Continuar com Google" com logo oficial  
✅ Popup do Google OAuth abre  
✅ Loading state enquanto conecta  
✅ Tratamento de erros  
✅ Responsivo (mobile + desktop)  
✅ Dark mode support  

## ⏳ O que falta:

- Backend endpoint `/api/users/google-login/`
- Validação do token do Google
- Criação/atualização de usuário
- Retorno de JWT tokens

---

**Tempo estimado para completar:** 30 minutos (backend)
