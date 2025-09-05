// Tienda.js - VERSIÓN MEJORADA
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./tienda.css"; 

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
    console.log("🔄 [TIENDA] Cargando carrito desde storage:", carritoGuardado);
    setCarrito(carritoGuardado);
  };

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:3001/api/productos');
      const data = await response.json();
      
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
        console.log("✅ [TIENDA] Productos cargados:", productosFormateados.length);
      } else {
        console.log('❌ [TIENDA] No se encontraron productos');
        setProductos([]);
      }
    } catch (error) {
      console.error('❌ [TIENDA] Error al cargar productos:', error);
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

  // AGREGAR AL CARRITO (VERSIÓN MEJORADA)
  const agregarAlCarrito = (producto) => {
    console.log("🛍️ [TIENDA] Agregando producto:", producto);
    
    // Obtener carrito actual desde localStorage
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log("📦 [TIENDA] Carrito actual:", carritoActual);
    
    // Crear objeto del producto para el carrito con formato consistente
    const productoParaCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio.toString(), // Cart.js espera string
      imagen: producto.imagen,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria || 'otros',
      fechaAgregado: new Date().toISOString() // Para debugging
    };
    
    // Agregar producto al carrito
    const nuevoCarrito = [...carritoActual, productoParaCarrito];
    console.log("✅ [TIENDA] Nuevo carrito:", nuevoCarrito);
    
    // Guardar en localStorage
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    
    // Actualizar estado local
    setCarrito(nuevoCarrito);
    
    // Mostrar mensaje de confirmación
    mostrarMensajeConfirmacion(producto.nombre);
    
    // MÚLTIPLES FORMAS DE NOTIFICAR AL CART.JS
    
    // 1. Evento storage personalizado
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'carrito',
      newValue: JSON.stringify(nuevoCarrito),
      oldValue: JSON.stringify(carritoActual),
      url: window.location.href,
      storageArea: localStorage
    }));
    
    // 2. Evento personalizado
    window.dispatchEvent(new CustomEvent('carritoActualizado', { 
      detail: { 
        carrito: nuevoCarrito, 
        accion: 'agregar',
        producto: productoParaCarrito 
      } 
    }));
    
    // 3. Forzar re-render mediante cambio en localStorage con timestamp
    localStorage.setItem("carritoTimestamp", Date.now().toString());
    
    console.log("📢 [TIENDA] Eventos disparados para notificar al Cart");
  };

  // MOSTRAR MENSAJE DE CONFIRMACIÓN
  const mostrarMensajeConfirmacion = (nombreProducto) => {
    // Remover mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-confirmacion-tienda');
    if (mensajeAnterior) {
      document.body.removeChild(mensajeAnterior);
    }

    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-confirmacion-tienda';
    mensaje.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #28a745, #20c997);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(40,167,69,0.4);
        animation: slideInConfirm 0.3s ease;
        border-left: 4px solid #fff;
      ">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">✅</span>
          <div>
            <div>${nombreProducto}</div>
            <div style="font-size: 12px; opacity: 0.9;">agregado al carrito</div>
          </div>
        </div>
      </div>
    `;
    
    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInConfirm {
        from { 
          transform: translateX(100%) scale(0.8); 
          opacity: 0; 
        }
        to { 
          transform: translateX(0) scale(1); 
          opacity: 1; 
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(mensaje);
    
    // Remover mensaje después de 3 segundos
    setTimeout(() => {
      if (document.body.contains(mensaje)) {
        mensaje.style.animation = 'slideInConfirm 0.3s ease reverse';
        setTimeout(() => {
          if (document.body.contains(mensaje)) {
            document.body.removeChild(mensaje);
          }
        }, 300);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    }, 3000);
  };

  // ESCUCHAR CAMBIOS EN EL CARRITO (para mantener sincronización)
  useEffect(() => {
    const manejarCambioCarrito = (event) => {
      if (event.detail && event.detail.carrito) {
        console.log("🔄 [TIENDA] Carrito actualizado desde otro componente");
        setCarrito(event.detail.carrito);
      }
    };

    window.addEventListener('carritoActualizado', manejarCambioCarrito);
    
    return () => {
      window.removeEventListener('carritoActualizado', manejarCambioCarrito);
    };
  }, []);

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
          {carrito.length > 0 && (
            <span style={{ marginLeft: '20px', background: 'rgba(40,167,69,0.3)', padding: '4px 8px', borderRadius: '12px' }}>
              🛒 {carrito.length} en carrito
            </span>
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
                    style={{
                      position: 'relative',
                      overflow: 'hidden'
                    }}
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

      {/* INFORMACIÓN DEL CARRITO FLOTANTE */}
      {carrito.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'linear-gradient(45deg, #28a745, #20c997)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 6px 20px rgba(40,167,69,0.4)',
          zIndex: 1000,
          cursor: 'pointer',
          border: '2px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite'
        }}
        onClick={() => navigate("/cart")}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 8px 25px rgba(40,167,69,0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 6px 20px rgba(40,167,69,0.4)';
        }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🛒</span>
            <div>
              <div>{carrito.length} productos</div>
              <div style={{ fontSize: '16px', opacity: '0.9' }}>
                Total: ${totalCarrito.toFixed(2)}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '10px', opacity: '0.8', marginTop: '4px' }}>
            Click para ir al carrito →
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 6px 20px rgba(40,167,69,0.4); }
          50% { box-shadow: 0 6px 20px rgba(40,167,69,0.6); }
          100% { box-shadow: 0 6px 20px rgba(40,167,69,0.4); }
        }
      `}</style>
    </div>
  );
};

export default Tienda;