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
      return res.status(400).send("Solo se permiten archivos PDF");
    }

   

  
const result = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: ["jhernandez@sicegroup.com"],
  subject: "Nuevo CV recibido",
  html: `
    <h3>Nuevo CV recibido</h3>
    <p>Nombre: ${nombre}</p>
    <p>Correo: ${correo}</p>
    <p>Teléfono: ${telefono}</p>
  `,
  attachments: [
    {
      filename: archivo.originalname,
      content: fs.readFileSync(archivo.path),
    },
  ],
});


    // ✅ BORRAR ARCHIVO TEMPORAL
    fs.unlink(archivo.path, (err) => {
      if (err) console.error("Error eliminando archivo:", err);
    });

  } catch (error) {
    console.error("ERROR:", error);
  }
});

console.log("EMAIL RESULT:", result);

// ✅ responder hasta el final
res.send("✅ CV recibido correctamente");


app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
