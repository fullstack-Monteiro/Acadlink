// Debug script - verificar estado de localStorage e auth no console
console.log('=== AUTH DEBUG ===')
console.log('access_token:', localStorage.getItem('access_token'))
console.log('test_mode:', localStorage.getItem('test_mode'))
console.log('test_user:', localStorage.getItem('test_user'))
console.log('Current URL:', window.location.href)
console.log('Current pathname:', window.location.pathname)
