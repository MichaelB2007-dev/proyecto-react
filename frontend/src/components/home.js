import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import ProductCard from './ProductCard';

const productos = [
  {
    id: 1,
    name: "Zapatillas Urbanas",
    price: 89.99,
    image: "https://via.placeholder.com/200x150",
  },
  {
    id: 2,
    name: "Gorra Street",
    price: 24.99,
    image: "https://via.placeholder.com/200x150",
  },
  {
    id: 3,
    name: "Chaqueta Oversize",
    price: 59.99,
    image: "https://via.placeholder.com/200x150",
  },
];

const Home = ({ addToCart }) => {
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("¡Bienvenido a HYPE DISTRICT, tu estilo comienza aquí!");
  const [visible, setVisible] = useState(true);
  const [showGoodbye, setShowGoodbye] = useState(false);

  useEffect(() => {
    if (mensaje) {
      const timer1 = setTimeout(() => setVisible(false), 9000);
      const timer2 = setTimeout(() => setMensaje(""), 2500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [mensaje]);

  const handleCerrarSesion = () => {
    setShowGoodbye(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/home")}>
          HYPE DISTRICT
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate("/home")}>Inicio</li>
          <li onClick={handleCerrarSesion}>Cerrar Sesión</li>
          <li onClick={() => navigate("/contact")}>Contáctanos</li>
          <li onClick={() => navigate("/carrito")}>🛒</li>
        </ul>
      </nav>

      {mensaje && (
        <div className={`mensaje-bienvenida ${visible ? "fade-in" : "fade-out"}`}>
          {mensaje}
        </div>
      )}

      <div className="hero" style={{ marginTop: "120px" }}>
        <h1>HYPE DISTRICT</h1>
        <p>La cultura urbana se vive aquí. Encuentra tu estilo, tus zapatillas, tu identidad.</p>
        {showGoodbye && (
          <div className="goodbye-message">
            ¡Gracias por visitarnos! Hasta pronto 👋
          </div>
        )}
      </div>

      <div className="productos" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {productos.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default Home;
