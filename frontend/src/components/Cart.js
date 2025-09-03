import React, { useState, useEffect } from 'react';
import './tienda.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [animando, setAnimando] = useState(null);
  const [total, setTotal] = useState(0);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setItems(carritoGuardado);
  }, []);

  useEffect(() => {
    const totalCalculado = items.reduce((sum, item) => sum + parseFloat(item.precio), 0);
    setTotal(totalCalculado.toFixed(2));
    // Guardar cambios en localStorage
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  const handleEliminar = (index) => {
    setAnimando(index);
    setTimeout(() => {
      const nuevoCarrito = [...items];
      nuevoCarrito.splice(index, 1);
      setItems(nuevoCarrito);
      setMensaje('🗑️ Producto eliminado del carrito');
      setAnimando(null);
      setTimeout(() => setMensaje(''), 2500);
    }, 400);
  };

  const handlePagar = () => {
    if (items.length === 0) {
      setMensaje('❌ No hay productos para pagar');
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
      return;
    }
    setItems([]);
    localStorage.removeItem("carrito");
    setMensaje('🧹 Carrito vaciado');
    setTimeout(() => setMensaje(''), 2000);
  };

  return (
    <div className="carrito-box">
      <h2>🛒 Carrito de Compras</h2>

      {mensaje && <div className="mensaje-flotante">{mensaje}</div>}

      {items.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {items.map((item, index) => (
              <li
                key={index}
                className={`carrito-item ${animando === index ? 'eliminando' : ''}`}
              >
                <span>{item.nombre} - ${parseFloat(item.precio).toFixed(2)}</span>
                <button className="btn-eliminar" onClick={() => handleEliminar(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="carrito-total">
            <strong>Total:</strong> ${total}
          </div>

          <div className="carrito-botones">
            <button className="btn-pagar" onClick={handlePagar}>Pagar ahora</button>
            <button className="btn-vaciar" onClick={handleVaciarCarrito}>Vaciar carrito</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
