import * as brevo from "@getbrevo/brevo";
import { generateLargePDFBuffer } from "./pdfGenerator";

// Inicializamos la instancia de Brevo
const apiInstance = new brevo.TransactionalEmailsApi();

// Obtenemos la API Key del entorno
const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error("BREVO_API_KEY no está definida en las variables de entorno");
}

apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

/**
 * Función reutilizable para enviar correos
 */
export async function sendEmail({
  codigo,
  email,
  nombre,
  telefono,
  tipo_participante,
}: {
  codigo: string;
  email: string;
  nombre: string;
  telefono: string;
  tipo_participante: string;
}) {
  try {
    const smtpEmail = new brevo.SendSmtpEmail();

    // Objeto inscripción para usar en PDF
    const inscripcion = {
      codigo,
      nombre,
      email,
      telefono,
      tipo_participante,
    };

    // Generar PDF grande
    const pdfBuffer = await generateLargePDFBuffer(inscripcion);
    const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

    // Configurar correo
    smtpEmail.subject = "Confirmación de Inscripción - Reactiva-Petrol 2025";
    smtpEmail.to = [{ email, name: nombre }];

    // Agregar mapeo de tipo_participante
    const tipoLabels: { [key: string]: string } = {
      EMPRESAS: "Empresas",
      INSTITUCIONES: "Instituciones",
      PROFESIONALES_ESTUDIANTES: "Profesionales - Estudiantes",
      PUBLICO_EN_GENERAL: "Público en General",
    };
    const formattedTipo = tipoLabels[tipo_participante] || tipo_participante;

    smtpEmail.htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Confirmación de Inscripción</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f7fa;
                color: #333333;
              }
              .container {
                max-width: 600px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #006400; /* Verde petrolero */
                color: white;
                padding: 20px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 32px;
              }
              .header p {
                font-size: 24px;
              }
              .content {
                padding: 25px;
              }
              .highlight {
                color: #006400;
                font-weight: bold;
              }
              .info-box {
                background-color: #f0f8f0;
                border-left: 4px solid #006400;
                padding: 15px;
                margin: 15px 0;
                border-radius: 6px;
              }
              .qr-container {
                display: flex;
                justify-content: center;
                margin: 20px 0;
              }
              .button {
                display: inline-block;
                background-color: #FFA500;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                text-align: center;
                margin-top: 20px;
              }
              .footer {
                background-color: #f1f1f1;
                text-align: center;
                padding: 15px;
                font-size: 12px;
                color: #666666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Reactiva-Petrol 2025</h1>
                <p>Reactivación Petrolera en la Región Piura</p>
              </div>
  
              <div class="content">
                <p><strong>Hola ${nombre},</strong></p>
                <p>Su inscripción ha sido confirmada exitosamente.</p>
  
                <div class="info-box">
                  <p><span class="highlight">Código de Confirmación:</span> ${codigo}</p>
                  <p><span class="highlight">Evento:</span> Reactiva-Petrol 2025</p>
                  <p><span class="highlight">Fechas:</span> 12 - 14 de Agosto, 2025</p>
                  <p><span class="highlight">Lugar:</span> Barrio Particular, Av. Aviación 441, Talara</p>
                  <p><span class="highlight">Horario:</span> 8:00 AM - 6:00 PM</p>
                  <p><span class="highlight">Modalidad:</span> Presencial</p>
                  <p><span class="highlight">Teléfono:</span> ${telefono}</p>
                  <p><span class="highlight">Tipo de Participante:</span> ${formattedTipo}</p>
                </div>
  
                <p>Presente este código QR y su credencial impresa o digital al ingreso del evento.</p>
  
                <div class="qr-container">
                  <img 
                    src="https://quickchart.io/qr?text=${codigo}&ecLevel=Q&size=250x250&format=png&margin=1"
                    alt="Código QR de Confirmación"
                    style="border-radius: 8px;"
                  />
                </div>
  
                <a href="https://reactivapetroltalara.online/" class="button">Ver Detalles del Evento</a>
  
                <p style="font-size: 13px; margin-top: 20px;">
                  Llegue 30 minutos antes del inicio para agilizar su acreditación.
                </p>
              </div>
  
              <div class="footer">
                <p>© 2025 Reactiva-Petrol. Todos los derechos reservados.</p>
                <p>Contacto: info@reactivapetrol.online | +51 987 654 321</p>
              </div>
            </div>
          </body>
        </html>
      `;
    smtpEmail.sender = {
      name: process.env.MAIL_SUBJECT || "Inscripciones Reactiva-Petrol",
      email: process.env.MAIL_NAME || "inscripciones@reactivapetrol.online",
    };

    // Adjuntar PDF
    smtpEmail.attachment = [
      {
        content: base64Pdf,
        name: `Credencial_${codigo}_${nombre.replace(/\s+/g, "_")}.pdf`,
      },
    ];

    // Enviar correo
    await apiInstance.sendTransacEmail(smtpEmail);
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw new Error("No se pudo enviar el correo.");
  }
}
