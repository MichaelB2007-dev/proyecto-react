const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba para login
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
    console.error(err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${process.env.PORT}`);
});
