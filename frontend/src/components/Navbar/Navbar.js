import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("rol");
    navigate("/", { replace: true });
  };

  const goToHome = () => {
    navigate("/home");
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top shadow d-flex justify-content-between px-3">
      <a className="navbar-brand" href="#">📊 Mi Dashboard</a>
      <div className="d-flex gap-3">
        <button className="btn btn-outline-info" onClick={goToHome}>
          Ir al Home
        </button>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
