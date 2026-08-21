import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function CategoryManagerModal({ categories, onClose, onChanged }) {
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingLabel, setEditingLabel] = useState('')

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    const trimmed = label.trim()
    if (!trimmed) {
      setError('Escribe un nombre para la categoría.')
      return
    }
    const slug = slugify(trimmed)
    if (!slug) {
      setError('Ese nombre no es válido.')
      return
    }
    if (categories.some((c) => c.slug === slug)) {
      setError('Ya existe una categoría con ese nombre.')
      return
    }
    setSaving(true)
    const nextOrder = categories.length
      ? Math.max(...categories.map((c) => c.sort_order)) + 1
      : 1
    const { error: insertError } = await supabase
      .from('categories')
      .insert({ slug, label: trimmed, sort_order: nextOrder })
    setSaving(false)
    if (insertError) {
      setError('No se pudo crear la categoría.')
      return
    }
    setLabel('')
    onChanged()
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditingLabel(cat.label)
    setError('')
  }

  async function saveEdit(cat) {
    const trimmed = editingLabel.trim()
    if (!trimmed) return
    const { error: updateError } = await supabase
      .from('categories')
      .update({ label: trimmed })
      .eq('id', cat.id)
    if (updateError) {
      setError('No se pudo actualizar la categoría.')
      return
    }
    setEditingId(null)
    onChanged()
  }

  async function handleDelete(cat) {
    const confirmed = window.confirm(
      `¿Eliminar la categoría "${cat.label}"? Los productos que la tengan asignada no se borran, pero quedarán sin categoría válida hasta que los edites.`
    )
    if (!confirmed) return
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', cat.id)
    if (deleteError) {
      setError('No se pudo eliminar la categoría.')
      return
    }
    onChanged()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Categorías</h2>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <div className="modal-form">
          <form onSubmit={handleAdd} className="field-row" style={{ alignItems: 'flex-end' }}>
            <label className="field" style={{ flex: 1 }}>
              <span>Nueva categoría</span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ej. Corales"
              />
            </label>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Agregando…' : 'Agregar'}
            </button>
          </form>

          {error && <div className="admin-error">{error}</div>}

          <div className="admin-table-wrap" style={{ marginTop: 4 }}>
            <table className="admin-table">
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="admin-name-cell">
                      {editingId === cat.id ? (
                        <input
                          type="text"
                          value={editingLabel}
                          onChange={(e) => setEditingLabel(e.target.value)}
                          style={{ border: '1px solid var(--line)', borderRadius: 8, padding: '6px 8px', fontSize: 14 }}
                        />
                      ) : (
                        cat.label
                      )}
                    </td>
                    <td className="admin-row-actions">
                      {editingId === cat.id ? (
                        <>
                          <button className="btn-primary" onClick={() => saveEdit(cat)}>Guardar</button>
                          <button className="btn-ghost-admin" onClick={() => setEditingId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <button className="btn-ghost-admin" onClick={() => startEdit(cat)}>Editar</button>
                          <button className="btn-danger-admin" onClick={() => handleDelete(cat)}>Eliminar</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={2} className="admin-muted" style={{ textAlign: 'center', padding: 20 }}>
                      Todavía no hay categorías.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
