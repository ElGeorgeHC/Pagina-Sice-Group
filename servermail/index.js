const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { Resend } = require("resend");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "*"
}));

const upload = multer({ dest: "uploads/" });

// ✅ Inicializar Resend
const resend = new Resend(process.env.RESEND_API_KEY);
app.post("/enviar-cv", upload.single("cv"), async (req, res) => {
  try {
    const { nombre, correo, telefono } = req.body;
    const archivo = req.file;

    if (!archivo || archivo.mimetype !== "application/pdf") {
      return res.status(400).send("Solo PDF");
    }

    const { data, error } = await resend.emails.send({
      from: "CV <no-reply@tu-dominio.com>",
      to: ["jhernandez@sicegroup.com"],
      subject: "Nuevo CV recibido",
      html: `
        <h3>Nuevo CV</h3>
        <p>${nombre}</p>
        <p>${correo}</p>
        <p>${telefono}</p>
      `,
      attachments: [
        {
          filename: archivo.originalname,
          content: fs.readFileSync(archivo.path),
        },
      ],
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      return res.status(500).send("Error enviando correo");
    }

    fs.unlink(archivo.path, () => {});
    console.log("EMAIL OK:", data);

    res.send("✅ CV enviado correctamente");
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).send("Error interno");
  }
});