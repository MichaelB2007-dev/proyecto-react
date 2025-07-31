import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardContent from './components/DashboardContent';
import Login from './components/login'; 
import Register from './components/registrarse'; 
import Home from './components/home'; 
import Contact from './components/contact';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Actualiza el estado si se cambia en localStorage
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

        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
