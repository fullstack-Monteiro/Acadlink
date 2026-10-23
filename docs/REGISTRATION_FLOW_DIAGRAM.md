# Registration Flow - Complete Diagram

## User Registration Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. USER NAVIGATES TO REGISTER PAGE
   ↓
   http://localhost:3000/register
   ↓
   Register Component Loads
   ├─ useRegisterForm hook initializes
   ├─ Form state created
   └─ Autofocus on name field

2. USER FILLS FORM
   ↓
   Real-time Validation
   ├─ Name: 3+ chars, letters only
   ├─ Email: Gmail only (@gmail.com)
   ├─ University: Required selection
   ├─ Course: Required selection
   ├─ Password: 8+ chars, strength check
   ├─ Confirm: Must match password
   └─ Terms: Must be checked
   ↓
   Progress Bar Updates
   └─ Shows % completion

3. USER SUBMITS FORM
   ↓
   handleSubmit() Called
   ├─ Validate all fields
   ├─ Check terms accepted
   └─ Show loading state on button

4. FRONTEND SENDS REQUEST
   ↓
   POST /api/users/register/
   {
     "username": "ana_machava",
     "first_name": "Ana",
     "last_name": "Machava",
     "email": "ana@gmail.com",
     "university_id": 1,
     "course": "Computer Science",
     "year": 1,
     "password": "SecurePass123!",
     "password_confirm": "SecurePass123!"
   }

5. BACKEND PROCESSES REQUEST
   ↓
   UserRegisterSerializer.validate()
   ├─ Check passwords match
   ├─ Validate Gmail domain
   ├─ Check university exists
   └─ All validations pass ✓
   ↓
   UserRegisterSerializer.create()
   ├─ Create User object
   ├─ Hash password
   ├─ Create Profile
   └─ Generate JWT tokens

6. BACKEND RETURNS RESPONSE
   ↓
   HTTP 201 Created
   {
     "id": 1,
     "username": "ana_machava",
     "email": "ana@gmail.com",
     "first_name": "Ana",
     "last_name": "Machava",
     "university": {...},
     "course": "Computer Science",
     "year": 1,
     "is_email_verified": false,
     "is_university_verified": false,
     "profile": {...},
     "portfolio_items": [],
     "created_at": "2026-05-03T...",
     "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
   }

7. FRONTEND PROCESSES RESPONSE
   ↓
   AuthContext.register()
   ├─ Extract access_token
   ├─ Extract refresh_token
   ├─ Store in localStorage
   ├─ Fetch user data from /users/me/
   └─ Update user state
   ↓
   localStorage Updated
   ├─ access_token: "eyJ0eXAiOiJKV1QiLCJhbGc..."
   └─ refresh_token: "eyJ0eXAiOiJKV1QiLCJhbGc..."

8. USER REDIRECTED
   ↓
   navigate('/dashboard')
   ↓
   Dashboard Page Loads
   ├─ User is authenticated
   ├─ Can access protected routes
   └─ JWT token in Authorization header

✅ REGISTRATION COMPLETE
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                           │
└─────────────────────────────────────────────────────────────────┘

VALIDATION ERROR (Frontend)
├─ Invalid email format
├─ Password too weak
├─ Passwords don't match
├─ Missing required fields
└─ → Show error message, stay on form

API ERROR (Backend)
├─ Email already exists
│  └─ Response: {"email": ["Email já registado"]}
├─ Invalid Gmail domain
│  └─ Response: {"email": ["Apenas emails Gmail são aceitos"]}
├─ Passwords don't match
│  └─ Response: {"password": ["Passwords do not match"]}
├─ University not found
│  └─ Response: {"university_id": ["University not found"]}
└─ → Extract error message, display to user

NETWORK ERROR
├─ Backend not running
├─ Connection timeout
├─ Network unreachable
└─ → Show "Servidor indisponível" message

ERROR DISPLAY
├─ ErrorAlert component shows message
├─ User can correct and retry
└─ Form remains on register page
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      DATA FLOW ARCHITECTURE                       │
└──────────────────────────────────────────────────────────────────┘

FRONTEND (React)
├─ Register Component
│  ├─ useRegisterForm Hook
│  │  ├─ Form state
│  │  ├─ Field validation
│  │  └─ Error messages
│  ├─ AuthContext
│  │  ├─ register() method
│  │  ├─ Token storage
│  │  └─ User state
│  └─ Validation Utils
│     ├─ Email validation
│     ├─ Password validation
│     └─ Error message mapping
│
├─ API Client (axios)
│  ├─ Base URL: http://localhost:8000/api
│  ├─ JWT Interceptor
│  └─ Refresh Token Interceptor
│
└─ localStorage
   ├─ access_token
   └─ refresh_token

BACKEND (Django)
├─ UserViewSet
│  └─ register() action
│     ├─ Receives POST request
│     ├─ Calls UserRegisterSerializer
│     └─ Returns response with tokens
│
├─ UserRegisterSerializer
│  ├─ Validates data
│  ├─ Checks Gmail domain
│  ├─ Creates user
│  ├─ Generates JWT tokens
│  └─ Returns serialized user + tokens
│
├─ User Model
│  ├─ username
│  ├─ email
│  ├─ first_name
│  ├─ last_name
│  ├─ university (FK)
│  ├─ course
│  ├─ year
│  └─ password (hashed)
│
└─ Profile Model
   ├─ user (OneToOne)
   ├─ avatar
   ├─ bio
   └─ settings

DATABASE (SQLite)
├─ users table
├─ profiles table
└─ universities table
```

## State Management

```
┌──────────────────────────────────────────────────────────────────┐
│                    STATE MANAGEMENT FLOW                          │
└──────────────────────────────────────────────────────────────────┘

useRegisterForm Hook State
├─ form: {
│    name: '',
│    email: '',
│    university: '',
│    course: '',
│    password: '',
│    confirm: '',
│    bio: '',
│    agreeTerms: false
│  }
├─ fieldErrors: { name: '', email: '', ... }
├─ fieldStatus: { name: 'valid', email: 'invalid', ... }
├─ completionPercent: 0-100
├─ emailExists: false
└─ checkingEmail: false

AuthContext State
├─ user: null | { id, username, email, ... }
├─ loading: false | true
├─ error: null | 'error message'
├─ connections: []
├─ portfolio: []
└─ Methods:
   ├─ login()
   ├─ register()
   ├─ logout()
   └─ updateUser()

Component State
├─ showPassword: false | true
├─ showConfirm: false | true
├─ submitError: ''
├─ showTermsModal: false | true
└─ passwordStrength: { score, level, feedback }
```

## Validation Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│                    VALIDATION PIPELINE                            │
└──────────────────────────────────────────────────────────────────┘

USER INPUT
   ↓
FRONTEND VALIDATION (Real-time)
├─ Name: /^[a-záéíóúàâêôãõç\s'-]+$/i (3+ chars)
├─ Email: /^[^\s@]+@gmail\.com$/i
├─ University: Required selection
├─ Course: Required selection
├─ Password: 8+ chars, strength check
├─ Confirm: Must match password
└─ Terms: Must be checked
   ↓
   ├─ Valid → Enable submit button
   └─ Invalid → Show error, disable button
   ↓
FORM SUBMISSION
   ↓
BACKEND VALIDATION
├─ Passwords match check
├─ Gmail domain validation
├─ University exists check
├─ Email uniqueness check
└─ User creation
   ↓
   ├─ Valid → Return 201 with tokens
   └─ Invalid → Return 400 with errors
   ↓
FRONTEND ERROR HANDLING
├─ Extract error messages
├─ Display to user
└─ Allow retry
```

## Security Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    SECURITY FLOW                                  │
└──────────────────────────────────────────────────────────────────┘

PASSWORD SECURITY
├─ Frontend: Strength meter, common password check
├─ Backend: Hashed with Django's default hasher
└─ Transmission: HTTPS (in production)

EMAIL VALIDATION
├─ Frontend: Gmail-only regex validation
├─ Backend: Gmail domain check
└─ Database: Unique constraint

JWT TOKENS
├─ Generated: On successful registration
├─ Stored: In localStorage (frontend)
├─ Transmitted: In Authorization header
├─ Expiration: 15 minutes (access), 7 days (refresh)
└─ Refresh: Automatic via interceptor

CORS SECURITY
├─ Backend: Configured for localhost:3000
├─ Frontend: Sends credentials with requests
└─ Tokens: Included in Authorization header

RATE LIMITING
├─ Frontend: Login attempts limited (5 max, 15 min lockout)
├─ Backend: Can be enabled via django-ratelimit
└─ Registration: Currently unlimited (can be added)
```

---

**Legend**:
- ✓ = Success
- ✗ = Error
- → = Flow direction
- ├─ = Branch
- └─ = End of branch
