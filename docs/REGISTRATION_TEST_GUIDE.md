# Registration Flow - Testing Guide

## Prerequisites
- Backend running on `http://localhost:8000/`
- Frontend running on `http://localhost:3000/`
- At least one university in the database

## Step 1: Ensure Backend is Running

```bash
cd backend
python manage.py runserver
```

Expected output:
```
Starting development server at http://127.0.0.1:8000/
```

## Step 2: Ensure Frontend is Running

```bash
cd acadlink
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

## Step 3: Create Test University (if needed)

Open Django admin at `http://localhost:8000/admin/` and:
1. Login with superuser credentials
2. Go to Universities
3. Add a university with:
   - Name: "Universidade Eduardo Mondlane"
   - Acronym: "UEM"
   - Country: "Mozambique"
   - Email Domain: "uem.ac.mz" (not used for Gmail validation)

## Step 4: Test Registration Flow

### Test Case 1: Valid Registration

1. Navigate to `http://localhost:3000/register`
2. Fill the form with:
   - **Nome completo**: "Ana Machava"
   - **Email**: "ana.machava@gmail.com"
   - **Universidade**: Select "Universidade Eduardo Mondlane"
   - **Curso**: Select any course
   - **Senha**: "SecurePass123!"
   - **Confirmar Senha**: "SecurePass123!"
   - **Bio**: "Estudante de Engenharia Informática" (optional)
   - **Termos**: Check the checkbox

3. Click "Criar Conta"

**Expected Result**:
- Loading spinner appears on button
- After 1-2 seconds, redirects to `/dashboard`
- User is logged in (can see dashboard content)

### Test Case 2: Invalid Email (Non-Gmail)

1. Navigate to `http://localhost:3000/register`
2. Fill form with:
   - **Email**: "user@yahoo.com"
   - Other fields valid

3. Click "Criar Conta"

**Expected Result**:
- Error message: "Apenas emails Gmail são aceitos"
- Form remains on register page
- User can correct and retry

### Test Case 3: Email Already Exists

1. Register a user successfully (Test Case 1)
2. Try to register again with the same email

**Expected Result**:
- Error message: "Email já registado" or similar
- Form remains on register page

### Test Case 4: Password Mismatch

1. Navigate to `http://localhost:3000/register`
2. Fill form with:
   - **Senha**: "SecurePass123!"
   - **Confirmar Senha**: "DifferentPass123!"
   - Other fields valid

3. Click "Criar Conta"

**Expected Result**:
- Error message: "Passwords do not match"
- Form remains on register page

### Test Case 5: Missing Required Fields

1. Navigate to `http://localhost:3000/register`
2. Leave some required fields empty
3. Try to click "Criar Conta"

**Expected Result**:
- Button is disabled (grayed out)
- Cannot submit form
- Progress bar shows incomplete

### Test Case 6: Weak Password

1. Navigate to `http://localhost:3000/register`
2. Fill form with:
   - **Senha**: "weak"
   - Other fields valid

**Expected Result**:
- Password strength meter shows "Fraco"
- Error message: "Mínimo 8 caracteres"
- Cannot submit form

## Step 5: Verify Backend Response

### Check Backend Logs

When registration succeeds, backend logs should show:
```
POST /api/users/register/ HTTP/1.1" 201 Created
```

### Check Frontend Console

Open browser DevTools (F12) and check Console tab:
- No errors should appear
- Registration should complete without errors

### Check Database

```bash
cd backend
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.last()
print(f"Username: {user.username}")
print(f"Email: {user.email}")
print(f"First Name: {user.first_name}")
print(f"Last Name: {user.last_name}")
print(f"University: {user.university}")
print(f"Course: {user.course}")
print(f"Year: {user.year}")
```

## Step 6: Verify JWT Tokens

### Check localStorage

Open browser DevTools (F12) and go to Application > Local Storage:
- `access_token`: Should contain a JWT token
- `refresh_token`: Should contain a JWT token

### Decode JWT Token

Use https://jwt.io/ to decode the token and verify:
- `user_id` matches the registered user
- `exp` (expiration) is in the future
- `iat` (issued at) is recent

## Troubleshooting

### Issue: "Servidor indisponível"
- **Cause**: Backend not running
- **Solution**: Start backend with `python manage.py runserver`

### Issue: "Email já registado"
- **Cause**: Email already exists in database
- **Solution**: Use a different email or delete the user from admin

### Issue: "Apenas emails Gmail são aceitos"
- **Cause**: Using non-Gmail email
- **Solution**: Use an email ending with `@gmail.com`

### Issue: Form doesn't submit
- **Cause**: Form validation failing
- **Solution**: Check progress bar - all fields must be filled correctly

### Issue: Redirects to login after registration
- **Cause**: JWT tokens not being stored
- **Solution**: Check browser console for errors, verify API response includes tokens

### Issue: "Passwords do not match"
- **Cause**: Password and confirm password don't match
- **Solution**: Ensure both password fields have identical values

## Success Criteria

✅ Registration completes without errors
✅ User is redirected to dashboard
✅ User data is saved in database
✅ JWT tokens are stored in localStorage
✅ User can access protected routes
✅ Error messages are clear and helpful
✅ Form validation works correctly
✅ Loading state is visible during submission

## Files to Monitor

- **Backend**: `backend/apps/users/serializers.py` - Registration logic
- **Backend**: `backend/apps/users/views.py` - Register endpoint
- **Frontend**: `acadlink/src/pages/auth/Register.jsx` - Registration form
- **Frontend**: `acadlink/src/context/AuthContext.jsx` - Auth state management
- **Frontend**: `acadlink/src/hooks/useRegisterForm.js` - Form validation

## Next Steps

After successful registration testing:
1. Test login flow with registered user
2. Test password reset flow
3. Test email verification (when implemented)
4. Test university verification (when implemented)
