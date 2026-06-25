const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express();






app.use(cors({
  origin: "https://pagina-sice-group.pages.dev"
}));
``
const upload = multer({ dest: "uploads/" });

app.post("/enviar-cv", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, correo, telefono } = req.body;
    const archivo = req.file;

    // Validación PDF
    if (!archivo || archivo.mimetype !== "application/pdf") {
      return res.status(400).send("Solo se permiten archivos PDF");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      //service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "info@sicegroup.com",
      to: "jhernandez@sicegroup.com",
      subject: "CV Bolsa de trabajo Sice Group",
      html: `
        <h3>Nuevo CV recibido</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
      `,
      attachments: [
        {
          filename: archivo.originalname,
          path: archivo.path,
        },
      ],
    };

    
res.send("CV recibido ✅");

transporter.sendMail(mailOptions)
  .then(info => console.log("Correo enviado:", info))
  .catch(err => console.error("ERROR CORREO:", err));

  await new Promise(resolve => setTimeout(resolve, 3000));


  } 
 
catch (error) {
  console.error("ERROR DETALLADO:", error);
  res.status(500).send(error.message);
}

  
});
app.listen(PORT, () => {
  console.log("Servidor corriendo en " + PORT);




});
