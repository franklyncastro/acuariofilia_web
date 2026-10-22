function getPageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('…')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('…')
  pages.push(total)
  return pages
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination" role="navigation" aria-label="Paginación de productos">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹‹ Anterior
      </button>

      <div className="pagination-numbers">
        {getPageList(currentPage, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="pagination-gap">…</span>
          ) : (
            <button
              key={p}
              className={`pagination-btn ${p === currentPage ? 'active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
      </div>

      <span className="pagination-status">Página {currentPage} de {totalPages}</span>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente ››
      </button>
    </div>
  )
}