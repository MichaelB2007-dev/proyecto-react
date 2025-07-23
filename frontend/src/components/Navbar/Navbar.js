import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const nombreUsuario = localStorage.getItem("nombre");
  const rol = localStorage.getItem("rol");

  const cerrarSesion = () => {
    localStorage.clear();
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">HYPE DISTRICT</div>

      <div className="navbar-content">
        <span className="navbar-user">
          Bienvenido, <strong>{nombreUsuario || "Invitado"}</strong> &nbsp;
          <em>({rol})</em>
        </span>

        <button className="btn-cerrar" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
