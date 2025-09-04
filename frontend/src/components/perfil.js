import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Mail, Save, X, Edit2, Check, AlertCircle } from 'lucide-react';
import "./perfil.css"

const Perfil = () => {
  // Estado del usuario
  const [user, setUser] = useState({
    nombre: '',
    correo: '',
    foto: null
  });

  // Estados para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...user });
  const [previewImage, setPreviewImage] = useState(null);
  
  // Estados para validación y feedback
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Ref para el input de archivo
  const fileInputRef = useRef(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const emailUsuario = localStorage.getItem('userEmail') || 'usuario@email.com';
    setUserEmail(emailUsuario);
    cargarDatosUsuario(emailUsuario);
  }, []);

  // Función para cargar datos del usuario desde el backend
  const cargarDatosUsuario = async (email) => {
    try {
      const response = await fetch(`http://localhost:3001/api/profile/${email}`);
      const data = await response.json();
      
      if (data.success) {
        const userData = {
          nombre: data.usuario.nombre,
          correo: data.usuario.correo,
          foto: data.usuario.foto
        };
        setUser(userData);
        setEditData(userData);
      } else {
        console.error('Error al cargar usuario:', data.mensaje);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

  // Validación de email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!editData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (editData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!editData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!validateEmail(editData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambio en inputs
  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejar selección de imagen
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setEditData(prev => ({ ...prev, foto: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Verificar disponibilidad de email
  const verificarEmail = async (email) => {
    if (email === user.correo) return true;
    
    try {
      const response = await fetch('http://localhost:3001/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email,
          email_actual: user.correo 
        })
      });
      
      const data = await response.json();
      return data.disponible;
    } catch (error) {
      console.error('Error al verificar email:', error);
      return false;
    }
  };

  // Guardar cambios en el backend
  const handleSave = async () => {
    if (!validateForm()) return;

    if (editData.correo !== user.correo) {
      const emailDisponible = await verificarEmail(editData.correo);
      if (!emailDisponible) {
        setErrors(prev => ({ ...prev, correo: 'Este correo ya está en uso' }));
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_actual: user.correo,
          nombre: editData.nombre,
          correo: editData.correo,
          foto: editData.foto
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const newUserData = {
          nombre: data.usuario.nombre,
          correo: data.usuario.correo,
          foto: data.usuario.foto
        };
        
        setUser(newUserData);
        setEditData(newUserData);
        
        if (data.usuario.correo !== userEmail) {
          localStorage.setItem('userEmail', data.usuario.correo);
          setUserEmail(data.usuario.correo);
        }
        
        setIsEditing(false);
        setPreviewImage(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(`Error: ${data.mensaje}`);
      }
      
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al conectar con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditData({ ...user });
    setPreviewImage(null);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {showSuccess && (
          <div className="success-message">
            <Check className="success-icon" />
            ¡Perfil actualizado correctamente!
          </div>
        )}

        <div className="profile-card">
          <div className="profile-header">
            <div className="header-content">
              <h1 className="profile-title">Mi Perfil</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="edit-button"
                >
                  <Edit2 className="edit-icon" />
                  Editar
                </button>
              )}
            </div>
          </div>

          <div className="profile-content">
            <div className="content-layout">
              <div className="avatar-section">
                <div className="avatar-container">
                  <div className="avatar-wrapper">
                    {(isEditing ? previewImage || editData.foto : user.foto) ? (
                      <img
                        src={isEditing ? previewImage || editData.foto : user.foto}
                        alt="Avatar"
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <User className="user-icon" />
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="camera-overlay"
                    >
                      <Camera className="camera-icon" />
                    </button>
                  )}
                </div>
                
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="change-photo-button"
                  >
                    <Camera className="small-camera-icon" />
                    Cambiar foto
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden-input"
                />
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">
                    Nombre completo
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        value={editData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        className={`form-input ${errors.nombre ? 'error' : ''}`}
                        placeholder="Ingresa tu nombre completo"
                      />
                      {errors.nombre && (
                        <p className="error-message">
                          <AlertCircle className="error-icon" />
                          {errors.nombre}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="form-display">
                      <User className="form-icon" />
                      <span className="form-text">{user.nombre}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Correo electrónico
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        type="email"
                        value={editData.correo}
                        onChange={(e) => handleInputChange('correo', e.target.value)}
                        className={`form-input ${errors.correo ? 'error' : ''}`}
                        placeholder="Ingresa tu correo electrónico"
                      />
                      {errors.correo && (
                        <p className="error-message">
                          <AlertCircle className="error-icon" />
                          {errors.correo}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="form-display">
                      <Mail className="form-icon" />
                      <span className="form-text">{user.correo}</span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="button-group">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="save-button"
                    >
                      {isLoading ? (
                        <div className="loading-spinner" />
                      ) : (
                        <Save className="button-icon" />
                      )}
                      {isLoading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="cancel-button"
                    >
                      <X className="button-icon" />
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3 className="info-title">Información importante</h3>
          <ul className="info-list">
            <li>• Las imágenes deben ser menores a 5MB</li>
            <li>• El email debe ser válido y único en el sistema</li>
            <li>• Si cambias tu email, deberás usarlo para el próximo login</li>
          </ul>
        <button 
            onClick={() => window.location.href = "/home"} 
            className="home-button"
        >
          Ir al Home
        </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;