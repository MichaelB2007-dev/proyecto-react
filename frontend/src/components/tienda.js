import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importar useNavigate
import "./Cart.css"; 

const productosData = [
  // ... tu array de productos tal cual
];

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate(); // 👈 Hook de navegación

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

  return (
    <div className="tienda-container">
      {/* NAVBAR */}
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
            <li onClick={() => navigate("/novedades")}>Novedades</li>
            <li onClick={() => navigate("/contact")}>Contacto</li>
          </ul>
        </div>

        <div className="nav-icons">
          <div className="nav-icon" onClick={() => navigate("/perfil")}>
            <img src="/imagenes/avatar1.png" alt="Perfil" className="perfil-img"/>
          </div>
          <div className="nav-icon" onClick={() => navigate("/cart")} title="Carrito">
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
                    <span className="precio-anterior">${producto.precioAnterior}</span>
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
    </div>
  );
};

export default Tienda;
