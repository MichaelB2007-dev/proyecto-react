import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const navigate = useNavigate();

  // Lista de usuarios quemados con roles
  const usuariosQuemados = [
    {
      email: "usuario@hypedistrict.com",
      password: "123456",
      rol: "admin",
    },
    {
      email: "visitante@hypedistrict.com",
      password: "visit123",
      rol: "visitante",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuario = usuariosQuemados.find(
      (u) => u.email === email && u.password === password
    );

    if (usuario) {
      setMensaje(`✅ Bienvenido, ${email}`);
      setEsError(false);
      if (setIsLoggedIn) {
        setIsLoggedIn(true);
      }
      if (usuario.rol === "admin") {
        navigate("/dashboard");
      } else if (usuario.rol === "visitante") {
        navigate("/home");
      }
    } else {
      setMensaje("❌ Usuario o contraseña incorrectos");
      setEsError(true);
    }
  };

  const irARegistro = () => {
    navigate("/registrarse");
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

      {mensaje && (
        <div
          id="mensaje"
          className="signup-link"
          style={{ color: esError ? "#ff4d4d" : "#0ffff8", marginTop: "10px" }}
        >
          {mensaje}
        </div>
      )}

      <div className="signup-link" style={{ marginTop: "20px" }}>
        ¿No tienes cuenta? <br />
        <button onClick={irARegistro} className="btn-registrarse">Regístrate aquí</button>
      </div>
    </div>
  );
};

export default Login;
