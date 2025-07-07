import React from 'react';
import { Link } from 'react-router-dom';




const Sidebar = () => {
  return (
    <nav className="col-md-2 d-none d-md-block sidebar">
      <div className="pt-3">
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link active" href="#">
              <i className="fas fa-home mr-2"></i> Inicio
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="ProductCard.js">
              <i className="fas fa-box mr-2"></i> Productos
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="fas fa-users mr-2"></i> Usuarios
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
