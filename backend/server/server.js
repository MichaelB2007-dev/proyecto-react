require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require('nodemailer');

console.log('✅ Nodemailer importado correctamente');

const app = express();
app.use(cors());
app.use(express.json());

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Carpeta uploads creada');
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'ad01hype@gmail.com',
        pass: 'vmdr svmb qsmm pmwt' // tu app password
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('✅ Transportador creado correctamente');

// Verificar conexión
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Error de conexión SMTP:', error);
    } else {
        console.log('✅ Servidor de email conectado y listo');
    }
});

// Endpoint para contacto
app.post("/api/contacto", upload.single("foto"), async (req, res) => {
  try {
    console.log('📧 Nueva solicitud de contacto recibida');
    console.log('Datos:', req.body);
    console.log('Archivo:', req.file ? req.file.filename : 'Sin archivo');

    const { nombre, email, mensaje } = req.body;
    const foto = req.file;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ mensaje: "❌ Faltan datos requeridos: nombre, email y mensaje" });
    }

    const mailOptions = {
      from: `"${nombre}" <ad01hype@gmail.com>`,
      replyTo: email,
      to: 'ad01hype@gmail.com',
      subject: `📬 Nuevo mensaje de contacto - ${nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
            <h2 style="color: #2c3e50; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                📬 Nuevo Mensaje de Contacto
            </h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong style="color: #2980b9;">👤 Nombre:</strong> ${nombre}</p>
                <p style="margin: 10px 0;"><strong style="color: #2980b9;">📧 Email:</strong> 
                   <a href="mailto:${email}" style="color: #e74c3c;">${email}</a>
                </p>
                <p style="margin: 10px 0;"><strong style="color: #2980b9;">💬 Mensaje:</strong></p>
                <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db; margin-top: 10px;">
                    ${mensaje.replace(/\n/g, '<br>')}
                </div>
            </div>
            ${foto ? 
                `<div style="background-color: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0;">
                    <p style="color: #155724; margin: 0;"><strong>📎 Archivo adjunto:</strong> ${foto.originalname}</p>
                </div>` 
                : ''
            }
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #7f8c8d; font-size: 12px;">
                Mensaje recibido desde el formulario de contacto de tu sitio web
            </div>
        </div>
      `,
      attachments: foto ? [{ filename: foto.originalname, path: foto.path }] : [],
    };

    console.log('📤 Enviando email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', info.messageId);

    if (foto && fs.existsSync(foto.path)) fs.unlinkSync(foto.path);

    res.json({ success: true, mensaje: "✅ Mensaje enviado correctamente", messageId: info.messageId });

  } catch (error) {
    console.error('❌ Error completo:', error);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, mensaje: "❌ Error al enviar el mensaje", error: error.message });
  }
});

// Endpoint para enviar comprobante de pago
app.post("/api/pagos/enviar-comprobante", upload.single("comprobante"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ mensaje: "❌ No se envió ningún archivo" });

        console.log('📦 Nuevo comprobante recibido:', req.file.originalname);

        const mailOptions = {
            from: `"Cliente HYPE DISTRICT" <ad01hype@gmail.com>`,
            to: 'ad01hype@gmail.com',
            subject: '💰 Nuevo comprobante de pago',
            text: `Se adjunta el comprobante de pago enviado por el cliente: ${req.file.originalname}`,
            attachments: [{ filename: req.file.originalname, path: req.file.path }],
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Comprobante enviado:', info.messageId);

        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        res.json({ success: true, mensaje: "✅ Comprobante enviado correctamente", messageId: info.messageId });

    } catch (error) {
        console.error('❌ Error al enviar comprobante:', error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, mensaje: "❌ Error al enviar el comprobante", error: error.message });
    }
});

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ mensaje: '🚀 Servidor funcionando correctamente', timestamp: new Date().toISOString() });
});

// Ruta para verificar el estado del email
app.get('/email-test', (req, res) => {
    transporter.verify((error, success) => {
        if (error) {
            res.status(500).json({ success: false, message: 'Error de conexión SMTP', error: error.message });
        } else {
            res.json({ success: true, message: 'Servidor de email funcionando correctamente' });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📍 Rutas disponibles:`);
    console.log(`   • POST http://localhost:${PORT}/api/contacto`);
    console.log(`   • POST http://localhost:${PORT}/api/pagos/enviar-comprobante`);
    console.log(`   • GET  http://localhost:${PORT}/test`);
    console.log(`   • GET  http://localhost:${PORT}/email-test`);
});
