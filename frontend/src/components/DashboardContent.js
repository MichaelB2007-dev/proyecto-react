import React, { useState, useEffect } from "react";
import "./dashboard.css";

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
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h4>🔥 HYPE DISTRICT</h4>
        <ul className="nav-menu">
          <li className="nav-item">
            <a 
              className={`nav-link ${vistaActiva === "dashboard" ? "active" : ""}`}
              onClick={() => setVistaActiva("dashboard")}
            >
              📊 Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${vistaActiva === "agregar-producto" ? "active" : ""}`}
              onClick={() => setVistaActiva("agregar-producto")}
            >
              ➕ Agregar Producto
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${vistaActiva === "ver-productos" ? "active" : ""}`}
              onClick={() => setVistaActiva("ver-productos")}
            >
              👕 Ver Productos
            </a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${vistaActiva === "eliminar-producto" ? "active" : ""}`}
              onClick={() => setVistaActiva("eliminar-producto")}
            >
              🗑️ Eliminar Producto
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link">📂 Gestionar Categorías</a>
          </li>
          <li className="nav-item">
            <a className="nav-link">📦 Ver Pedidos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link">🔄 Cambiar Estado Pedido</a>
          </li>
          <li className="nav-item">
            <a className="nav-link">📈 Gestionar Inventario</a>
          </li>
          <li className="nav-item">
            <a className="nav-link">📊 Ver Estadísticas</a>
          </li>
          <li className="nav-item">
            <a 
              className={`nav-link ${vistaActiva === "novedades" ? "active" : ""}`}
              onClick={() => setVistaActiva("novedades")}
            >
              🆕 Novedades
            </a>
          </li>
        </ul>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {/* Vista Dashboard Principal */}
        {vistaActiva === "dashboard" && (
          <div>
            <h2 className="page-title">🎯 Panel de Administración</h2>
            <div className="stats-grid">
              <div className="stat-card primary">
                <h5>Total Productos</h5>
                <h3>{productos.length}</h3>
              </div>
              <div className="stat-card success">
                <h5>Novedades Activas</h5>
                <h3>{novedades.length}</h3>
              </div>
              <div className="stat-card warning">
                <h5>Pedidos Pendientes</h5>
                <h3>0</h3>
              </div>
            </div>
            
            <div className="card">
              <h3>🚀 Bienvenido al Dashboard de Hype District</h3>
              <p>Desde aquí puedes gestionar todos los aspectos de tu tienda de ropa. Utiliza el menú lateral para navegar entre las diferentes secciones.</p>
            </div>
          </div>
        )}

        {/* Vista Agregar Producto */}
        {vistaActiva === "agregar-producto" && (
          <div>
            <h2 className="page-title">➕ Agregar Producto de Ropa</h2>
            <div className="card">
              <form onSubmit={handleAddProducto}>
                <div className="form-group">
                  <label className="form-label">Nombre del Producto</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Camiseta Nike Air Max"
                    value={nombreProducto}
                    onChange={(e) => setNombreProducto(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Precio ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="29.99"
                    value={precioProducto}
                    onChange={(e) => setPrecioProducto(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe las características, material, talla, etc..."
                    value={descripcionProducto}
                    onChange={(e) => setDescripcionProducto(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Foto del Producto</label>
                  <input
                    type="file"
                    className="form-file"
                    accept="image/*"
                    onChange={(e) => setFotoProducto(e.target.files[0])}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  ✨ Agregar Producto
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Vista Ver Productos */}
        {vistaActiva === "ver-productos" && (
          <div>
            <h2 className="page-title">👕 Catálogo de Productos</h2>
            <div className="productos-grid">
              {productos.map((producto) => (
                <div key={producto.id} className="producto-card">
                  {producto.imagen && (
                    <img 
                      src={`http://localhost:3001/uploads/${producto.imagen}`} 
                      className="producto-img" 
                      alt={producto.nombre}
                    />
                  )}
                  <div className="producto-body">
                    <h5 className="producto-title">{producto.nombre}</h5>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <p className="producto-precio">${producto.precio}</p>
                    <small className="producto-fecha">
                      📅 {new Date(producto.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            
            {productos.length === 0 && (
              <div className="card">
                <p style={{ textAlign: 'center', color: '#666' }}>
                  📦 No hay productos registrados aún
                </p>
              </div>
            )}
          </div>
        )}

        {/* Vista Eliminar Productos */}
        {vistaActiva === "eliminar-producto" && (
          <div>
            <h2 className="page-title">🗑️ Eliminar Productos</h2>
            <div className="table-container">
              <table className="custom-table">
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
                      <td><strong>{producto.nombre}</strong></td>
                      <td>${producto.precio}</td>
                      <td>{producto.descripcion?.substring(0, 50)}...</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {productos.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', margin: '20px 0' }}>
                  📦 No hay productos para eliminar
                </p>
              )}
            </div>
          </div>
        )}

        {/* Vista Novedades */}
        {vistaActiva === "novedades" && (
          <div>
            <h2 className="page-title">🆕 Gestionar Novedades</h2>
            
            <div className="card">
              <h4>✨ Añadir Nueva Novedad</h4>
              <form onSubmit={handleAddNovedad}>
                <div className="form-group">
                  <label className="form-label">Título de la Novedad</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: Nueva colección de verano 2024"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Imagen de la Novedad</label>
                  <input
                    type="file"
                    className="form-file"
                    accept="image/*"
                    onChange={(e) => setImagen(e.target.files[0])}
                  />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  🚀 Añadir Novedad
                </button>
              </form>
            </div>

            {/* Listado de novedades */}
            <h3 style={{ color: 'white', marginTop: '30px', marginBottom: '20px' }}>
              📰 Novedades Publicadas
            </h3>
            <div className="productos-grid">
              {novedades.map((nov, idx) => (
                <div key={idx} className="producto-card">
                  <img src={nov.imagen} className="producto-img" alt={nov.titulo} />
                  <div className="producto-body">
                    <h5 className="producto-title">{nov.titulo}</h5>
                    <small className="producto-fecha">
                      📅 Publicado hoy
                    </small>
                  </div>
                </div>
              ))}
            </div>
            
            {novedades.length === 0 && (
              <div className="card">
                <p style={{ textAlign: 'center', color: '#666' }}>
                  📰 No hay novedades publicadas aún
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;