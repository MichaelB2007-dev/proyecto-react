import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './tienda.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [animando, setAnimando] = useState(null);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  // CARGAR CARRITO INICIAL
  useEffect(() => {
    console.log("🛒 [CART] Iniciando Cart component");
    cargarCarritoDesdeStorage();
  }, []);

  // FUNCIÓN PARA CARGAR CARRITO DESDE LOCALSTORAGE
  const cargarCarritoDesdeStorage = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log("🔄 [CART] Cargando carrito desde localStorage:", carritoGuardado);
    setItems(carritoGuardado);
  };

  // ESCUCHAR MÚLTIPLES TIPOS DE CAMBIOS EN EL CARRITO
  useEffect(() => {
    console.log("👂 [CART] Configurando listeners para cambios en carrito");

    // 1. Listener para eventos storage
    const manejarCambioStorage = (event) => {
      console.log("📦 [CART] Storage event detectado:", event);
      if (event.key === 'carrito' || event.key === 'carritoTimestamp') {
        const carritoActualizado = JSON.parse(localStorage.getItem("carrito") || "[]");
        console.log("🔄 [CART] Actualizando desde storage event:", carritoActualizado);
        setItems(carritoActualizado);
      }
    };

    // 2. Listener para eventos personalizados
    const manejarEventoPersonalizado = (event) => {
      console.log("🎯 [CART] Evento personalizado detectado:", event.detail);
      if (event.detail && event.detail.carrito) {
        console.log("🔄 [CART] Actualizando desde evento personalizado");
        setItems(event.detail.carrito);
        
        // Mostrar mensaje específico según la acción
        if (event.detail.accion === 'agregar' && event.detail.producto) {
          mostrarMensajeCarrito(`✅ ${event.detail.producto.nombre} agregado`);
        }
      }
    };

    // 3. Polling cada segundo (backup method)
    const interval = setInterval(() => {
      const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
      const itemsActualesStr = JSON.stringify(items);
      const carritoActualStr = JSON.stringify(carritoActual);
      
      if (itemsActualesStr !== carritoActualStr) {
        console.log("🔄 [CART] Diferencia detectada via polling");
        console.log("Actual en componente:", items);
        console.log("Actual en localStorage:", carritoActual);
        setItems(carritoActual);
      }
    }, 1000);

    // 4. Listener para visibilidad de página (cuando el usuario vuelve a la pestaña)
    const manejarVisibilidad = () => {
      if (!document.hidden) {
        console.log("👁️ [CART] Página visible, verificando carrito");
        cargarCarritoDesdeStorage();
      }
    };

    // Registrar todos los listeners
    window.addEventListener('storage', manejarCambioStorage);
    window.addEventListener('carritoActualizado', manejarEventoPersonalizado);
    document.addEventListener('visibilitychange', manejarVisibilidad);

    // Cleanup
    return () => {
      window.removeEventListener('storage', manejarCambioStorage);
      window.removeEventListener('carritoActualizado', manejarEventoPersonalizado);
      document.removeEventListener('visibilitychange', manejarVisibilidad);
      clearInterval(interval);
      console.log("🧹 [CART] Limpiando listeners");
    };
  }, [items]); // Dependencia en items para el polling

  // CALCULAR TOTAL CUANDO CAMBIAN LOS ITEMS
  useEffect(() => {
    const totalCalculado = items.reduce((sum, item) => {
      const precio = parseFloat(item.precio || 0);
      return sum + precio;
    }, 0);
    
    setTotal(totalCalculado.toFixed(2));
    console.log("💰 [CART] Total calculado:", totalCalculado.toFixed(2));
  }, [items]);

  // FUNCIÓN PARA MOSTRAR MENSAJES EN EL CART
  const mostrarMensajeCarrito = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(''), 3000);
  };

  // ELIMINAR PRODUCTO DEL CARRITO
  const handleEliminar = (index) => {
    const productoEliminado = items[index];
    console.log("🗑️ [CART] Eliminando producto:", productoEliminado);
    
    setAnimando(index);
    
    setTimeout(() => {
      const nuevoCarrito = items.filter((_, i) => i !== index);
      setItems(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      
      // Disparar evento para notificar a otros componentes
      window.dispatchEvent(new CustomEvent('carritoActualizado', { 
        detail: { 
          carrito: nuevoCarrito, 
          accion: 'eliminar',
          producto: productoEliminado 
        } 
      }));
      
      setMensaje(`🗑️ ${productoEliminado.nombre} eliminado del carrito`);
      setAnimando(null);
      console.log("✅ [CART] Producto eliminado, nuevo carrito:", nuevoCarrito);
      
      setTimeout(() => setMensaje(''), 2500);
    }, 400);
  };

  // PAGAR - Redirigir a MetodoPago
  const handlePagar = () => {
    if (items.length === 0) {
      setMensaje('❌ No hay productos para pagar');
      setTimeout(() => setMensaje(''), 2500);
      return;
    }
    
    console.log("💳 [CART] Iniciando proceso de pago para:", items);
    
    // Guardar información del pedido en localStorage para MetodoPago.js
    const infoPedido = {
      productos: items,
      total: parseFloat(total),
      fecha: new Date().toISOString(),
      numeroProductos: items.length,
      subtotal: parseFloat(total),
      impuestos: (parseFloat(total) * 0.1).toFixed(2), // 10% impuestos ejemplo
      envio: parseFloat(total) >= 50 ? 0 : 5.99, // Envío gratis si es >$50
      timestamp: Date.now()
    };
    
    // Guardar el pedido en localStorage para que MetodoPago.js lo use
    localStorage.setItem("pedidoActual", JSON.stringify(infoPedido));
    
    // Mostrar mensaje de transición
    setMensaje('🔄 Redirigiendo al método de pago...');
    
    console.log("📦 [CART] Pedido guardado para pago:", infoPedido);
    
    // Redirigir a MetodoPago después de un breve delay
    setTimeout(() => {
      navigate('/MetodoPago'); // o la ruta que uses para MetodoPago.js
    }, 1000);
  };

  // VACIAR CARRITO
  const handleVaciarCarrito = () => {
    if (items.length === 0) {
      setMensaje('❌ El carrito ya está vacío');
      setTimeout(() => setMensaje(''), 2500);
      return;
    }
    
    console.log("🧹 [CART] Vaciando carrito");
    const carritoVacio = [];
    setItems(carritoVacio);
    localStorage.removeItem("carrito");
    
    // Notificar a otros componentes
    window.dispatchEvent(new CustomEvent('carritoActualizado', { 
      detail: { 
        carrito: carritoVacio, 
        accion: 'vaciar' 
      } 
    }));
    
    setMensaje('🧹 Carrito vaciado');
    setTimeout(() => setMensaje(''), 2000);
  };

  const continuarComprando = () => {
    navigate('/tienda');
  };

  // DEBUG INFO (solo en desarrollo)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔍 [CART DEBUG] Items actuales:", items);
      console.log("🔍 [CART DEBUG] LocalStorage:", localStorage.getItem("carrito"));
    }
  }, [items]);

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
          {process.env.NODE_ENV === 'development' && (
            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>
              🐛 DEBUG: LocalStorage sincronizado
            </p>
          )}
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
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            animation: 'slideInMessage 0.3s ease'
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
                background: 'linear-gradient(45deg, #007bff, #0056b3)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,123,255,0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,123,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,123,255,0.3)';
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
                  key={`${item.id}-${index}`} // Clave única mejorada
                  className={`carrito-item ${animando === index ? 'eliminando' : ''}`}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease'
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
                        console.log("❌ [CART] Error cargando imagen:", item.imagen);
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
                    
                    {/* Info de debug en desarrollo */}
                    {process.env.NODE_ENV === 'development' && (
                      <p style={{ 
                        fontSize: '10px', 
                        color: '#666', 
                        margin: '5px 0 0 0' 
                      }}>
                        ID: {item.id} | Agregado: {item.fechaAgregado ? new Date(item.fechaAgregado).toLocaleTimeString() : 'N/A'}
                      </p>
                    )}
                  </div>

                  {/* Botón eliminar */}
                  <button 
                    className="btn-eliminar" 
                    onClick={() => handleEliminar(index)}
                    style={{
                      background: 'linear-gradient(45deg, #dc3545, #c82333)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(220,53,69,0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 4px 12px rgba(220,53,69,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 2px 8px rgba(220,53,69,0.3)';
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
                marginBottom: '25px',
                padding: '15px',
                background: 'rgba(40,167,69,0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(40,167,69,0.3)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>💰</span>
                  Total:
                </span>
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
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '150px',
                    boxShadow: '0 4px 15px rgba(40,167,69,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(40,167,69,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(40,167,69,0.3)';
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
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '150px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#007bff';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#007bff';
                    e.target.style.transform = 'translateY(0)';
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
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(220,53,69,0.1)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'translateY(0)';
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
              <h5 style={{ 
                color: '#007bff', 
                margin: '0 0 8px 0', 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>ℹ️</span>
                Información del pedido:
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
                <li>Soporte 24/7 disponible</li>
              </ul>
            </div>

            {/* Productos recomendados */}
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: 'rgba(40,167,69,0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(40,167,69,0.2)',
              textAlign: 'center'
            }}>
              <h5 style={{ 
                color: '#28a745', 
                margin: '0 0 8px 0', 
                fontSize: '14px'
              }}>
                💡 ¿Te gustaron estos productos?
              </h5>
              <p style={{ 
                color: '#ccc', 
                fontSize: '12px', 
                margin: '5px 0 10px 0'
              }}>
                Descubre más productos similares en nuestra tienda
              </p>
              <button 
                onClick={() => navigate('/tienda')}
                style={{
                  background: 'rgba(40,167,69,0.2)',
                  color: '#28a745',
                  border: '1px solid rgba(40,167,69,0.5)',
                  padding: '8px 16px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(40,167,69,0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(40,167,69,0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Ver más productos
              </button>
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
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-100%) scale(0.8);
          }
        }

        @keyframes slideInMessage {
          from { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
        }

        .carrito-item:hover {
          background: rgba(255,255,255,0.12) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .btn-eliminar:active {
          transform: scale(0.95) !important;
        }

        .btn-pagar:active,
        .carrito-botones button:active {
          transform: scale(0.98) !important;
        }
      `}</style>
    </div>
  );
};

export default Cart;