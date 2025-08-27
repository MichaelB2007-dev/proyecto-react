import React, { useState } from "react";

const Recuperar = () => {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3001/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMensaje(data.message);
    } catch (err) {
      setMensaje("❌ Error al enviar el correo");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Recuperar contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-login">
            Enviar enlace de recuperación
          </button>
        </form>
        {mensaje && (
          <p style={{ marginTop: "10px", color: "#0ffff8" }}>{mensaje}</p>
        )}
      </div>
    </div>
  );
};

export default Recuperar;
