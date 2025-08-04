import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import DashboardContent from './components/DashboardContent/DashboardContent';
import ClienteDashboard from './components/ClienteDashboard/ClienteDashboard';
import Login from './components/Login/login';
import Register from './components/registrarse';
import Home from './components/home';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const rol = localStorage.getItem("rol");

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Ruta login siempre visible en "/" */}
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        <Route path="/registrarse" element={<Register />} />
        <Route path="/home" element={<Home />} />

        {/* Dashboard para ADMIN */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn && rol === "admin" ? (
              <div className="App">
                <Navbar setIsLoggedIn={setIsLoggedIn} />
                <div className="container-fluid">
                  <div className="row">
                    <Sidebar />
                    <DashboardContent />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Dashboard para VISITANTE */}
        <Route
          path="/cliente-dashboard"
          element={
            isLoggedIn && rol === "visitante" ? (
              <div className="App">
                <Navbar setIsLoggedIn={setIsLoggedIn} />
                <ClienteDashboard />
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
