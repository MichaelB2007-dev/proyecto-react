import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import './Login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const [tokenValido, setTokenValido] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    // Verificar que el token sea válido
    const verificarToken = async () => {
      if (!token) {
        setTokenValido(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/verify-token/${token}`);
        if (response.ok) {
          setTokenValido(true);
        } else {
          setTokenValido(false);
        }
      } catch (error) {
        setTokenValido(false);
      }
    };

    verificarToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMensaje("❌ Las contraseñas no coinciden");
      setEsError(true);
      return;
    }

    if (password.length < 6) {
      setMensaje("❌ La contraseña debe tener al menos 6 caracteres");
      setEsError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Contraseña cambiada exitosamente");
        setEsError(false);
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMensaje("❌ " + data.message);
        setEsError(true);
      }
    } catch (error) {
      setMensaje("❌ Error del servidor");
      setEsError(true);
    }
  };

  if (tokenValido === false) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>HYPE DISTRICT</h2>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3 style={{ color: "#ff4d4d" }}>❌ Enlace Inválido</h3>
            <p>Este enlace ha expirado o no es válido</p>
            <button 
              onClick={() => navigate("/forgot-password")} 
              className="btn-login"
              style={{ marginTop: "20px" }}
            >
              Solicitar Nuevo Enlace
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (tokenValido === null) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>HYPE DISTRICT</h2>
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Verificando enlace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>HYPE DISTRICT</h2>
        <h3>Nueva Contraseña</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label htmlFor="password">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              required
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="input-box">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              required
              minLength="6"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la contraseña"
            />
          </div>
          
          <button type="submit" className="btn-login">
            Cambiar Contraseña
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
      </div>
    </div>
  );
};

export default ResetPassword;