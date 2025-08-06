import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = ({ items, removeFromCart, clearCart }) => {
  const [mensaje, setMensaje] = useState('');
  const [animando, setAnimando] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const totalCalculado = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    setTotal(totalCalculado.toFixed(2));
  }, [items]);

  const handleEliminar = (index) => {
    setAnimando(index);
    setTimeout(() => {
      removeFromCart(index);
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
      clearCart(); // limpia el carrito después del pago
      setMensaje('');
    }, 2000);
  };

  const handleVaciarCarrito = () => {
    if (items.length === 0) {
      setMensaje('❌ El carrito ya está vacío');
      return;
    }
    clearCart();
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
                <span>{item.name} - ${parseFloat(item.price).toFixed(2)}</span>
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
