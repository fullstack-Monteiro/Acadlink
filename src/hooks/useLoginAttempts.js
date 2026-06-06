import { useState, useEffect } from 'react'

const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutos

export const useLoginAttempts = () => {
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(null)
  const [isLocked, setIsLocked] = useState(false)

  // Carregar estado do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('loginAttempts')
    if (stored) {
      const { count, until } = JSON.parse(stored)
      const now = Date.now()

      if (until && now < until) {
        setAttempts(count)
        setLockedUntil(until)
        setIsLocked(true)
      } else {
        localStorage.removeItem('loginAttempts')
      }
    }
  }, [])

  // Verificar se está desbloqueado
  useEffect(() => {
    if (!lockedUntil) return

    const timer = setInterval(() => {
      const now = Date.now()
      if (now >= lockedUntil) {
        setIsLocked(false)
        setAttempts(0)
        setLockedUntil(null)
        localStorage.removeItem('loginAttempts')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lockedUntil])

  const recordAttempt = () => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (newAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_TIME
      setLockedUntil(until)
      setIsLocked(true)
      localStorage.setItem('loginAttempts', JSON.stringify({ count: newAttempts, until }))
    } else {
      localStorage.setItem('loginAttempts', JSON.stringify({ count: newAttempts, until: null }))
    }
  }

  const reset = () => {
    setAttempts(0)
    setLockedUntil(null)
    setIsLocked(false)
    localStorage.removeItem('loginAttempts')
  }

  const getRemainingTime = () => {
    if (!lockedUntil) return 0
    const remaining = Math.ceil((lockedUntil - Date.now()) / 1000)
    return Math.max(0, remaining)
  }

  return {
    attempts,
    isLocked,
    remainingTime: getRemainingTime(),
    recordAttempt,
    reset,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - attempts)
  }
}
