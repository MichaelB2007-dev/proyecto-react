import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-dark bg-dark fixed-top shadow d-flex justify-content-between px-3">
      <a className="navbar-brand" href="#">📊 Mi Dashboard</a>
      <button className="btn btn-outline-light" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </nav>
  );
};

export default Navbar;
