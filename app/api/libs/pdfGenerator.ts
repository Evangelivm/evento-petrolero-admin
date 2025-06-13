import QRCode from "qrcode";
import { jsPDF } from "jspdf";

/**
 * 📄 Genera un PDF grande (A4) con toda la información
 */
export async function generateLargePDFBuffer(
  inscripcion: any
): Promise<Uint8Array> {
  try {
    const qrData = JSON.stringify(inscripcion.codigo);
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "Q",
    });

    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [34, 197, 94]; // Verde petrolero

    // Header con fondo verde
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 45, "F");

    // Logo y título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("REACTIVA - PETROL 2025", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Reactivación Petrolera en la Región Piura", 105, 30, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CREDENCIAL DE ACCESO", 105, 40, { align: "center" });

    // Información del participante
    doc.setTextColor(31, 41, 55); // Gris oscuro
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL PARTICIPANTE", 20, 65);

    // Línea separadora
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(2);
    doc.line(20, 70, 190, 70);

    // Datos del participante en dos columnas
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let yPos = 85;

    // Columna izquierda
    doc.setFont("helvetica", "bold");
    doc.text("Código de Inscripción:", 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(inscripcion.codigo, 20, yPos + 6);
    doc.setFont("helvetica", "bold");
    doc.text("Nombre Completo:", 20, yPos + 18);
    doc.setFont("helvetica", "normal");
    doc.text(inscripcion.nombre, 20, yPos + 24);
    doc.setFont("helvetica", "bold");
    doc.text("Email:", 20, yPos + 36);
    doc.setFont("helvetica", "normal");
    doc.text(inscripcion.email, 20, yPos + 42);
    doc.setFont("helvetica", "bold");
    doc.text("Teléfono:", 20, yPos + 54);
    doc.setFont("helvetica", "normal");
    doc.text(inscripcion.telefono, 20, yPos + 60);

    // Columna derecha
    doc.setFont("helvetica", "bold");
    doc.text("Tipo de Participante:", 83, yPos);
    doc.setFont("helvetica", "normal");
    const tipoLabels: { [key: string]: string } = {
      EMPRESAS: "Empresas",
      INSTITUCIONES: "Instituciones",
      PROFESIONALES_ESTUDIANTES: "Profesionales - Estudiantes",
      PUBLICO_EN_GENERAL: "Público en General",
    };
    doc.text(
      tipoLabels[inscripcion.tipo_participante] ||
        inscripcion.tipo_participante,
      83,
      yPos + 6
    );
    doc.setFont("helvetica", "bold");
    doc.text("Estado:", 83, yPos + 18);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "normal");
    doc.text("CONFIRMADO", 83, yPos + 24);

    // QR Code
    doc.addImage(qrCodeDataURL, "PNG", 141, 85, 50, 50);
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Código QR de Acceso", 166, 145, { align: "center" });

    // Información del evento
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL EVENTO", 20, 170);
    doc.setDrawColor(245, 158, 11);
    doc.line(20, 175, 190, 175);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    yPos = 185;
    const eventoInfo = [
      "Fechas: 12-14 de Agosto, 2025",
      "Lugar: Barrio Particular, Av. Aviación 441, Talara 20811",
      "Horario: 8:00 AM - 6:00 PM",
      "Modalidad: Presencial",
    ];
    eventoInfo.forEach((info, index) => {
      doc.text(info, 20, yPos + index * 8);
    });

    // Instrucciones importantes
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCCIONES IMPORTANTES", 20, 225);
    doc.setDrawColor(245, 158, 11);
    doc.line(20, 230, 190, 230);
    const instrucciones = [
      "• Presente esta credencial al momento de ingresar al evento",
      "• El código QR será escaneado para validar su acceso",
      "• Llegue 30 minutos antes del inicio para acreditación",
      "• Conserve este documento durante todo el evento",
      "• Para consultas: info@reactivapetrol.online | +51 987 654 321",
    ];
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    instrucciones.forEach((instruccion, index) => {
      doc.text(instruccion, 20, 240 + index * 6);
    });

    // Footer
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.text(
      `Generado el ${new Date().toLocaleDateString(
        "es-ES"
      )} a las ${new Date().toLocaleTimeString("es-ES")}`,
      105,
      275,
      { align: "center" }
    );
    doc.text(
      "© 2025 Reactiva-Petrol. Todos los derechos reservados.",
      105,
      285,
      {
        align: "center",
      }
    );

    return new Uint8Array(doc.output("arraybuffer") as ArrayBuffer);
  } catch (error) {
    console.error("Error generando PDF grande:", error);
    throw error;
  }
}

/**
 * 🔑 Genera un PDF pequeño (tipo tarjeta)
 */
export async function generateSmallPDFBuffer(
  inscripcion: any
): Promise<Uint8Array> {
  try {
    const qrData = JSON.stringify(inscripcion.codigo);
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 400,
      margin: 1,
      color: { dark: "#000000", light: "#ffffff" },
      errorCorrectionLevel: "Q",
    });

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [100, 150],
    });

    const colors = {
      orange: [255, 152, 0] as [number, number, number],
      green: [76, 175, 80] as [number, number, number],
      darkGreen: [46, 125, 50] as [number, number, number],
      white: [255, 255, 255] as [number, number, number],
      lightGreen: [200, 230, 201] as [number, number, number],
    };

    // Fondo verde suave
    doc.setFillColor(...colors.lightGreen);
    doc.rect(0, 0, 100, 150, "F");

    // Borde naranja principal
    doc.setDrawColor(...colors.orange);
    doc.setLineWidth(3);
    doc.rect(5, 5, 90, 140, "S");

    // Título principal
    doc.setFillColor(...colors.green);
    doc.rect(10, 10, 80, 35, "F");
    doc.setTextColor(...colors.white);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("REACTIVACIÓN PETROLERA", 50, 20, { align: "center" });
    doc.text("EN LA REGIÓN PIURA", 50, 26, { align: "center" });

    // Fecha
    doc.setFillColor(...colors.orange);
    doc.rect(25, 50, 50, 15, "F");
    doc.setTextColor(...colors.white);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("12-14", 50, 60, { align: "center" });
    doc.setFontSize(10);
    doc.text("AGOSTO", 50, 65, { align: "center" });

    // Credencial de acceso
    doc.setTextColor(...colors.darkGreen);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CREDENCIAL DE ACCESO", 50, 78, { align: "center" });

    // Código
    doc.setFillColor(...colors.green);
    doc.rect(15, 85, 70, 10, "F");
    doc.setTextColor(...colors.white);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`CÓDIGO: ${inscripcion.codigo}`, 50, 91, { align: "center" });

    // QR
    const qrSize = 30;
    const qrX = (100 - qrSize) / 2;
    doc.setDrawColor(...colors.orange);
    doc.setLineWidth(2);
    doc.rect(qrX - 3, 95, qrSize + 6, qrSize + 6, "S");
    doc.setFillColor(...colors.white);
    doc.rect(qrX - 1, 97, qrSize + 2, qrSize + 2, "F");
    doc.addImage(qrCodeDataURL, "PNG", qrX, 100, qrSize, qrSize);

    // Fecha y hora
    doc.setTextColor(...colors.darkGreen);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("FECHA Y HORA DE EMISIÓN:", 32, 135, { align: "center" });
    const fechaCompleta = new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const horaCompleta = new Date().toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(`${fechaCompleta}, ${horaCompleta}`, 66.5, 135, {
      align: "center",
    });

    return new Uint8Array(doc.output("arraybuffer") as ArrayBuffer);
  } catch (error) {
    console.error("Error generando PDF pequeño:", error);
    throw error;
  }
}
