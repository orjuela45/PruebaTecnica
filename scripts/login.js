async function login(username, password) {
  const response = await fetch(
    'https://corsproxy.io/?' + encodeURIComponent('http://185.253.153.175/test/login'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  const data = await response.json()

  if (response.status === 401) {
    showToast('Usuario o contraseña incorrectos', true)
    return
  }  
  
  if (response.status !== 200) {
    showToast(data.message || 'Error en el login', true)
    return
  }

  localStorage.setItem('token', data.token)
  window.location.href = 'products.html'
}
