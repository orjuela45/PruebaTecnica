const API_URL_PRODUCTS = 'http://185.253.153.175/test/api/products'

let editingId = null

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

async function loadProducts() {
  try {
    const response = await fetch(`${API_URL_PRODUCTS}`, {
      headers: getAuthHeaders(),
    })

    if (response.status === 401) {
      window.location.href = 'login.html'
      return
    }

    const products = await response.json()
    displayProducts(products)
  } catch (error) {
    showToast('Error al cargar los productos', true)
    console.error('Error:', error)
  }
}

function displayProducts(products) {
  const tbody = document.getElementById('productTableBody')
  tbody.innerHTML = ''

  products.forEach((product) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct(${
                  product.id
                })">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${
                  product.id
                })">
                    Eliminar
                </button>
            </td>
        `
    tbody.appendChild(tr)
  })
}

async function createProduct(productData) {
  const response = await fetch(`${API_URL_PRODUCTS}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  })

  if (response.status === 401) {
    window.location.href = 'login.html'
    return
  }

  if (!response.ok) {
    throw new Error('Error al crear el producto')
  }
}

async function updateProduct(id, productData) {
  const response = await fetch(`${API_URL_PRODUCTS}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  })

  if (response.status === 401) {
    window.location.href = 'login.html'
    return
  }

  if (!response.ok) {
    throw new Error('Error al actualizar el producto')
  }
}

async function deleteProduct(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    return
  }

  try {
    const response = await fetch(`${API_URL_PRODUCTS}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (response.status === 401) {
      window.location.href = 'login.html'
      return
    }

    if (!response.ok) {
      throw new Error('Error al eliminar el producto')
    }

    await loadProducts()
    showToast('Producto eliminado con éxito')
  } catch (error) {
    showToast('Error al eliminar el producto', true)
    console.error('Error:', error)
  }
}

async function editProduct(id) {
  try {
    const response = await fetch(`${API_URL_PRODUCTS}/${id}`, {
      headers: getAuthHeaders(),
    })

    if (response.status === 401) {
      window.location.href = 'login.html'
      return
    }

    const product = await response.json()

    document.getElementById('productId').value = id
    document.getElementById('name').value = product.name
    document.getElementById('description').value = product.description
    document.getElementById('price').value = product.price
    document.getElementById('category').value = product.category
    document.getElementById('stock').value = product.stock

    editingId = id
    document.querySelector('button[type="submit"]').textContent = 'Actualizar'
  } catch (error) {
    showToast('Error al cargar el producto', true)
    console.error('Error:', error)
  }
}

function resetForm() {
  document.getElementById('productForm').reset()
  document.getElementById('productId').value = ''
  editingId = null
  document.querySelector('button[type="submit"]').textContent = 'Guardar'
}

document.addEventListener('DOMContentLoaded', loadProducts)

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const productData = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    price: parseFloat(document.getElementById('price').value),
    category: document.getElementById('category').value,
    stock: parseInt(document.getElementById('stock').value),
  }

  try {
    if (editingId) {
      await updateProduct(editingId, productData)
    } else {
      await createProduct(productData)
    }

    resetForm()
    await loadProducts()
    showToast(
      editingId ? 'Producto actualizado con éxito' : 'Producto creado con éxito'
    )
  } catch (error) {
    showToast('Error al guardar el producto', true)
    console.error('Error:', error)
  }
})
