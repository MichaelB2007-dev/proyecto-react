import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showGoodbye, setShowGoodbye] = useState(false);

  const handleCerrarSesion = () => {
    setShowGoodbye(true); // Mostrar mensaje
    setTimeout(() => {
      navigate('/');      // Redirigir después de 2 segundos
    }, 2000);
  };

  return (
    <div className="home-container">
      {/* Navbar fijo con botón funcional */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/home")}>
          HYPE DISTRICT
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate("/home")}>Inicio</li>
          <li onClick={handleCerrarSesion}>Cerrar Sesión</li>
          <li onClick={() => navigate("/contactanos")}>Contáctanos</li> 
          <li onClick={() => navigate("/carrito")}>🛒</li>         
        </ul>
      </nav>

      {/* Contenido principal sin botón */}
      <div className="hero" style={{ marginTop: "120px" }}>
        <h1>HYPE DISTRICT</h1>
        <p>La cultura urbana se vive aquí. Encuentra tu estilo, tus zapatillas, tu identidad.</p>

        {/* Mensaje despedida */}
        {showGoodbye && (
          <div className="goodbye-message">
            ¡Gracias por visitarnos! Hasta pronto 👋
          </div>
        )}
      </div>

      <div className="destacados">
        <div className="card">
          <h3>🔥 Zapatillas Exclusivas</h3>
          <p>Modelos únicos y coleccionables</p>
        </div>
        <div className="card">
          <h3>🎧 Estilo Urbano</h3>
          <p>Ropa y accesorios con flow callejero</p>
        </div>
        <div className="card">
          <h3>🧢 Comunidad</h3>
          <p>Únete a miles que viven el hype</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
