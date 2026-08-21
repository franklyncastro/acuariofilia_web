import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function ProductFormModal({ product, categories, onClose, onSaved }) {
  const isEditing = Boolean(product)
  const [name, setName] = useState(product?.name || '')
  const [price, setPrice] = useState(product?.price ?? '')
  const [category, setCategory] = useState(product?.category || categories[0]?.slug || '')
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(product?.image_url || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    const priceNumber = Number(price)
    if (!price || Number.isNaN(priceNumber) || priceNumber <= 0) {
      setError('Ingresa un precio válido.')
      return
    }

    setSaving(true)
    let finalImageUrl = imageUrl

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, imageFile)
      if (uploadError) {
        setSaving(false)
        setError('No se pudo subir la imagen. Intenta de nuevo.')
        return
      }
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(path)
      finalImageUrl = publicUrlData.publicUrl
    }

    const payload = {
      name: name.trim(),
      price: priceNumber,
      category,
      image_url: finalImageUrl || null,
    }

    const { error: saveError } = isEditing
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert(payload)

    setSaving(false)

    if (saveError) {
      setError('No se pudo guardar el producto.')
      return
    }
    onSaved()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{isEditing ? 'Editar producto' : 'Agregar producto'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="field">
            <span>Nombre del producto</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Betta macho premium"
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Precio (RD$)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="850"
              />
            </label>

            <label className="field">
              <span>Categoría</span>
              {categories.length === 0 ? (
                <div className="admin-muted" style={{ fontSize: 13 }}>
                  No hay categorías todavía — crea una primero desde "Categorías".
                </div>
              ) : (
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.label}</option>
                  ))}
                </select>
              )}
            </label>
          </div>

          <label className="field">
            <span>Foto del producto</span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          {preview && (
            <div className="modal-preview">
              <img src={preview} alt="Vista previa" />
            </div>
          )}

          {error && <div className="admin-error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-ghost-admin" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Agregar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
