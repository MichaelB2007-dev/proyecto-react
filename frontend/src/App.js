import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import Login from './components/login';
import Register from './components/registrarse';
import Home from './components/home';
import Contact from './components/contact';
import Cart from './components/Cart';
import Pago from './components/pagos'; 
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route
          path="/registrarse"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />}
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <div className="App">
                <Navbar />
                <div className="container-fluid">
                  <div className="row">
                    <Sidebar />
                    <DashboardContent />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Home con sistema de filtros */}
        <Route path="/home" element={<Home addToCart={addToCart} />} />

        <Route path="/contact" element={<Contact />} />

        {/* Carrito */}
        <Route
          path="/carrito"
          element={<Cart items={cartItems} removeFromCart={removeFromCart} />}
        />

        {/* Pago */}
        <Route path="/pago" element={<Pago />} />
      </Routes>
    </Router>
  );
}

export default App;
