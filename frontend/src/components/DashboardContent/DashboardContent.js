import React from 'react';
import {
  BarChart, Bar,
  PieChart, Pie,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import './DashboardContents.css';

const DashboardContent = () => {
  const dataBar = [
    { name: 'Ene', usuarios: 30 },
    { name: 'Feb', usuarios: 50 },
    { name: 'Mar', usuarios: 70 },
    { name: 'Abr', usuarios: 40 }
  ];

  const dataPie = [
    { name: 'Camisetas', value: 400 },
    { name: 'Gorras', value: 300 },
    { name: 'Chaquetas', value: 300 }
  ];

  const dataLine = [
    { year: '2021', valor: 50 },
    { year: '2022', valor: 80 },
    { year: '2023', valor: 65 }
  ];

  return (
    <main className="dashboard-container">
      <h2 className="dashboard-title">
        <i className="fas fa-tachometer-alt mr-2" style={{ textShadow: '0 0 8px #0ffff8' }}></i>
        Panel Principal
      </h2>
      <p className="dashboard-subtitle">Resumen general del sistema</p>

      <div
        className="alert alert-warning alert-dismissible fade show mt-4"
        role="alert"
        style={{
          background: 'rgba(255, 255, 0, 0.15)',
          border: '1px solid #ffc107',
          color: '#fff',
          textShadow: '0 0 5px #ffc107',
          boxShadow: '0 0 15px #ffc107',
          borderRadius: '10px',
        }}
      >
        <strong>¡Atención!</strong> Hay nuevos reportes sin revisar.
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
          style={{ color: '#ffc107', opacity: 0.8 }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="row mt-5">
        {/* Tarjetas de resumen */}
        <div className="col-md-4 mb-4">
          <div
            className="neon-card"
            style={{
              background: 'linear-gradient(135deg, #1a73e8, #4a90e2)',
            }}
          >
            <div className="card-body">
              <h5
                className="card-title"
                style={{ textShadow: '0 0 10px #1a73e8' }}
              >
                <i className="fas fa-users mr-2"></i>Usuarios
              </h5>
              <p className="card-text">Gestión de usuarios.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div
            className="neon-card"
            style={{
              background: 'linear-gradient(135deg, #28a745, #5bc85b)',
            }}
          >
            <div className="card-body">
              <h5
                className="card-title"
                style={{ textShadow: '0 0 10px #28a745' }}
              >
                <i className="fas fa-dollar-sign mr-2"></i>Ventas
              </h5>
              <p className="card-text">Reporte de ventas.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div
            className="neon-card"
            style={{
              background: 'linear-gradient(135deg, #f39c12, #f7ca18)',
            }}
          >
            <div className="card-body">
              <h5
                className="card-title"
                style={{ textShadow: '0 0 10px #f39c12' }}
              >
                <i className="fas fa-bell mr-2"></i>Alertas
              </h5>
              <p className="card-text">Notificaciones recientes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <h4 className="dashboard-section-title mt-5">Estadísticas</h4>
      <div className="charts-row">
        <div className="chart-box">
          <h6 className="text-center">Usuarios por mes</h6>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataBar}>
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip />
              <Bar dataKey="usuarios" fill="#1a73e8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h6 className="text-center">Ventas por categoría</h6>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataPie}
                dataKey="value"
                outerRadius={60}
                fill="#28a745"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h6 className="text-center">Ganancias anuales</h6>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dataLine}>
              <XAxis dataKey="year" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <CartesianGrid stroke="#444" />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#f39c12" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de productos */}
      <h4 className="dashboard-section-title mt-5">Últimos Productos</h4>
      <table className="table table-striped neon-table mt-3">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Camiseta Urbana</td>
            <td>$20</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Camiseta Oversize</td>
            <td>$30</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Gorra Negra</td>
            <td>$15</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Chaqueta Premium</td>
            <td>$45</td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <footer
        style={{
          marginTop: '60px',
          textAlign: 'center',
          color: '#07c8ff',
          textShadow: '0 0 5px #07c8ff',
          fontSize: '14px',
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        © 2025 Mi Empresa. Todos los derechos reservados.
      </footer>
    </main>
  );
};

export default DashboardContent;
