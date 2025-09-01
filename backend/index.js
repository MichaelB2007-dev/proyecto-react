const express = require('express');
const cors = require('cors');
const pool = require('./db/pool'); // ruta correcta
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- RUTA LOGIN ---------------- */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 AND contrasena = $2',
      [email, password] // texto plano
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, mensaje: 'Usuario o contraseña incorrecta' });
    }

    const usuario = result.rows[0];
    res.json({ success: true, rol: usuario.rol || 'visitante' });

  } catch (err) {
    console.error('❌ Error al hacer login:', err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

/* ---------------- RUTA REGISTRO ---------------- */
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
      [nombre, correo, contrasena, 'cliente'] // texto plano
    );

    res.status(201).json({ success: true, mensaje: 'Usuario registrado con éxito' });

  } catch (err) {
    console.error('❌ Error al registrar:', err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

/* ---------------- CONFIGURAR NODEMAILER ---------------- */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS1
  }
});

/* ---------------- RUTA RECUPERAR CONTRASEÑA ---------------- */
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userQuery = 'SELECT * FROM usuarios WHERE correo = $1';
    const userResult = await pool.query(userQuery, [email]);
    
    if (userResult.rows.length === 0) {
      return res.json({ success: true, message: 'Si el email existe, recibirás las instrucciones' });
    }

    const user = userResult.rows[0];
    
    // Generar token
    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 3600000); // 1 hora

    // Guardar token
    await pool.query(
      'UPDATE usuarios SET reset_token_hash = $1, reset_expira = $2 WHERE id = $3',
      [token, expira, user.id]
    );

    // Enviar email
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    
    await transporter.sendMail({
      from: process.env.MI_CORREO,
      to: email,
      subject: 'Recuperar Contraseña - Hype District',
      html: `
        <h2>Hype District</h2>
        <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
        <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Cambiar Contraseña
        </a>
        <p>Este enlace expira en 1 hora.</p>
      `
    });

    res.json({ success: true, message: 'Te hemos enviado las instrucciones por correo' });

  } catch (error) {
    console.error('❌ Error en forgot-password:', error.message);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

/* ---------------- VERIFICAR TOKEN ---------------- */
app.get('/api/verify-token/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const query = 'SELECT * FROM usuarios WHERE reset_token_hash = $1 AND reset_expira > NOW()';
    const result = await pool.query(query, [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error en verify-token:', error.message);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

/* ---------------- CAMBIAR CONTRASEÑA ---------------- */
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const userQuery = 'SELECT * FROM usuarios WHERE reset_token_hash = $1 AND reset_expira > NOW()';
    const userResult = await pool.query(userQuery, [token]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Token inválido o expirado' });
    }

    const user = userResult.rows[0];

    // Actualizar contraseña en texto plano
    await pool.query(
      'UPDATE usuarios SET contrasena = $1, reset_token_hash = NULL, reset_expira = NULL WHERE id = $2',
      [newPassword, user.id]
    );

    res.json({ success: true, message: 'Contraseña cambiada exitosamente' });

  } catch (error) {
    console.error('❌ Error en reset-password:', error.message);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

/* ---------------- INICIAR SERVIDOR ---------------- */
const PORT = process.env.PORT1 || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
