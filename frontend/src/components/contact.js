import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./contact.css";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
    foto: null,
  });
  const [respuesta, setRespuesta] = useState(null); // { tipo: 'exito' | 'error', mensaje: string }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRespuesta(null);

    try {
      const dataToSend = new FormData();
      dataToSend.append("nombre", formData.nombre);
      dataToSend.append("email", formData.email);
      dataToSend.append("mensaje", formData.mensaje);
      if (formData.foto) dataToSend.append("foto", formData.foto);

      const res = await fetch("http://localhost:3000/api/contacto", {
        method: "POST",
        body: dataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        setRespuesta({ tipo: "exito", mensaje: data.mensaje });
        setFormData({ nombre: "", email: "", mensaje: "", foto: null });
      } else {
        setRespuesta({ tipo: "error", mensaje: data.mensaje });
      }
    } catch (error) {
      setRespuesta({ tipo: "error", mensaje: "Error al enviar el mensaje." });
    } finally {
      setLoading(false);
    }
  };

  const handleSalir = () => {
    navigate("/home");
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="titulo-contacto">CONTACTA CON NOSOTROS</h1>
        <p className="subtitulo-contacto">Escribe aquí tus dudas o sugerencias</p>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="contact-form">
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
              name="email"
              placeholder="Tu correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="fila-unica">
            <input
              type="file"
              name="foto"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="fila-unica">
            <textarea
              name="mensaje"
              placeholder="Escribe tu mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              required
            />
          </div>

          <div className="botones-form">
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
            <button type="button" onClick={handleSalir}>
              Salir
            </button>
          </div>
        </form>

        {respuesta && (
          <div className={`respuesta ${respuesta.tipo}`}>
            {respuesta.mensaje}
          </div>
        )}

        <div className="social-icons">
          <a href="https://wa.me/593XXXXXXXXX" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-whatsapp"></i>
          </a>
          <a href="https://www.facebook.com/tupagina" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="https://www.instagram.com/tuusuario" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://www.tiktok.com/@tuusuario" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
