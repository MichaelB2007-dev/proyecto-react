import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./metodoPago.css";

function MetodoPago() {
  const [metodo, setMetodo] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pedidoInfo, setPedidoInfo] = useState(null);
  const [procesandoPago, setProcesandoPago] = useState(false);

  const navigate = useNavigate();

  // Cargar información del pedido desde localStorage
  useEffect(() => {
    const pedido = JSON.parse(localStorage.getItem("pedidoActual"));
    if (pedido) {
      setPedidoInfo(pedido);
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  const datosPago = {
    "Banco Pichincha": { descripcion: "Transferencia bancaria a la siguiente cuenta:", cuenta: "Cuenta Corriente: 2200154789", titular: "Juan Pérez", cedula: "Cédula: 0102030405", imagen: "/imagenes/BancoPichincha.png", tipo: "transferencia", comision: 0 },
    "De Una": { descripcion: "Pago rápido a través de la app De Una:", cuenta: "Número de cuenta: 0998765432", titular: "Maria Gómez", cedula: "Cédula: 1102030405", imagen: "/imagenes/DeUna!.png", tipo: "transferencia", comision: 0 },
    "Produbanco": { descripcion: "Transferencia a Produbanco:", cuenta: "Cuenta Ahorros: 4567891230", titular: "Carlos Torres", cedula: "Cédula: 1702030405", imagen: "/imagenes/Produbanco.png", tipo: "transferencia", comision: 0 },
    "Efectivo": { descripcion: "Paga en efectivo al momento de recibir el producto o en nuestras oficinas.", cuenta: "", titular: "", cedula: "", imagen: "/imagenes/dinero-removebg-preview.png", tipo: "efectivo", comision: 2.50 }
  };

  // Manejar subida de comprobante
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      mostrarMensaje("Formato no válido. Solo JPG, PNG, GIF o PDF.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      mostrarMensaje("El archivo no puede superar los 5MB.", "error");
      return;
    }

    setComprobante(file);
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!metodo) {
      mostrarMensaje("Por favor, selecciona un método de pago.", "error");
      return;
    }
    if (!nombre.trim() || !correo.trim()) {
      mostrarMensaje("Por favor, ingresa tu nombre y correo.", "error");
      return;
    }
    if ((metodo === "Banco Pichincha" || metodo === "De Una" || metodo === "Produbanco") && !comprobante) {
      mostrarMensaje("Debes subir el comprobante de la transferencia.", "error");
      return;
    }

    setProcesandoPago(true);

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("correo", correo);
      formData.append("telefono", telefono);
      formData.append("metodoPago", metodo);
      formData.append("pedido", JSON.stringify(pedidoInfo));
      if (comprobante) formData.append("comprobante", comprobante);

      const res = await fetch("http://localhost:5000/api/pagos/enviar-comprobante", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al enviar comprobante");

      mostrarMensaje("✅ Pago confirmado y comprobante enviado. Te contactaremos pronto.", "success");

      localStorage.removeItem("pedidoActual");
      localStorage.removeItem("carrito");

      setTimeout(() => navigate('/tienda'), 3000);
    } catch (error) {
      console.error(error);
      mostrarMensaje("❌ Error al procesar el pago. Intenta de nuevo.", "error");
    } finally {
      setProcesandoPago(false);
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    const mensaje = document.createElement('div');
    mensaje.className = `mp-mensaje mp-mensaje-${tipo}`;
    mensaje.textContent = texto;
    document.body.appendChild(mensaje);

    setTimeout(() => {
      if (document.body.contains(mensaje)) {
        document.body.removeChild(mensaje);
      }
    }, 5000);
  };

  const calcularTotalConComision = () => {
    if (!pedidoInfo || !metodo) return 0;
    const comision = datosPago[metodo]?.comision || 0;
    return (pedidoInfo.total + comision).toFixed(2);
  };

  const crearOpcionMetodo = (opcion) => (
    <label key={opcion} className={`mp-metodo-option ${metodo === opcion ? "mp-active" : ""}`}>
      <input type="radio" value={opcion} checked={metodo === opcion} onChange={(e) => setMetodo(e.target.value)} className="mp-radio-input" />
      <div className="mp-metodo-content">
        <div className="mp-metodo-imagen-container">
          <img src={datosPago[opcion].imagen} alt={opcion} className="mp-metodo-imagen" />
        </div>
        <div className="mp-metodo-info">
          <span className="mp-metodo-nombre">{opcion}</span>
          <span className="mp-metodo-tipo">{datosPago[opcion].tipo}</span>
          {datosPago[opcion].comision > 0 && <span className="mp-comision">+${datosPago[opcion].comision} comisión</span>}
        </div>
        <div className="mp-check-icon">{metodo === opcion && <span>✓</span>}</div>
      </div>
    </label>
  );

  const crearInfoPago = () => {
    if (!metodo) return null;
    const datos = datosPago[metodo];

    return (
      <div className="mp-info-pago">
        <div className="mp-info-header">
          <img src={datos.imagen} alt={metodo} className="mp-info-imagen" />
          <h3>Instrucciones para {metodo}</h3>
        </div>
        <div className="mp-info-details">
          <p>{datos.descripcion}</p>
          {datos.cuenta && <p><strong>{datos.cuenta}</strong></p>}
          {datos.titular && <p><strong>Titular:</strong> {datos.titular}</p>}
          {datos.cedula && <p><strong>{datos.cedula}</strong></p>}

          {(metodo === "Banco Pichincha" || metodo === "De Una" || metodo === "Produbanco") && (
            <div className="mp-comprobante-container">
              <p>📂 Sube el comprobante de tu transferencia:</p>
              <input type="file" accept=".jpg,.jpeg,.png,.gif,.pdf" onChange={handleFileChange} />
              {preview && <img src={preview} alt="Vista previa comprobante" className="mp-comprobante-preview" />}
              {comprobante && comprobante.type === "application/pdf" && <p>📄 {comprobante.name}</p>}
            </div>
          )}

          {metodo === "Efectivo" && (
            <div className="mp-efectivo-info">
              <p>📍 Dirección: Av. Principal 123, Centro Comercial Plaza, Local 45</p>
              <p>🕒 Horarios: Lunes a Viernes 9:00 AM - 6:00 PM</p>
              <p>📞 Teléfono: +593 99 123 4567</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!pedidoInfo) {
    return (
      <div className="mp-loading">
        <div className="mp-spinner"></div>
        <p>Cargando información del pedido...</p>
      </div>
    );
  }

  return (
    <div className="mp-container">
      <div className="mp-header">
        <button onClick={() => navigate('/cart')} className="mp-btn-volver">← Volver al Carrito</button>
        <h1>💳 Método de Pago</h1>
      </div>

      <div className="mp-content">
        {/* Resumen Pedido */}
        <div className="mp-resumen-pedido">
          <h3>📋 Resumen del Pedido</h3>
          {pedidoInfo.productos.map((p, i) => (
            <div key={i} className="mp-producto-item">
              <img src={p.imagen || '/imagenes/placeholder.jpg'} alt={p.nombre} className="mp-producto-imagen" />
              <div className="mp-producto-info">
                <span className="mp-producto-nombre">{p.nombre}</span>
                <span className="mp-producto-precio">${p.precio}</span>
              </div>
            </div>
          ))}
          <div className="mp-totales">
            <div><span>Subtotal:</span><span>${pedidoInfo.subtotal}</span></div>
            <div><span>Envío:</span><span>{pedidoInfo.envio === 0 ? 'GRATIS' : `$${pedidoInfo.envio}`}</span></div>
            {metodo && datosPago[metodo].comision > 0 && <div><span>Comisión {metodo}:</span><span>+${datosPago[metodo].comision}</span></div>}
            <div className="mp-total-final"><span><strong>Total:</strong></span><span><strong>${metodo ? calcularTotalConComision() : pedidoInfo.total}</strong></span></div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mp-form">
          <h3>👤 Información del Cliente</h3>
          <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className="mp-input" required />
          <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} className="mp-input" required />
          <input type="text" placeholder="Teléfono (opcional)" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="mp-input" />

          <h3>💳 Selecciona tu Método de Pago</h3>
          <div className="mp-metodos-container">
            {Object.keys(datosPago).map((opcion) => crearOpcionMetodo(opcion))}
          </div>

          <button type="submit" className="mp-btn-confirmar" disabled={procesandoPago}>
            {procesandoPago ? <>⏳ Enviando...</> : <>✅ Confirmar Pago - ${metodo ? calcularTotalConComision() : pedidoInfo.total}</>}
          </button>
        </form>

        {crearInfoPago()}
      </div>
    </div>
  );
}

export default MetodoPago;
