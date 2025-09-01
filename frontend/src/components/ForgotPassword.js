import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'; // Usar el mismo CSS del login

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Te hemos enviado un correo con las instrucciones");
        setEsError(false);
        setEnviado(true);
      } else {
        setMensaje("❌ " + data.message);
        setEsError(true);
      }
    } catch (error) {
      setMensaje("❌ Error del servidor");
      setEsError(true);
    }
  };

  if (enviado) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>HYPE DISTRICT</h2>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3 style={{ color: "#0ffff8" }}>📧 Correo Enviado</h3>
            <p>Revisa tu bandeja de entrada y sigue las instrucciones</p>
            <button 
              onClick={() => navigate("/login")} 
              className="btn-login"
              style={{ marginTop: "20px" }}
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>HYPE DISTRICT</h2>
        <h3>Recuperar Contraseña</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo"
            />
          </div>
          
          <button type="submit" className="btn-login">
            Enviar Instrucciones
          </button>
        </form>

        {mensaje && (
          <div
            className="signup-link"
            style={{ 
              color: esError ? "#ff4d4d" : "#0ffff8", 
              marginTop: "10px",
              textAlign: "center" 
            }}
          >
            {mensaje}
          </div>
        )}

        <div className="signup-link" style={{ marginTop: "20px" }}>
          <button 
            onClick={() => navigate("/login")} 
            className="btn-registrarse"
          >
            ← Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;