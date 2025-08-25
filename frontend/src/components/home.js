import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import ProductCard from './ProductCard';

const productos = [
  {
    id: 1,
    name: "Zapatillas Urbanas",
    price: 89.99,
    category: "Zapatillas",
    sizes: ["S", "M", "L"],
    image: "https://via.placeholder.com/200x150",
  },
  {
    id: 2,
    name: "Gorra Street",
    price: 24.99,
    category: "Accesorios",
    sizes: ["M", "L"],
    image: "https://via.placeholder.com/200x150",
  },
  {
    id: 3,
    name: "Chaqueta Oversize",
    price: 59.99,
    category: "Chaquetas",
    sizes: ["S", "M", "L"],
    image: "https://via.placeholder.com/200x150",
  },
];

const Home = ({ addToCart }) => {
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("¡Bienvenido a HYPE DISTRICT, tu estilo comienza aquí!");
  const [visible, setVisible] = useState(true);
  const [showGoodbye, setShowGoodbye] = useState(false);

  // Filtros
  const [category, setCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState("");
  const [size, setSize] = useState("");

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

  // Filtrado de productos
  const filteredProducts = productos.filter((product) => {
    return (
      (category === "Todos" || product.category === category) &&
      (priceRange === "" ||
        (priceRange === "low" && product.price < 30) ||
        (priceRange === "medium" && product.price >= 30 && product.price <= 60) ||
        (priceRange === "high" && product.price > 60)) &&
      (size === "" || product.sizes.includes(size))
    );
  });

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

      {/* Contenido principal */}
      <div className="hero" style={{ marginTop: "120px" }}>
        <h1>HYPE DISTRICT</h1>
        <p>La cultura urbana se vive aquí. Encuentra tu estilo, tus zapatillas, tu identidad.</p>
        {showGoodbye && (
          <div className="goodbye-message">
            ¡Gracias por visitarnos! Hasta pronto.
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="filters" style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="Todos">Todas las categorías</option>
          <option value="Zapatillas">Zapatillas</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Chaquetas">Chaquetas</option>
        </select>

        <select onChange={(e) => setPriceRange(e.target.value)}>
          <option value="">Todos los precios</option>
          <option value="low">Menos de $30</option>
          <option value="medium">$30 - $60</option>
          <option value="high">Más de $60</option>
        </select>

        <select onChange={(e) => setSize(e.target.value)}>
          <option value="">Todas las tallas</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
        </select>
      </div>

      {/* Lista de productos filtrados */}
      <div className="productos" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))
        ) : (
          <p>No hay productos que coincidan con los filtros.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

