# 🔗 Frontend Integration Guide

## API Base URL

```javascript
// .env
VITE_API_URL=http://localhost:8000/api
VITE_WEBSOCKET_URL=ws://localhost:8000/ws
```

## 1. API Client Setup

```javascript
// src/services/api.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// JWT Interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh Token Interceptor
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        )
        
        localStorage.setItem('access_token', data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
```

## 2. Update AuthContext

```javascript
// src/context/AuthContext.jsx
import api from '../services/api'

const login = async (email, password) => {
  try {
    const { data } = await api.post('/auth/token/', { email, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    
    const userResponse = await api.get('/users/me/')
    setUser(userResponse.data)
    return true
  } catch (error) {
    throw error.response?.data?.detail || 'Erro ao fazer login'
  }
}

const register = async (formData) => {
  try {
    const { data } = await api.post('/users/register/', formData)
    localStorage.setItem('access_token', data.access_token)
    setUser(data)
    return true
  } catch (error) {
    throw error.response?.data
  }
}
```

## 3. Update PostsContext

```javascript
// src/context/PostsContext.jsx
import api from '../services/api'

const loadPosts = async (page = 1) => {
  try {
    const { data } = await api.get(`/posts/feed/?page=${page}`)
    setPosts(prev => page === 1 ? data.results : [...prev, ...data.results])
    setHasMore(!!data.next)
  } catch (error) {
    console.error('Error loading posts:', error)
  }
}

const createPost = async (content, image) => {
  try {
    const formData = new FormData()
    formData.append('content', content)
    if (image) formData.append('image', image)
    
    const { data } = await api.post('/posts/', formData)
    setPosts(prev => [data, ...prev])
    return data
  } catch (error) {
    throw error.response?.data
  }
}

const likePost = async (postId) => {
  try {
    await api.post(`/posts/${postId}/like/`)
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, is_liked: true, likes_count: p.likes_count + 1 } : p
    ))
  } catch (error) {
    console.error('Error liking post:', error)
  }
}
```

## 4. Update ReelsContext

```javascript
// src/context/ReelsContext.jsx
import api from '../services/api'

const uploadReel = async (videoFile, description, category, hashtags) => {
  try {
    const formData = new FormData()
    formData.append('video', videoFile)
    formData.append('description', description)
    formData.append('category_id', category)
    formData.append('hashtags', JSON.stringify(hashtags))
    
    const { data } = await api.post('/reels/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        const progress = Math.round((e.loaded / e.total) * 100)
        setUploadProgress(progress)
      }
    })
    
    return data
  } catch (error) {
    throw error.response?.data
  }
}

const loadFeed = async (category = null) => {
  try {
    let url = '/reels/feed/'
    if (category) url += `?category=${category}`
    
    const { data } = await api.get(url)
    setFeed(data.results)
  } catch (error) {
    console.error('Error loading feed:', error)
  }
}
```

## 5. Update MessagesContext

```javascript
// src/context/MessagesContext.jsx
import api from '../services/api'

const loadConversations = async () => {
  try {
    const { data } = await api.get('/messages/')
    setConvs(data)
  } catch (error) {
    console.error('Error loading conversations:', error)
  }
}

const sendMessage = async (conversationId, content) => {
  try {
    const { data } = await api.post(
      `/messages/${conversationId}/send_message/`,
      { content }
    )
    return data
  } catch (error) {
    throw error.response?.data
  }
}

// WebSocket para mensagens em tempo real
useEffect(() => {
  const ws = new WebSocket(
    `${import.meta.env.VITE_WEBSOCKET_URL}/messages/${activeConversationId}/`
  )
  
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.type === 'chat_message') {
      setConvs(prev => prev.map(c => 
        c.id === activeConversationId
          ? { ...c, messages: [...c.messages, data.message] }
          : c
      ))
    }
  }
  
  return () => ws.close()
}, [activeConversationId])
```

## 6. Update NotificationsContext

```javascript
// src/context/NotificationsContext.jsx
import api from '../services/api'

const loadNotifications = async () => {
  try {
    const { data } = await api.get('/notifications/')
    setNotifications(data)
  } catch (error) {
    console.error('Error loading notifications:', error)
  }
}

// WebSocket para notificações em tempo real
useEffect(() => {
  const ws = new WebSocket(
    `${import.meta.env.VITE_WEBSOCKET_URL}/notifications/`
  )
  
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.type === 'notification') {
      setNotifications(prev => [data.data, ...prev])
    }
  }
  
  return () => ws.close()
}, [])
```

## 7. Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:8000/api
VITE_WEBSOCKET_URL=ws://localhost:8000/ws
VITE_CDN_URL=https://cdn.acadlink.co.mz
```

## 8. CORS Configuration

O backend já está configurado com CORS. Certifique-se de que:

```python
# config/settings/base.py
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000', cast=Csv())
```

## 9. Error Handling

```javascript
// src/hooks/useApiError.js
export function useApiError() {
  const handleError = (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login
      window.location.href = '/login'
    } else if (error.response?.status === 429) {
      return 'Muitas requisições. Tente novamente mais tarde.'
    } else if (error.response?.status === 500) {
      return 'Erro no servidor. Tente novamente.'
    }
    
    return error.response?.data?.detail || 'Erro desconhecido'
  }
  
  return { handleError }
}
```

## 10. Testing Endpoints

```bash
# Login
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}'

# Get current user
curl -X GET http://localhost:8000/api/users/me/ \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create post
curl -X POST http://localhost:8000/api/posts/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello world"}'

# Upload reel
curl -X POST http://localhost:8000/api/reels/upload/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@video.mp4" \
  -F "description=My reel" \
  -F "category_id=1" \
  -F "hashtags=[\"coding\",\"tutorial\"]"
```

## 11. Checklist de Integração

- [ ] Instalar axios
- [ ] Criar API client
- [ ] Atualizar AuthContext
- [ ] Atualizar PostsContext
- [ ] Atualizar ReelsContext
- [ ] Atualizar MessagesContext
- [ ] Atualizar NotificationsContext
- [ ] Configurar variáveis de ambiente
- [ ] Testar endpoints
- [ ] Implementar error handling
- [ ] Implementar loading states
- [ ] Testar WebSockets
- [ ] Implementar retry logic
- [ ] Adicionar logging

## 12. Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solução:** Certifique-se de que `CORS_ALLOWED_ORIGINS` inclui seu frontend URL.

### 401 Unauthorized
```
Token is invalid or expired
```
**Solução:** Implemente refresh token logic no interceptor.

### WebSocket Connection Failed
```
WebSocket is closed before the connection is established
```
**Solução:** Certifique-se de que o servidor está rodando com Daphne (ASGI).

## 📚 Recursos

- [Axios Documentation](https://axios-http.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
