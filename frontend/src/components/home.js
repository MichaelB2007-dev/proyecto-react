import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("¡Bienvenido a HYPE DISTRICT, tu estilo comienza aquí!");
  const [visible, setVisible] = useState(true);
  const [showGoodbye, setShowGoodbye] = useState(false);

  useEffect(() => {
    if (mensaje) {
      const timer1 = setTimeout(() => {
        setVisible(false);
      }, 9000);

      const timer2 = setTimeout(() => {
        setMensaje("");
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [mensaje]);

  const handleCerrarSesion = () => {
    setShowGoodbye(true);
    setTimeout(() => {
      navigate('/'); // Redirige a la raíz
    }, 2000);
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        {/* Logo a la izquierda */}
        <div className="logo-circle">HD</div>
        <div className="logo" onClick={() => navigate("/home")}>
          HYPE DISTRICT
        </div>
        
        {/* Navegación central */}
        <div className="nav-center">
          <ul className="nav-links">
            <li onClick={() => navigate("/home")}>Inicio</li>
            <li onClick={() => navigate("/tienda")}>Tienda</li>
            <li onClick={() => navigate("/novedades")}>Novedades</li>
            <li onClick={() => navigate("/contact")}>Contacto</li>
          </ul>
        </div>
        
        {/* Iconos a la derecha */}
        <div className="nav-icons">
          <div className="nav-icon" onClick={() => navigate("/perfil")} title="Mi Perfil">
            👤
          </div>
          <div className="nav-icon" onClick={() => navigate("/carrito")} title="Carrito">
            🛒
          </div>
          <div className="nav-icon" onClick={handleCerrarSesion} title="Cerrar Sesión">
            🚪
          </div>
        </div>
      </nav>

      {/* Mensaje de bienvenida */}
      {mensaje && (
        <div className={`mensaje-bienvenida ${visible ? "fade-in" : "fade-out"}`}>
          {mensaje}
        </div>
      )}

      {/* Contenido principal */}
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