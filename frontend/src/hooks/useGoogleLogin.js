import { useGoogleLogin as useGoogleOAuth } from '@react-oauth/google'
import { useState } from 'react'
import api from '../services/api'

/**
 * Hook para autenticação com Google OAuth 2.0
 * 
 * Fluxo:
 * 1. Abre popup do Google
 * 2. Utilizador escolhe conta
 * 3. Google devolve access_token
 * 4. Enviamos para o backend validar e criar/logar utilizador
 * 5. Backend devolve JWT tokens + dados do utilizador
 * 6. Guardamos tokens e chamamos onSuccess
 */
export function useGoogleLogin({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const googleLogin = useGoogleOAuth({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      setError(null)

      try {
        // Enviar access_token do Google para o backend
        const { data } = await api.post('/users/google-login/', {
          access_token: tokenResponse.access_token
        })

        // Guardar JWT tokens no localStorage
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token)
        }

        // Chamar callback com dados completos (user + created flag)
        onSuccess?.(data)
      } catch (err) {
        console.error('Google login error:', err)
        // Backend offline ou token inválido
        const errorMsg = err.response?.data?.detail || 
                         (err.code === 'ERR_NETWORK' ? 'Backend não está disponível. Inicia o servidor Django.' : 'Erro ao fazer login com Google')
        setError(errorMsg)
        onError?.(errorMsg)
      } finally {
        setLoading(false)
      }
    },
    onError: (err) => {
      console.error('Google OAuth error:', err)
      const errorMsg = err?.error === 'popup_closed_by_user' 
        ? 'Login cancelado' 
        : 'Erro ao conectar com Google'
      setError(errorMsg)
      onError?.(errorMsg)
    },
    flow: 'implicit'
  })

  return { googleLogin, loading, error }
}
