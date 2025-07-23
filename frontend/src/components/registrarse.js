import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    confirmar: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contrasena !== formData.confirmar) {
      setMensaje("❌ Las contraseñas no coinciden");
      setEsError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/registrarse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.contrasena,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMensaje(`✅ Registro exitoso. ¡Bienvenido, ${formData.nombre}!`);
        setEsError(false);
        setFormData({ nombre: "", correo: "", contrasena: "", confirmar: "" });
      } else {
        setMensaje("❌ " + data.mensaje);
        setEsError(true);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setMensaje("❌ Error en el servidor");
      setEsError(true);
    }
  };

  const irAlLogin = () => {
    navigate("/");
  };

  return (
    <div className="login-box">
      <div className="unete-text">
        Únete a la Moda <br /> Urbana
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <label htmlFor="nombre">Nombre completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <label htmlFor="contraseña">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <label htmlFor="confirmar">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmar"
            name="confirmar"
            value={formData.confirmar}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn-login">Registrarse</button>
      </form>

      {mensaje && (
        <div
          id="mensaje-registro"
          className="signup-link"
          style={{ color: esError ? "#ff4d4d" : "#0ffff8", marginTop: "10px" }}
        >
          {mensaje}
        </div>
      )}

      <div className="signup-link" style={{ marginTop: "20px" }}>
        ¿Ya tienes cuenta? <br />
        <button onClick={irAlLogin} className="btn-registrarse">Inicia sesión aquí</button>
      </div>
    </div>
  );
};

export default Register;
