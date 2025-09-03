const express = require('express');
const cors = require('cors');
const pool = require('./db/pool'); 
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

/* ---------------- RUTAS DEL PERFIL DE USUARIO ---------------- */

// Obtener datos del perfil por email (para cargar el perfil actual)
app.get('/api/profile/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, nombre, correo, rol, foto FROM usuarios WHERE correo = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];
    res.json({ 
      success: true, 
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        foto: usuario.foto
      }
    });

  } catch (err) {
    console.error('❌ Error al obtener perfil:', err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

// Actualizar perfil de usuario
app.put('/api/profile', async (req, res) => {
  const { email_actual, nombre, correo, foto } = req.body;

  try {
    // Verificar que el usuario existe
    const usuarioExiste = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [email_actual]
    );

    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
    }

    // Si está cambiando el email, verificar que el nuevo no exista
    if (correo !== email_actual) {
      const emailExiste = await pool.query(
        'SELECT * FROM usuarios WHERE correo = $1 AND correo != $2',
        [correo, email_actual]
      );

      if (emailExiste.rows.length > 0) {
        return res.status(400).json({ success: false, mensaje: 'El nuevo correo ya está registrado' });
      }
    }

    // Actualizar los datos del usuario
    const query = `
      UPDATE usuarios 
      SET nombre = $1, correo = $2${foto ? ', foto = $4' : ''} 
      WHERE correo = $3
      RETURNING id, nombre, correo, rol, foto
    `;
    
    const params = foto 
      ? [nombre, correo, email_actual, foto]
      : [nombre, correo, email_actual];

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, mensaje: 'Error al actualizar usuario' });
    }

    const usuarioActualizado = result.rows[0];
    
    res.json({ 
      success: true, 
      mensaje: 'Perfil actualizado correctamente',
      usuario: {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        correo: usuarioActualizado.correo,
        rol: usuarioActualizado.rol,
        foto: usuarioActualizado.foto
      }
    });

  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

// Subir foto de perfil (manejo básico de base64)
app.post('/api/upload-avatar', async (req, res) => {
  const { email, fotoBase64 } = req.body;

  try {
    // Validar que el usuario existe
    const usuarioExiste = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [email]
    );

    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
    }

    // Actualizar solo la foto
    const result = await pool.query(
      'UPDATE usuarios SET foto = $1 WHERE correo = $2 RETURNING foto',
      [fotoBase64, email]
    );

    res.json({ 
      success: true, 
      mensaje: 'Foto actualizada correctamente',
      foto: result.rows[0].foto
    });

  } catch (err) {
    console.error('❌ Error al subir foto:', err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

// Verificar disponibilidad de email (para validación en tiempo real)
app.post('/api/check-email', async (req, res) => {
  const { email, email_actual } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1 AND correo != $2',
      [email, email_actual || '']
    );

    res.json({ 
      disponible: result.rows.length === 0,
      mensaje: result.rows.length > 0 ? 'Este email ya está en uso' : 'Email disponible'
    });

  } catch (err) {
    console.error('❌ Error al verificar email:', err.message);
    res.status(500).json({ success: false, mensaje: 'Error en el servidor' });
  }
});

/* ---------------- INICIAR SERVIDOR ---------------- */
const PORT = process.env.PORT1 || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
