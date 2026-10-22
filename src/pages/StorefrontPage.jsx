import { useEffect, useMemo, useState } from "react";
import { supabase, whatsappLink, formatPrice } from "../lib/supabase.js";
import ProductLightbox from "../components/ProductLightbox.jsx";
import Pagination from '../components/Pagination.jsx'

export default function StorefrontPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1)
  

  useEffect(() => {
    async function load() {
      const [{ data: productData }, { data: categoryData }] = await Promise.all(
        [
          supabase
            .from("products")
            .select("*")
            .eq("active", true)
            .order("sort_order", { ascending: true }),
          supabase
            .from("categories")
            .select("*")
            .order("sort_order", { ascending: true }),
        ],
      );
      setProducts(productData || []);
      setCategories(categoryData || []);
      setLoading(false);
    }
    load();
  }, []);

  function categoryLabel(slug) {
    const found = categories.find((c) => c.slug === slug);
    return found ? found.label : slug;
  }

  const categoriesInUse = categories;

  const visibleProducts = useMemo(() => {
    if (activeCategory === "todos") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const PAGE_SIZE = 12
  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pagedProducts = visibleProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function goToPage(n) {
    setPage(n)
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <SiteHeader />
      <Hero />

      <section className="section" id="productos">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow">Catálogo</div>
            <h2>Lo que tenemos disponible esta semana</h2>
            <p>
              Precios en RD$. Toca "Pedir" y te confirmamos disponibilidad al
              instante por WhatsApp.
            </p>
          </div>

          {categoriesInUse.length > 1 && (
            <div className="filters">
              <button
                className={`filter-chip ${activeCategory === "todos" ? "active" : ""}`}
                onClick={() => { setActiveCategory('todos'); setPage(1) }}
              >
                Todos
              </button>
              {categoriesInUse.map((c) => (
                <button
                  key={c.id}
                  className={`filter-chip ${activeCategory === c.slug ? "active" : ""}`}
                  onClick={() => { setActiveCategory(c.slug); setPage(1) }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </div>
          <br/>

          {loading && (
            <p className="admin-muted" style={{ textAlign: "center" }}>
              Cargando catálogo…
            </p>
          )}

          {!loading && visibleProducts.length === 0 && (
            <p className="admin-muted" style={{ textAlign: "center" }}>
              Todavía no hay productos publicados. Vuelve pronto.
            </p>
          )}

          <div className="grid-products">
            {pagedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                categoryLabel={categoryLabel(p.category)}
                onImageClick={() => setSelectedProduct(p)}  
              />
            ))}
          </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          </div>
      </section>

      <AboutSection />
      <LocationSection />
      <SiteFooter />
      <FloatingWhatsapp />
      {selectedProduct && (
        <ProductLightbox
          product={selectedProduct}
          categoryLabel={categoryLabel(selectedProduct.category)}
          formattedPrice={formatPrice(selectedProduct.price)}
          whatsappUrl={whatsappLink(`Hola, me interesa ${selectedProduct.name} (${formatPrice(selectedProduct.price)})`)}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}

function ProductCard({ product, categoryLabel, onImageClick }) {
  const message = `Hola, me interesa ${product.name} (${formatPrice(product.price)})`;
  return (
    <div className="card">
      <div className="card-media" onClick={onImageClick}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span>🐠</span>
        )}
      </div>
      <div className="card-body">
        <div className="card-tag">{categoryLabel || product.category}</div>
        <div className="card-title">{product.name}</div>
        <div className="card-price">{formatPrice(product.price)}</div>
        <a
          className="card-cta"
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener"
        >
          <WaIcon /> Pedir
        </a>
      </div>
    </div>
  );
}

function SiteHeader() {
  return (
    <header>
      <div className="header-inner">
        <div className="brand">
          <div className="brand-mark">
            <img src="/Logo.png" alt="" />
          </div>
          <div className="brand-text">
            <div className="top">Acuariofilia</div>
            <div className="bottom">Punta Cana</div>
          </div>
        </div>
        <nav>
          <a href="#productos">Productos</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#ubicacion">Ubicación</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a
          className="btn-wa"
          href={whatsappLink("Hola, quisiera hacer un pedido")}
          target="_blank"
          rel="noopener"
        >
          <WaIcon /> Pedir ahora
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="bubbles">
        <div
          className="bubble"
          style={{ width: 60, height: 60, left: "8%", top: "20%" }}
        />
        <div
          className="bubble"
          style={{ width: 20, height: 20, left: "20%", top: "60%" }}
        />
        <div
          className="bubble"
          style={{ width: 36, height: 36, left: "78%", top: "15%" }}
        />
        <div
          className="bubble"
          style={{ width: 14, height: 14, left: "90%", top: "45%" }}
        />
        <div
          className="bubble"
          style={{ width: 44, height: 44, left: "60%", top: "70%" }}
        />
      </div>
      <div className="wrap">
        <div>
          <div className="hero-eyebrow">Tienda física · Punta Cana</div>
          <h1>Todo para tu acuario, a un mensaje de distancia</h1>
          <p className="lead">
            Peces, plantas, corales y equipos seleccionados a mano. Mira el
            catálogo y haz tu pedido directo por WhatsApp — sin registros, sin
            vueltas.
          </p>
          <div className="hero-ctas">
            <a className="btn-wa" href="#productos">
              Ver catálogo
            </a>
            <a
              className="btn-ghost"
              href={whatsappLink("Hola, tengo una consulta")}
              target="_blank"
              rel="noopener"
            >
              Hacer una pregunta
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-ring">
            <div className="hero-ring-inner">
              <img src="/Logo.png" alt="logo" className="hero-img" />
            </div>
          </div>
        </div>
      </div>
      <div className="wave-divider">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="M0,40 C240,90 480,-10 720,40 C960,90 1200,-10 1440,40 L1440,80 L0,80 Z"
            fill="#F5FAF8"
          />
        </svg>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="section about" id="nosotros">
      <div className="wrap about-grid">
        <div className="about-visual">
          <div className="ring1" />
          <div className="ring2" />
          <div className="center-mark">
            <img src="acuario.png" alt="" />
          </div>
        </div>
        <div className="about-text">
          <div className="eyebrow">Nosotros</div>
          <h2>Más que un acuario, creamos pequeños mundos. 🐠🌿</h2>
          <p>
            En Acuariofilia Punta Cana creemos que cada acuario cuenta una historia.
            <br />
            Un acuario no es simplemente agua, peces y decoración.
            <br />
             Es un pequeño ecosistema lleno de vida, capaz de transformar un espacio, crear momentos de tranquilidad y acercarnos a la belleza de la naturaleza.
            <br />
            Nacimos de una pasión genuina por el mundo acuático y de las ganas de compartirla contigo. Por eso, cada proyecto lo vemos de manera diferente: escuchamos tus ideas, conocemos tus necesidades y te ayudamos a convertirlas en un acuario que realmente disfrutes.
            <br />
            <br />
            Encontrarás una amplia variedad de peces ornamentales, cíclidos, especies marinas, plantas, alimentos, equipos, decoración y accesorios especializados. También diseñamos y fabricamos acuarios a medida, buscando siempre ese equilibrio entre belleza, funcionalidad y bienestar para sus habitantes.
            <br/>
            Y cuando el acuario ya está en casa, seguimos contigo. Ofrecemos servicios de mantenimiento y asesoría, porque sabemos que un acuario hermoso no solo se construye: se cuida, se entiende y se disfruta.
          </p>
          <p>
            🐟 Queremos conocerte, no solo venderte.
            <br/>
            Por eso no apostamos por una tienda fría de carrito y pagos automáticos. Preferimos conversar contigo directamente por WhatsApp, orientarte, confirmar la disponibilidad de lo que buscas y ayudarte a elegir lo que realmente necesitas para tu montaje.

            <br />
            <br />
              Porque detrás de cada pez hay una vida, detrás de cada acuario hay un proyecto              y detrás de cada proyecto hay una persona con una ilusión.
            <br />
            Visítanos, descubre nuevas especies, aprende algo nuevo, inspírate con nuestros acuarios y comparte una buena conversación mientras disfrutas de un café.
            <br />
            <br />
            Acuariofilia Punta Cana
            Donde la pasión por los acuarios se encuentra con la naturaleza, el café y las buenas conversaciones. ☕🐠🌿
            <br />
            Bienvenidos a nuestro mundo.
            <br />
            God bless. 🙏🐟🐢🐡🐳
          </p>
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="section location" id="ubicacion">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Visítanos</div>
          <h2>Ubicación y horario</h2>
        </div>
        <div className="loc-grid">
          <div className="loc-card">
            <h3>Información de contacto</h3>
            <div className="loc-row">
              <span className="label">Dirección</span>
              <span>Punta Cana, La Altagracia, R.D.</span>
            </div>
            <div className="loc-row">
              <span className="label">Horario</span>
              <span>Lun a Sáb, 9:00am – 6:00pm</span>
            </div>
            <div className="loc-row">
              <span className="label">Teléfono</span>
              <span>(829) 606-7351</span>
            </div>
            <a
              className="btn-wa"
              style={{ marginTop: 18, width: "100%", justifyContent: "center" }}
              href={whatsappLink("Hola")}
              target="_blank"
              rel="noopener"
            >
              <WaIcon /> Escribir por WhatsApp
            </a>
          </div>
          <div className="map-frame">
            <iframe
              id="map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d24972.26133856813!2d-68.44648588569571!3d18.68611437669562!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea891645dcbfe77%3A0x32481f2e4ce7d349!2sMGRW%2B2H%2C%2023000%20Punta%20Cana!5e0!3m2!1ses!2sdo!4v1786666217708!5m2!1ses!2sdo"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer id="contacto">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="foot-brand">
              <div className="brand-mark">
                <img src="/Logo.png" alt="" />
              </div>
              <div className="brand-text">
                <div className="top">Acuariofilia</div>
                <div className="bottom">Punta Cana</div>
              </div>
            </div>
            <p className="desc">
              Tienda física de acuarismo en Punta Cana. Catálogo, pedidos y
              asesoría directo por WhatsApp.
            </p>
          </div>
          <div>
            <h4>Navegación</h4>
            <div className="flinks">
              <a href="#productos">Productos</a>
              <a href="#nosotros">Nosotros</a>
              <a href="#ubicacion">Ubicación</a>
            </div>
          </div>
          <div>
            <h4>Contacto</h4>
            <div className="flinks">
              <a href={whatsappLink("Hola")}>(829) 606-7351</a>
              <a href="#ubicacion">Punta Cana, R.D.</a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>
            © {new Date().getFullYear()} Acuariofilia Punta Cana. Todos los
            derechos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}

function FloatingWhatsapp() {
  return (
    <a
      className="fab-wa"
      href={whatsappLink("Hola, quisiera hacer un pedido")}
      target="_blank"
      rel="noopener"
      aria-label="Pedir por WhatsApp"
    >
      <WaIcon size={28} />
    </a>
  );
}

function WaIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M17.6 6.3A8.9 8.9 0 0 0 12.1 4a9 9 0 0 0-7.8 13.5L3 21l3.6-1.3A9 9 0 0 0 21 12a9 9 0 0 0-3.4-5.7Zm-5.5 13.2a7.5 7.5 0 0 1-3.8-1l-.3-.2-2.5.9.9-2.4-.2-.3a7.5 7.5 0 1 1 13.9-4A7.5 7.5 0 0 1 12.1 19.5Z" />
    </svg>
  );
}
