import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  // Estados para novedades (mantener funcionalidad existente)
  const [novedades, setNovedades] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [imagen, setImagen] = useState(null);

  // Estados para productos de ropa
  const [productos, setProductos] = useState([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState("");
  const [descripcionProducto, setDescripcionProducto] = useState("");
  const [fotoProducto, setFotoProducto] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("dashboard");

  // Cargar productos al iniciar
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/productos');
      const data = await response.json();
      if (data.success) {
        setProductos(data.productos);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

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

  const handleAddProducto = async (e) => {
    e.preventDefault();
    if (!nombreProducto || !precioProducto || !descripcionProducto) {
      alert("Por favor llena todos los campos");
      return;
    }

    try {
      // Crear producto
      const response = await fetch('http://localhost:3001/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreProducto,
          precio: precioProducto,
          descripcion: descripcionProducto
        })
      });

      const data = await response.json();
      if (data.success) {
        // Si hay foto, subirla
        if (fotoProducto) {
          const formData = new FormData();
          formData.append('foto', fotoProducto);
          
          await fetch(`http://localhost:3001/api/productos/${data.producto.id}/foto`, {
            method: 'POST',
            body: formData
          });
        }

        alert('Producto agregado correctamente!');
        setNombreProducto("");
        setPrecioProducto("");
        setDescripcionProducto("");
        setFotoProducto(null);
        cargarProductos(); // Recargar lista
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al agregar producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/productos/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          alert('Producto eliminado');
          cargarProductos();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3 vh-100" style={{ width: "220px" }}>
        <h4 className="text-center mb-4">Dashboard Admin</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="#" className="nav-link text-white" 
               onClick={() => setVistaActiva("agregar-producto")}>
              Agregar producto
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white"
               onClick={() => setVistaActiva("ver-productos")}>
              Ver productos
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white"
               onClick={() => setVistaActiva("eliminar-producto")}>
              Eliminar producto
            </a>
          </li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Gestionar categorías</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Ver pedidos</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Cambiar estado pedido</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Gestionar inventario</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Ver estadísticas</a></li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white"
               onClick={() => setVistaActiva("novedades")}>
              Novedades
            </a>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="container-fluid p-4">
        {/* Vista Dashboard Principal */}
        {vistaActiva === "dashboard" && (
          <div>
            <h2 className="mb-4">Bienvenido al Panel de Administración</h2>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5>Total Productos</h5>
                    <h3>{productos.length}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5>Novedades</h5>
                    <h3>{novedades.length}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vista Agregar Producto */}
        {vistaActiva === "agregar-producto" && (
          <div>
            <h2 className="mb-4">Agregar Producto de Ropa</h2>
            <div className="card p-4">
              <form onSubmit={handleAddProducto}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Producto</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Camiseta Nike"
                    value={nombreProducto}
                    onChange={(e) => setNombreProducto(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="29.99"
                    value={precioProducto}
                    onChange={(e) => setPrecioProducto(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Descripción del producto..."
                    value={descripcionProducto}
                    onChange={(e) => setDescripcionProducto(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Foto del Producto</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setFotoProducto(e.target.files[0])}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Agregar Producto</button>
              </form>
            </div>
          </div>
        )}

        {/* Vista Ver Productos */}
        {vistaActiva === "ver-productos" && (
          <div>
            <h2 className="mb-4">Productos de Ropa</h2>
            <div className="row">
              {productos.map((producto) => (
                <div key={producto.id} className="col-md-4 mb-3">
                  <div className="card">
                    {producto.imagen && (
                      <img 
                        src={`http://localhost:3001/uploads/${producto.imagen}`} 
                        className="card-img-top" 
                        alt={producto.nombre}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text">{producto.descripcion}</p>
                      <p className="card-text">
                        <strong>${producto.precio}</strong>
                      </p>
                      <small className="text-muted">
                        Creado: {new Date(producto.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista Eliminar Productos */}
        {vistaActiva === "eliminar-producto" && (
          <div>
            <h2 className="mb-4">Eliminar Productos</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>${producto.precio}</td>
                      <td>{producto.descripcion?.substring(0, 50)}...</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vista Novedades (funcionalidad original) */}
        {vistaActiva === "novedades" && (
          <div>
            <h2 className="mb-4">Gestionar Novedades</h2>
            <div className="card p-4 mb-4">
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
                <button type="submit" className="btn btn-primary">Añadir Novedad</button>
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
        )}
      </div>
    </div>
  );
}

export default Dashboard;