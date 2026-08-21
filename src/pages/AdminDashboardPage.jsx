import { useEffect, useState } from 'react'
import { supabase, formatPrice } from '../lib/supabase.js'
import ProductFormModal from '../components/ProductFormModal.jsx'
import CategoryManagerModal from '../components/CategoryManagerModal.jsx'

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  async function loadProducts() {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })
    if (fetchError) {
      setError('No se pudieron cargar los productos.')
    } else {
      setProducts(data)
      setError('')
    }
    setLoading(false)
  }

  async function loadCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    setCategories(data || [])
  }

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  function categoryLabel(slug) {
    const found = categories.find((c) => c.slug === slug)
    return found ? found.label : slug
  }

  function openNew() {
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(product) {
    setEditing(product)
    setShowForm(true)
  }

  async function toggleActive(product) {
    await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id)
    loadProducts()
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)
    if (!confirmed) return
    await supabase.from('products').delete().eq('id', product.id)
    loadProducts()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-title">Panel de administración</div>
        <div className="admin-topbar-actions">
          <a href="/" target="_blank" rel="noopener">Ver sitio público ↗</a>
          <button className="btn-ghost-admin" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-main-head">
          <div>
            <h1>Productos</h1>
            <p>{products.length} producto{products.length !== 1 ? 's' : ''} en total</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost-admin" onClick={() => setShowCategories(true)}>Categorías</button>
            <button className="btn-primary" onClick={openNew}>+ Agregar producto</button>
          </div>
        </div>

        {error && <div className="admin-error">{error}</div>}
        {loading && <div className="admin-loading">Cargando…</div>}

        {!loading && products.length === 0 && (
          <div className="admin-empty">
            Todavía no hay productos. Agrega el primero para que aparezca en la página pública.
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="admin-thumb">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} />
                        ) : (
                          <span>Sin foto</span>
                        )}
                      </div>
                    </td>
                    <td className="admin-name-cell">{p.name}</td>
                    <td className="admin-muted">{categoryLabel(p.category)}</td>
                    <td>{formatPrice(p.price)}</td>
                    <td>
                      <button
                        className={`status-pill ${p.active ? 'is-active' : 'is-inactive'}`}
                        onClick={() => toggleActive(p)}
                        title="Clic para cambiar"
                      >
                        {p.active ? 'Visible' : 'Oculto'}
                      </button>
                    </td>
                    <td className="admin-row-actions">
                      <button className="btn-ghost-admin" onClick={() => openEdit(p)}>Editar</button>
                      <button className="btn-danger-admin" onClick={() => handleDelete(p)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showForm && (
        <ProductFormModal
          product={editing}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false)
            loadProducts()
          }}
        />
      )}

      {showCategories && (
        <CategoryManagerModal
          categories={categories}
          onClose={() => setShowCategories(false)}
          onChanged={loadCategories}
        />
      )}
    </div>
  )
}
