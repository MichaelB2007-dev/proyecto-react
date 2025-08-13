require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de multer para subir archivos temporales
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // carpeta temporal
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Endpoint para recibir el formulario
app.post("/api/contacto", upload.single("foto"), async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;
    const foto = req.file;

    // Configuración de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Opciones del correo
    const mailOptions = {
      from: `"${nombre}" <${email}>`,
      to: process.env.MI_CORREO, // tu correo donde quieres recibir los mensajes
      subject: "Nuevo mensaje desde Contacto",
      text: mensaje,
      attachments: foto
        ? [
            {
              filename: foto.originalname,
              path: foto.path,
            },
          ]
        : [],
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    // Eliminar archivo temporal
    if (foto) fs.unlinkSync(foto.path);

    res.json({ mensaje: "Mensaje enviado correctamente ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al enviar el mensaje ❌" });
  }
});

app.listen(3000, () => console.log("Servidor escuchando en puerto 3000"));
