import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css"; 

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();

  // CARGAR PRODUCTOS DESDE LA BASE DE DATOS
  useEffect(() => {
    cargarProductos();
    cargarCarritoDesdeStorage();
  }, []);

  // CARGAR CARRITO DESDE LOCALSTORAGE
  const cargarCarritoDesdeStorage = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  };

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:3001/api/productos');
      const data = await response.json();
      setProductos(data.productos || []);

      if (data.success && data.productos) {
        // Transformar productos de la BD al formato que espera la tienda
        const productosFormateados = data.productos.map(producto => ({
          id: producto.id,
          nombre: producto.nombre,
          precio: parseFloat(producto.precio),
          descripcion: producto.descripcion,
          imagen: producto.imagen ? `http://localhost:3001/uploads/${producto.imagen}` : '/imagenes/placeholder.jpg',
          categoria: determinarCategoria(producto.nombre),
          nuevo: esProductoNuevo(producto.created_at),
          fechaCreacion: producto.created_at
        }));
        
        setProductos(productosFormateados);
        setProductosOriginales(productosFormateados);
      } else {
        console.log('No se encontraron productos');
        setProductos([]);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  // FUNCIÓN PARA DETERMINAR CATEGORÍA BASADA EN EL NOMBRE
  const determinarCategoria = (nombre) => {
    const nombreLower = nombre.toLowerCase();
    
    if (nombreLower.includes('camiseta') || nombreLower.includes('camisa') || nombreLower.includes('playera')) {
      return 'camisetas';
    } else if (nombreLower.includes('hoodie') || nombreLower.includes('sudadera') || nombreLower.includes('buzo')) {
      return 'hoodies';
    } else if (nombreLower.includes('pantalón') || nombreLower.includes('jeans') || nombreLower.includes('short')) {
      return 'pantalones';
    } else if (nombreLower.includes('gorra') || nombreLower.includes('bolsa') || nombreLower.includes('collar') || nombreLower.includes('pulsera')) {
      return 'accesorios';
    } else {
      return 'otros';
    }
  };

  // FUNCIÓN PARA VERIFICAR SI UN PRODUCTO ES NUEVO
  const esProductoNuevo = (fechaCreacion) => {
    const fechaProducto = new Date(fechaCreacion);
    const fechaActual = new Date();
    const diferenciaDias = Math.ceil((fechaActual - fechaProducto) / (1000 * 60 * 60 * 24));
    return diferenciaDias <= 7;
  };

  // FILTRAR PRODUCTOS
  const filtrarProductos = () => {
    return productos.filter((p) => {
      const matchCategoria = filtro === "todos" || p.categoria === filtro;
      const matchBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                           p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
      return matchCategoria && matchBusqueda;
    });
  };

  // AGREGAR AL CARRITO (VERSIÓN CORREGIDA)
  const agregarAlCarrito = (producto) => {
    // Obtener carrito actual desde localStorage
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    
    // Crear objeto del producto para el carrito (formato completo)
    const productoParaCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio.toString(), // cart.js espera string
      imagen: producto.imagen,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || 'otros'
    };
    
    // DEBUG
    console.log("Producto agregado:", productoParaCarrito);
    
    // Agregar producto al carrito
    const nuevoCarrito = [...carritoActual, productoParaCarrito];
    
    // DEBUG
    console.log("Carrito actualizado:", nuevoCarrito);
    
    // Guardar en localStorage
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    
    // Actualizar estado local
    setCarrito(nuevoCarrito);
    
    // Mostrar mensaje de confirmación
    mostrarMensajeConfirmacion(producto.nombre);
    
    // FORZAR ACTUALIZACIÓN EN CART.JS
    window.dispatchEvent(new Event('storage'));
  };

  // MOSTRAR MENSAJE DE CONFIRMACIÓN
  const mostrarMensajeConfirmacion = (nombreProducto) => {
    const mensaje = document.createElement('div');
    mensaje.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
      ">
        ${nombreProducto} agregado al carrito
      </div>
    `;
    
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(mensaje);
    
    // Remover mensaje después de 3 segundos
    setTimeout(() => {
      if (document.body.contains(mensaje)) {
        document.body.removeChild(mensaje);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    }, 3000);
  };

  // TOTAL DEL CARRITO
  const totalCarrito = carrito.reduce((acc, item) => acc + parseFloat(item.precio || 0), 0);

  // RECARGAR PRODUCTOS
  const recargarProductos = () => {
    cargarProductos();
    cargarCarritoDesdeStorage();
  };

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
        <div style={{ color: '#fff', fontSize: '14px', marginTop: '10px' }}>
          {productos.length > 0 && (
            <span>{productos.length} productos disponibles</span>
          )}
        </div>
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
          {["todos", "camisetas", "hoodies", "pantalones", "accesorios", "otros"].map(
            (cat) => (
              <button
                key={cat}
                className={`filtro-btn ${filtro === cat ? "active" : ""}`}
                onClick={() => setFiltro(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                <span style={{ marginLeft: '5px', fontSize: '12px', opacity: '0.8' }}>
                  ({cat === 'todos' ? productos.length : productos.filter(p => p.categoria === cat).length})
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* GRID PRODUCTOS */}
      <div className="productos-grid">
        {cargando ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando productos desde la tienda...</p>
          </div>
        ) : productos.length === 0 ? (
          <div style={{ 
            gridColumn: "1/-1", 
            textAlign: "center", 
            color: "#fff",
            padding: "40px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            margin: "20px"
          }}>
            <h3>No hay productos en la tienda</h3>
            <p>Los productos que agregues desde el dashboard aparecerán aquí</p>
            <button 
              onClick={recargarProductos}
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Actualizar
            </button>
          </div>
        ) : filtrarProductos().length === 0 ? (
          <div style={{ 
            gridColumn: "1/-1", 
            textAlign: "center", 
            color: "#fff",
            padding: "20px"
          }}>
            <p>No se encontraron productos con el filtro "{filtro}" y búsqueda "{busqueda}"</p>
            <button 
              onClick={() => {setFiltro("todos"); setBusqueda("");}}
              style={{
                background: "#28a745",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          filtrarProductos().map((producto) => (
            <div className="producto-card" key={producto.id}>
              <div className="producto-imagen">
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.src = '/imagenes/placeholder.jpg';
                  }}
                />
                {producto.nuevo && <span className="etiqueta-nuevo">Nuevo</span>}
                {producto.descuento && (
                  <span className="etiqueta-descuento">
                    {producto.descuento} OFF
                  </span>
                )}
              </div>
              <div className="producto-info">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <p className="producto-categoria">
                  {producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}
                </p>
                {producto.descripcion && (
                  <p className="producto-descripcion" style={{
                    fontSize: '12px',
                    color: '#ccc',
                    margin: '5px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {producto.descripcion}
                  </p>
                )}
                <div className="producto-precio">
                  <span className="precio-actual">${producto.precio.toFixed(2)}</span>
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
                  <button 
                    className="btn-ver-mas"
                    onClick={() => alert(`Detalles de: ${producto.nombre}\nPrecio: $${producto.precio}\n${producto.descripcion || 'Sin descripción'}`)}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                </div>
              </div>
              
              <div style={{ 
                fontSize: '10px', 
                color: '#999', 
                padding: '5px',
                borderTop: '1px solid #333'
              }}>
                ID: {producto.id} | Agregado: {new Date(producto.fechaCreacion).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* INFORMACIÓN DEL CARRITO */}
      {carrito.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#28a745',
          color: 'white',
          padding: '12px 18px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={() => navigate("/cart")}
        >
          🛒 {carrito.length} productos | Total: ${totalCarrito.toFixed(2)}
          <div style={{ fontSize: '10px', opacity: '0.9' }}>
            Click para ir al carrito →
          </div>
        </div>
      )}
    </div>
  );
};

export default Tienda;