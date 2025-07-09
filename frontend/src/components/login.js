import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Usuario hardcodeado
  const usuarioFijo = {
    email: "usuario@hypedistrict.com",
    password: "123456",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === usuarioFijo.email && password === usuarioFijo.password) {
      setMensaje("¡Inicio de sesión exitoso!");
      if (setIsLoggedIn) {
        setIsLoggedIn(true); // Activar sesión
      }
      navigate("/dashboard"); // Redirige al dashboard
    } else {
      setMensaje("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-box">
      <h2>HYPE DISTRICT</h2>
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="input-box">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-box">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-login">
          Iniciar sesión
        </button>
      </form>
      <div id="mensaje" className="signup-link">
        {mensaje}
      </div>
    </div>
  );
};

export default Login;
