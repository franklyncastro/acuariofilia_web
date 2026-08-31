import { useEffect } from "react";

export default function ProductLightbox({
  product,
  categoryLabel,
  whatsappUrl,
  formattedPrice,
  onClose,
}) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Cerrar">
        ×
      </button>

      <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-media">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <span className="lightbox-media-fallback">🐠</span>
          )}
        </div>

        <div className="lightbox-info">
          <div className="lightbox-tag">
            {categoryLabel || product.category}
          </div>
          <h3 className="lightbox-title">{product.name}</h3>
          <div className="lightbox-price">{formattedPrice}</div>
          <a
            className="btn-wa lightbox-cta"
            href={whatsappUrl}
            target="_blank"
            rel="noopener"
          >
            <WaIcon /> Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
      <path d="M17.6 6.3A8.9 8.9 0 0 0 12.1 4a9 9 0 0 0-7.8 13.5L3 21l3.6-1.3A9 9 0 0 0 21 12a9 9 0 0 0-3.4-5.7Zm-5.5 13.2a7.5 7.5 0 0 1-3.8-1l-.3-.2-2.5.9.9-2.4-.2-.3a7.5 7.5 0 1 1 13.9-4A7.5 7.5 0 0 1 12.1 19.5Z" />
    </svg>
  );
}
