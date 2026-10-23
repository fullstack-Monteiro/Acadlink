import { useState, useCallback, useEffect } from 'react'
import { isValidEmail, isValidName, isCommonPassword, validatePassword } from '../utils/validation'

export const useRegisterForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    university: '',
    course: '',
    password: '',
    confirm: '',
    bio: '',
    agreeTerms: false
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [fieldStatus, setFieldStatus] = useState({}) // 'valid', 'invalid', 'warning'
  const [completionPercent, setCompletionPercent] = useState(0)
  const [emailExists, setEmailExists] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  // Calcular progresso
  useEffect(() => {
    const fields = ['name', 'email', 'university', 'course', 'password', 'confirm', 'agreeTerms']
    const completed = fields.filter(f => {
      if (f === 'agreeTerms') return form[f]
      if (f === 'confirm') return form.password === form.confirm && form.password.length >= 8
      if (f === 'password') return form[f].length >= 8
      return form[f].trim().length > 0
    }).length
    setCompletionPercent(Math.round((completed / fields.length) * 100))
  }, [form])

  const validateField = useCallback((field, value) => {
    const errors = {}
    const status = {}

    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Nome obrigatório'
          status.name = 'invalid'
        } else if (!isValidName(value)) {
          errors.name = 'Nome inválido (mínimo 3 caracteres, apenas letras)'
          status.name = 'invalid'
        } else {
          status.name = 'valid'
        }
        break

      case 'email':
        if (!value) {
          errors.email = 'Email obrigatório'
          status.email = 'invalid'
        } else if (!isValidEmail(value)) {
          errors.email = 'Apenas emails Gmail são aceitos'
          status.email = 'invalid'
        } else {
          status.email = 'valid'
        }
        break

      case 'university':
        if (!value) {
          errors.university = 'Selecciona a universidade'
          status.university = 'invalid'
        } else {
          status.university = 'valid'
        }
        break

      case 'course':
        if (!value) {
          errors.course = 'Selecciona o curso'
          status.course = 'invalid'
        } else {
          status.course = 'valid'
        }
        break

      case 'password':
        if (!value) {
          errors.password = 'Senha obrigatória'
          status.password = 'invalid'
        } else if (value.length < 8) {
          errors.password = 'Mínimo 8 caracteres'
          status.password = 'invalid'
        } else if (isCommonPassword(value)) {
          errors.password = 'Senha muito comum. Escolhe outra'
          status.password = 'invalid'
        } else {
          const strength = validatePassword(value)
          if (strength.level === 'weak') {
            status.password = 'warning'
          } else {
            status.password = 'valid'
          }
        }
        break

      case 'confirm':
        if (!value) {
          errors.confirm = 'Confirma a senha'
          status.confirm = 'invalid'
        } else if (value !== form.password) {
          errors.confirm = 'As senhas não coincidem'
          status.confirm = 'invalid'
        } else {
          status.confirm = 'valid'
        }
        break

      case 'agreeTerms':
        if (!value) {
          errors.agreeTerms = 'Aceita os termos para continuar'
          status.agreeTerms = 'invalid'
        } else {
          status.agreeTerms = 'valid'
        }
        break
    }

    return { errors, status }
  }, [form.password])

  const updateField = useCallback((field, value) => {
    setForm(f => ({ ...f, [field]: value }))

    const { errors, status } = validateField(field, value)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(e => ({ ...e, ...errors }))
    } else {
      setFieldErrors(e => {
        const newErrors = { ...e }
        delete newErrors[field]
        return newErrors
      })
    }
    setFieldStatus(s => ({ ...s, ...status }))

    // Verificar email em tempo real
    if (field === 'email' && isValidEmail(value)) {
      checkEmailExists(value)
    }
  }, [validateField])

  const checkEmailExists = useCallback(async (email) => {
    setCheckingEmail(true)
    try {
      // TODO: Chamar API para verificar se email existe
      // const response = await api.post('/auth/check-email/', { email })
      // setEmailExists(response.data.exists)
      setEmailExists(false)
    } catch (err) {
      console.error('Erro ao verificar email:', err)
    } finally {
      setCheckingEmail(false)
    }
  }, [])

  const validateAll = useCallback(() => {
    const fields = ['name', 'email', 'university', 'course', 'password', 'confirm', 'agreeTerms']
    const allErrors = {}
    const allStatus = {}

    fields.forEach(field => {
      const { errors, status } = validateField(field, form[field])
      Object.assign(allErrors, errors)
      Object.assign(allStatus, status)
    })

    setFieldErrors(allErrors)
    setFieldStatus(allStatus)
    return Object.keys(allErrors).length === 0
  }, [form, validateField])

  const isFormValid = useCallback(() => {
    return (
      form.name.trim() &&
      isValidEmail(form.email) &&
      form.university &&
      form.course &&
      form.password.length >= 8 &&
      form.password === form.confirm &&
      form.agreeTerms &&
      !emailExists
    )
  }, [form, emailExists])

  return {
    form,
    setForm,
    updateField,
    fieldErrors,
    fieldStatus,
    completionPercent,
    emailExists,
    checkingEmail,
    validateAll,
    isFormValid: isFormValid()
  }
}
