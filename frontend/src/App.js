// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importa tus componentes
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import Login from './components/login'; 
import Register from './components/registrarse'; 
import Home from './components/home'; 
import Contact from './components/contact';
import Tienda from './components/tienda';
import Recuperar from './components/Recuperar';
function App() {
  // Estado para saber si el usuario está logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route
          path="/registrarse"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Register />
          }
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

        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tienda" element={<Tienda/>}/>
        <Route path="/recuperar" element={<Recuperar />} />


      </Routes>
    </Router>
  );
}


export default App;
