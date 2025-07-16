import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmar) {
      setMensaje("❌ Las contraseñas no coinciden");
      setEsError(true);
      return;
    }

    setMensaje(`✅ Registro exitoso. ¡Bienvenido, ${formData.nombre}!`);
    setEsError(false);
    console.log("Datos enviados:", formData);
    setFormData({ nombre: "", email: "", password: "", confirmar: "" });
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
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-box">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
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
