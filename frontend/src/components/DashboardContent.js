import React from 'react';

const DashboardContent = () => {
  return (
    <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
      <h2 className="mt-4 mb-2">
        <i className="fas fa-tachometer-alt mr-2"></i>
        Panel Principal
      </h2>
      <p className="text-muted">Resumen general del sistema</p>

      <div className="alert alert-warning alert-dismissible fade show mt-4" role="alert">
        <strong>¡Atención!</strong> Hay nuevos reportes sin revisar.
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="row mt-4">
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h5 className="card-title">Usuarios</h5>
              <p className="card-text">Gestión de usuarios.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title">Ventas</h5>
              <p className="card-text">Reporte de ventas.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Alertas</h5>
              <p className="card-text">Notificaciones recientes.</p>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-5">Últimos Productos</h4>
      <table className="table table-striped mt-3">
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
    </main>
  );
};

export default DashboardContent;
