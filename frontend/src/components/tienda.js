import React, { useEffect, useState } from "react";
import "./tienda.css"; 

const productosData = [
  // ... tu array de productos tal cual
];

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setProductos(productosData);
    }, 1500);
  }, []);

  const filtrarProductos = () => {
    return productos.filter((p) => {
      const matchCategoria = filtro === "todos" || p.categoria === filtro;
      const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
      return matchCategoria && matchBusqueda;
    });
  };

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const totalCarrito = carrito.reduce((acc, item) => acc + item.precio, 0);

  // Usamos useNavigate para navegación como en Home
  const navigate = (path) => {
    window.location.href = path; // si no quieres usar react-router
  };

  return (
    <div className="tienda-container">
      {/* NAVBAR idéntico al de Home */}
      <nav className="navbar">
        <div className="logo">
          <img
            src="/imagenes/Logo1-removebg-preview.png"
            alt="Hype District Logo"
            className="logo-img"
          />
          <span>HYPE DISTRICT</span>
        </div>

        <div className="nav-center">
          <ul className="nav-links">
            <li onClick={() => navigate("/home")}>Inicio</li>
            <li className="active">Tienda</li>
            <li onClick={() => navigate("/novedades")}>Novedades</li>
            <li onClick={() => navigate("/contact")}>Contacto</li>
          </ul>
        </div>

        <div className="nav-icons">
          <div className="nav-icon" onClick={() => navigate("/perfil")}>
            <img src="/imagenes/avatar1.png" alt="Perfil" className="perfil-img"/>
          </div>
          <div className="nav-icon" onClick={() => setMostrarCarrito(!mostrarCarrito)} title="Carrito">
            🛒
            <span className="cart-count">{carrito.length}</span>
          </div>
          <div className="nav-icon" onClick={() => alert('Cerrar sesión')} title="Cerrar Sesión">
            🚪
          </div>
        </div>
      </nav>

      {/* HEADER TIENDA */}
      <div className="tienda-header">
        <h1 className="tienda-titulo">STREET COLLECTION</h1>
        <p className="tienda-subtitulo">
          Descubre las últimas tendencias en ropa urbana y streetwear
        </p>
      </div>

      {/* FILTROS */}
      <div className="filtros-container">
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <i className="fas fa-search"></i>
        </div>

        <div className="filtros-grupo">
          {["todos", "camisetas", "hoodies", "pantalones", "accesorios"].map(
            (cat) => (
              <button
                key={cat}
                className={`filtro-btn ${filtro === cat ? "active" : ""}`}
                onClick={() => setFiltro(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {/* GRID PRODUCTOS */}
      <div className="productos-grid">
        {productos.length === 0 ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
          </div>
        ) : filtrarProductos().length === 0 ? (
          <p style={{ color: "#fff", textAlign: "center", gridColumn: "1/-1" }}>
            No se encontraron productos
          </p>
        ) : (
          filtrarProductos().map((producto) => (
            <div className="producto-card" key={producto.id}>
              <div className="producto-imagen">
                <img src={producto.imagen} alt={producto.nombre} />
                {producto.nuevo && <span className="etiqueta-nuevo">Nuevo</span>}
                {producto.descuento && (
                  <span className="etiqueta-descuento">
                    {producto.descuento} OFF
                  </span>
                )}
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <p className="producto-categoria">{producto.categoria}</p>
                <div className="producto-precio">
                  <span className="precio-actual">${producto.precio}</span>
                  {producto.precioAnterior && (
                    <span className="precio-anterior">
                      ${producto.precioAnterior}
                    </span>
                  )}
                </div>
                <div className="producto-actions">
                  <button
                    className="btn-agregar"
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    <i className="fas fa-cart-plus"></i> Agregar
                  </button>
                  <button className="btn-ver-mas">
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CARRITO */}
      <div className={`cart-floating ${mostrarCarrito ? "show" : ""}`}>
        <div className="cart-header">
          <h3>
            <i className="fas fa-shopping-cart"></i> Mi Carrito
          </h3>
          <button className="cart-close" onClick={() => setMostrarCarrito(false)}>
            ×
          </button>
        </div>
        <div className="cart-items">
          {carrito.length === 0 ? (
            <p style={{ color: "#fff", textAlign: "center", padding: "50px 0" }}>
              Tu carrito está vacío
            </p>
          ) : (
            carrito.map((item, i) => (
              <div className="cart-item" key={i}>
                <img src={item.imagen} alt={item.nombre} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.nombre}</p>
                  <p className="cart-item-price">${item.precio}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-total">
          <div className="cart-total-price">${totalCarrito.toFixed(2)}</div>
          <button className="btn-checkout">Finalizar Compra</button>
        </div>
      </div>
    </div>
  );
};

export default Tienda;
