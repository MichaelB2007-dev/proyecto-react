import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function EncargadoDashboard() {
  const [novedades, setNovedades] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [imagen, setImagen] = useState(null);

  const handleAddNovedad = (e) => {
    e.preventDefault();
    if (!titulo || !imagen) {
      alert("Por favor ingresa un título y una imagen");
      return;
    }
    const nueva = { titulo, imagen: URL.createObjectURL(imagen) };
    setNovedades([...novedades, nueva]);
    setTitulo("");
    setImagen(null);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
        <h4 className="text-center mb-4">Encargado</h4>
        <ul className="nav flex-column">
          <li className="nav-item"><a href="#" className="nav-link text-white">Agregar producto</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Editar producto</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Ver pedidos</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Cambiar estado pedido</a></li>
          <li className="nav-item"><a href="#novedades" className="nav-link text-white">Novedades</a></li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="container-fluid p-4">
        <h2 className="mb-4">Panel de Encargado</h2>

        {/* Sección novedades */}
        <div id="novedades" className="card p-4 mb-4">
          <h4>Añadir Novedad</h4>
          <form onSubmit={handleAddNovedad}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Título de la novedad"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />
            </div>
            <button type="submit" className="btn btn-primary">Añadir</button>
          </form>
        </div>

        {/* Listado de novedades */}
        <div className="row">
          {novedades.map((nov, idx) => (
            <div key={idx} className="col-md-4 mb-3">
              <div className="card">
                <img src={nov.imagen} className="card-img-top" alt={nov.titulo} />
                <div className="card-body">
                  <h5 className="card-title">{nov.titulo}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EncargadoDashboard;
