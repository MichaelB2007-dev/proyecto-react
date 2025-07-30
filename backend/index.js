const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 AND contrasena = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      const usuario = result.rows[0];
      res.json({ success: true, rol: usuario.rol || 'visitante' });
    } else {
      res.status(401).json({ success: false, mensaje: 'Credenciales inválidas' });
    }
  } catch (err) {
    console.error('❌ Error al hacer login:', err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

// Ruta de registro
app.post('/api/registrarse', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  try {
    const existe = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ success: false, mensaje: 'El correo ya está registrado' });
    }

    await pool.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4)',
      [nombre, correo, contrasena, 'cliente']
    );

    res.status(201).json({ success: true, mensaje: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al registrar:', err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});


// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
