import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link active">
              <i className="fas fa-home mr-2"></i> Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link">
              <i className="fas fa-box mr-2"></i> Productos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/users" className="nav-link">
              <i className="fas fa-users mr-2"></i> Usuarios
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};


export default Sidebar;
