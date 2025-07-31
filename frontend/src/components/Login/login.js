import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(`✅ Bienvenido, ${email}`);
        setEsError(false);
        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }

        if (data.rol === "admin") {
          navigate("/dashboard", { state: { mensaje: `Bienvenido, ${email}` } });
        } else {
          navigate("/home", { state: { mensaje: `Bienvenido, ${email}` } });
        }
      } else {
        setMensaje("❌ Usuario o contraseña incorrectos");
        setEsError(true);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("❌ Error del servidor");
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
