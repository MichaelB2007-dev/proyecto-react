import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Importa tus componentes
import DashboardContent from './components/DashboardContent';
import DashboardEncargado from "./components/DashboardEncargado";
import Login from './components/login'; 
import Register from './components/registrarse'; 
import MetodoPago from './components/MetodoPago';
import Home from './components/home'; 
import Contact from './components/contact';
import Tienda from './components/tienda';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Perfil from './components/perfil';
import Cart from "./components/Cart";


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
                <div className="container-fluid">
                  <div className="row">
                    <DashboardContent />
                  </div>
                </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="/home" element={<Home />} />
        <Route path="/DashboardEncargado" element={<DashboardEncargado />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tienda" element={<Tienda/>}/>
        <Route path="/metodopago" element={<MetodoPago />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/cart" element={<Cart />} />


      </Routes>
    </Router>
  );
}



export default App;
