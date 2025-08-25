// src/components/Pago.js
import React, { useState } from 'react';
import './pagos.css';

const Pago = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    total: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Procesando pago...');

    try {
      const res = await fetch('http://localhost:5000/api/pagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          total: parseFloat(formData.total),
        }),
      });

      const data = await res.json();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setMensaje('No se pudo generar el enlace de pago.');
      }
    } catch (err) {
      console.error(err);
      setMensaje('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="contact-container">
      <h1 className="titulo-contacto">Formulario de Pago</h1>
      <p className="subtitulo-contacto">Completa los datos para proceder con tu pago</p>
      <form onSubmit={handleSubmit}>
        <div className="fila-doble">
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="fila-unica">
          <input
            type="number"
            name="total"
            placeholder="Monto a pagar (USD)"
            value={formData.total}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <button type="submit">Pagar con PayPhone</button>
        <p id="mensajePago">{mensaje}</p>
      </form>
    </div>
  );
};

export default Pago;
