import React from 'react';
import './ClienteDashboard.css';

const ClienteDashboard = () => {
  const nombreCliente = localStorage.getItem("nombre") || "Cliente";

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Bienvenido, {nombreCliente}</h2>

      <div className="charts-row">
        <div className="chart-box">
          <h4>Estado de cuenta</h4>
          <p>Saldo actual: $120.50</p>
          <p>Membresía: Activa</p>
        </div>

        <div className="chart-box">
          <h4>Reservas</h4>
          <p>Última reserva: 20 julio 2025</p>
          <p>Espacio: Parqueadero #14</p>
        </div>

        <div className="chart-box">
          <h4>Historial</h4>
          <p>Visitas este mes: 5</p>
          <p>Total gastado: $48.75</p>
        </div>
      </div>
    </div>
  );
};

export default ClienteDashboard;
