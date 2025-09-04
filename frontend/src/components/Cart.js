import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './tienda.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [animando, setAnimando] = useState(null);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // DEBUG: Ver qué hay en localStorage
  useEffect(() => {
    console.log("🛒 Carrito en localStorage:", localStorage.getItem("carrito"));
    console.log("🛒 Carrito parseado:", JSON.parse(localStorage.getItem("carrito") || "[]"));
  }, []);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log("🔄 Cargando carrito:", carritoGuardado);
    setItems(carritoGuardado);
  }, []);

  // Escuchar cambios en localStorage (cuando se agregan productos desde tienda)
  useEffect(() => {
    const manejarCambioStorage = () => {
      const carritoActualizado = JSON.parse(localStorage.getItem("carrito") || "[]");
      console.log("📦 Storage cambió, nuevo carrito:", carritoActualizado);
      setItems(carritoActualizado);
    };

    window.addEventListener('storage', manejarCambioStorage);
    
    // También revisar cada segundo (backup)
    const interval = setInterval(() => {
      const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
      if (JSON.stringify(carritoActual) !== JSON.stringify(items)) {
        console.log("🔄 Actualizando carrito desde storage");
        setItems(carritoActual);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', manejarCambioStorage);
      clearInterval(interval);
    };
  }, [items]);

  useEffect(() => {
    const totalCalculado = items.reduce((sum, item) => sum + parseFloat(item.precio || 0), 0);
    setTotal(totalCalculado.toFixed(2));
    
    // Solo guardar si hay cambios reales
    const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
    if (JSON.stringify(carritoActual) !== JSON.stringify(items)) {
      localStorage.setItem("carrito", JSON.stringify(items));
    }
  }, [items]);

  const handleEliminar = (index) => {
    setAnimando(index);
    setTimeout(() => {
      const nuevoCarrito = [...items];
      nuevoCarrito.splice(index, 1);
      setItems(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      setMensaje('🗑️ Producto eliminado del carrito');
      setAnimando(null);
      setTimeout(() => setMensaje(''), 2500);
    }, 400);
  };

  const handlePagar = () => {
    if (items.length === 0) {
      setMensaje('❌ No hay productos para pagar');
      setTimeout(() => setMensaje(''), 2500);
      return;
    }
    setMensaje('✅ ¡Compra realizada con éxito!');
    setTimeout(() => {
      setItems([]);
      localStorage.removeItem("carrito");
      setMensaje('');
    }, 2000);
  };

  const handleVaciarCarrito = () => {
    if (items.length === 0) {
      setMensaje('❌ El carrito ya está vacío');
      setTimeout(() => setMensaje(''), 2500);
      return;
    }
    setItems([]);
    localStorage.removeItem("carrito");
    setMensaje('🧹 Carrito vaciado');
    setTimeout(() => setMensaje(''), 2000);
  };

  const continuarComprando = () => {
    navigate('/tienda');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      padding: '20px'
    }}>
      <div className="carrito-box" style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        padding: '30px',
        color: '#fff'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: '0', fontSize: '2rem' }}>🛒 Carrito de Compras</h2>
          <p style={{ color: '#ccc', margin: '10px 0' }}>
            {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        {mensaje && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: mensaje.includes('❌') ? '#dc3545' : '#28a745',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            zIndex: 10000,
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }} className="mensaje-flotante">
            {mensaje}
          </div>
        )}

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
            <h3>Tu carrito está vacío</h3>
            <p style={{ color: '#ccc', margin: '10px 0 30px 0' }}>
              Agrega algunos productos increíbles desde nuestra tienda
            </p>
            <button 
              onClick={continuarComprando}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🛍️ Ir a la Tienda
            </button>
          </div>
        ) : (
          <>
            <ul className="carrito-lista" style={{ listStyle: 'none', padding: '0' }}>
              {items.map((item, index) => (
                <li
                  key={index}
                  className={`carrito-item ${animando === index ? 'eliminando' : ''}`}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Imagen del producto */}
                  <div style={{ flexShrink: 0 }}>
                    <img 
                      src={item.imagen || '/imagenes/placeholder.jpg'} 
                      alt={item.nombre}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '2px solid rgba(255,255,255,0.1)'
                      }}
                      onError={(e) => {
                        e.target.src = '/imagenes/placeholder.jpg';
                      }}
                    />
                  </div>

                  {/* Información del producto */}
                  <div style={{ flex: '1' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#fff' }}>
                      {item.nombre}
                    </h4>
                    {item.categoria && (
                      <p style={{ 
                        margin: '0 0 5px 0', 
                        color: '#ccc', 
                        fontSize: '0.9rem',
                        textTransform: 'capitalize'
                      }}>
                        📂 {item.categoria}
                      </p>
                    )}
                    {item.descripcion && (
                      <p style={{ 
                        margin: '0 0 5px 0', 
                        color: '#999', 
                        fontSize: '0.8rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.descripcion}
                      </p>
                    )}
                    <p style={{ 
                      margin: '0', 
                      fontSize: '1.2rem', 
                      fontWeight: 'bold',
                      color: '#28a745'
                    }}>
                      ${parseFloat(item.precio || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Botón eliminar */}
                  <button 
                    className="btn-eliminar" 
                    onClick={() => handleEliminar(index)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </li>
              ))}
            </ul>

            <div style={{
              borderTop: '2px solid rgba(255,255,255,0.2)',
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              <div className="carrito-total" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '25px'
              }}>
                <span>💰 Total:</span>
                <span style={{ color: '#28a745' }}>${total}</span>
              </div>

              <div className="carrito-botones" style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap'
              }}>
                <button 
                  className="btn-pagar" 
                  onClick={handlePagar}
                  style={{
                    flex: '1',
                    background: 'linear-gradient(45deg, #28a745, #20c997)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 25px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '150px'
                  }}
                >
                  💳 Pagar ahora
                </button>

                <button 
                  onClick={continuarComprando}
                  style={{
                    background: 'transparent',
                    color: '#007bff',
                    border: '2px solid #007bff',
                    padding: '15px 25px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '150px'
                  }}
                >
                  🛍️ Seguir comprando
                </button>

                <button 
                  className="btn-vaciar" 
                  onClick={handleVaciarCarrito}
                  style={{
                    background: 'transparent',
                    color: '#dc3545',
                    border: '1px solid #dc3545',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  🧹 Vaciar carrito
                </button>
              </div>
            </div>

            {/* Información adicional */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(0, 123, 255, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(0, 123, 255, 0.2)'
            }}>
              <h5 style={{ color: '#007bff', margin: '0 0 8px 0', fontSize: '14px' }}>
                ℹ️ Información del pedido:
              </h5>
              <ul style={{ 
                color: '#ccc', 
                fontSize: '12px', 
                margin: '0',
                paddingLeft: '15px'
              }}>
                <li>Envío gratis en compras superiores a $50</li>
                <li>Entrega estimada: 2-3 días hábiles</li>
                <li>Pago seguro garantizado</li>
              </ul>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .eliminando {
          animation: fadeOut 0.4s ease forwards;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;