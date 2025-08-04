import React from 'react';
import './DashboardContents.css'; 

const Dashboard = () => {
  const products = [
    { name: 'Camiseta Urbana', price: '$20', stock: 45, status: 'Disponible' },
    { name: 'Camiseta Oversize', price: '$30', stock: 23, status: 'Disponible' },
    { name: 'Gorra Negra', price: '$15', stock: 12, status: 'Bajo Stock' },
    { name: 'Chaqueta Premium', price: '$45', stock: 8, status: 'Bajo Stock' },
    { name: 'Pantalón Casual', price: '$35', stock: 0, status: 'Agotado' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disponible': return 'badge badge-success';
      case 'Bajo Stock': return 'badge badge-warning';
      case 'Agotado': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  };

  return (
    <div className="container-fluid bg-dark text-white py-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-secondary vh-100 p-3">
          <h4 className="text-center">🚀 Dashboard</h4>
          <ul className="nav flex-column mt-4">
            <li className="nav-item"><a className="nav-link text-white" href="#">Dashboard</a></li>
            <li className="nav-item"><a className="nav-link active bg-primary text-white" href="#">Productos</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="#">Usuarios</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="#">Ventas</a></li>
            <li className="nav-item"><a className="nav-link text-white" href="#">Configuración</a></li>
          </ul>
        </div>

        <div className="col-md-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Productos</h2>
          </div>

          <div className="alert alert-warning" role="alert">
            ⚠️ ¡Atención! Hay nuevas tareas pendientes por revisar.
          </div>

          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-white bg-info mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Usuarios</h5>
                  <p className="card-text">1,234 <small className="text-light d-block">+12% vs mes pasado</small></p>
                </div>
              </div>
            </div>
            {/* Repite los demás stats como aquí */}
          </div>

          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between">
              <h5>Productos Recientes</h5>
              <button className="btn btn-outline-primary btn-sm">Ver todos</button>
            </div>
            <div className="card-body p-0">
              <table className="table table-dark table-hover mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.price}</td>
                      <td>{p.stock}</td>
                      <td><span className={getStatusBadge(p.status)}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card bg-secondary text-white">
                <div className="card-body">
                  <h5 className="card-title">Acciones Rápidas</h5>
                  <button className="btn btn-primary btn-block mb-2">➕ Agregar Producto</button>
                  <button className="btn btn-success btn-block mb-2">👥 Nuevo Usuario</button>
                  <button className="btn btn-info btn-block">📊 Ver Reportes</button>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card bg-secondary text-white">
                <div className="card-body">
                  <h5 className="card-title">Actividad Reciente</h5>
                  <ul className="list-unstyled mb-0">
                    <li>✅ Producto agregado</li>
                    <li>📝 Usuario actualizado</li>
                    <li>⚠️ Stock bajo detectado</li>
                    <li>❌ Producto agotado</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Dashboard;
