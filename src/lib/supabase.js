import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y completa tus datos.'
  )
}

export const supabase = createClient(url, anonKey)

export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '18095551234'

export function whatsappLink(message) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

export function formatPrice(value) {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0,
  }).format(value)
}
