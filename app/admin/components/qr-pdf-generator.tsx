"use client"
import QRCode from "qrcode"
import { jsPDF } from "jspdf"

interface InscripcionData {
  id: string
  codigo: string
  nombre: string
  email: string
  telefono: string
  empresa: string
  pais: string
  tipoPase: string
  metodoPago: string
  montoTotal: string
  fecha: string
}

export async function generateQRPDF(inscripcion: InscripcionData) {
  try {
    // Datos para el QR
    const qrData = JSON.stringify({
      evento: "REACTIVA-PETROL-2025",
      codigo: inscripcion.codigo,
      nombre: inscripcion.nombre,
      email: inscripcion.email,
      telefono: inscripcion.telefono,
      empresa: inscripcion.empresa,
      tipoPase: inscripcion.tipoPase,
      estado: "CONFIRMADO",
      fechaGeneracion: new Date().toISOString(),
    })

    // Generar QR Code
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })

    // Crear PDF
    const doc = new jsPDF()

    // Configurar colores
    const primaryColor = [34, 197, 94] as [number, number, number] // Verde
    const secondaryColor = [245, 158, 11] as [number, number, number] // Ámbar
    const darkColor = [31, 41, 55] as [number, number, number] // Gris oscuro
    const lightGray = [156, 163, 175] as [number, number, number] // Gris claro

    // Header con fondo verde
    doc.setFillColor(...primaryColor)
    doc.rect(0, 0, 210, 45, "F")

    // Logo y título
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    doc.text("REACTIVA-PETROL 2025", 105, 20, { align: "center" })

    doc.setFontSize(16)
    doc.setFont("helvetica", "normal")
    doc.text("Reactivación Petrolera en la Región Piura", 105, 30, { align: "center" })

    doc.setFontSize(12)
    doc.text("CREDENCIAL DE ACCESO", 105, 40, { align: "center" })

    // Información del participante
    doc.setTextColor(...darkColor)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("INFORMACIÓN DEL PARTICIPANTE", 20, 65)

    // Línea separadora
    doc.setDrawColor(...secondaryColor)
    doc.setLineWidth(2)
    doc.line(20, 70, 190, 70)

    // Datos del participante en dos columnas
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")

    let yPos = 85

    // Columna izquierda
    doc.setFont("helvetica", "bold")
    doc.text("Código de Inscripción:", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(inscripcion.codigo, 20, yPos + 6)

    doc.setFont("helvetica", "bold")
    doc.text("Nombre Completo:", 20, yPos + 18)
    doc.setFont("helvetica", "normal")
    doc.text(inscripcion.nombre, 20, yPos + 24)

    doc.setFont("helvetica", "bold")
    doc.text("Empresa/Institución:", 20, yPos + 36)
    doc.setFont("helvetica", "normal")
    doc.text(inscripcion.empresa, 20, yPos + 42)

    doc.setFont("helvetica", "bold")
    doc.text("País:", 20, yPos + 54)
    doc.setFont("helvetica", "normal")
    doc.text(inscripcion.pais, 20, yPos + 60)

    // Columna derecha
    doc.setFont("helvetica", "bold")
    doc.text("Email:", 110, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(inscripcion.email, 110, yPos + 6)

    doc.setFont("helvetica", "bold")
    doc.text("Teléfono:", 110, yPos + 18)
    doc.setFont("helvetica", "normal")
    doc.text(inscripcion.telefono, 110, yPos + 24)

    doc.setFont("helvetica", "bold")
    doc.text("Tipo de Participante:", 110, yPos + 36)
    doc.setFont("helvetica", "normal")
    const tipoLabels: { [key: string]: string } = {
      empresas: "Empresas",
      profesionales: "Instituciones",
      estudiante: "Profesionales - Estudiantes",
      publico: "Público en General",
    }
    doc.text(tipoLabels[inscripcion.tipoPase] || inscripcion.tipoPase, 110, yPos + 42)

    doc.setFont("helvetica", "bold")
    doc.text("Estado:", 110, yPos + 54)
    doc.setTextColor(...primaryColor)
    doc.setFont("helvetica", "bold")
    doc.text("✓ CONFIRMADO", 110, yPos + 60)

    // QR Code
    doc.addImage(qrCodeDataURL, "PNG", 150, 85, 50, 50)
    doc.setTextColor(...lightGray)
    doc.setFontSize(9)
    doc.text("Código QR de Acceso", 175, 145, { align: "center" })

    // Información del evento
    doc.setTextColor(...darkColor)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("INFORMACIÓN DEL EVENTO", 20, 170)

    doc.setDrawColor(...secondaryColor)
    doc.line(20, 175, 190, 175)

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    yPos = 185

    const eventoInfo = [
      "📅 Fechas: 12-14 de Agosto, 2025",
      "📍 Lugar: Barrio Particular, Av. Aviación 441, Talara 20811",
      "🕐 Horario: 8:00 AM - 6:00 PM",
      "🎫 Modalidad: Presencial",
    ]

    eventoInfo.forEach((info, index) => {
      doc.text(info, 20, yPos + index * 8)
    })

    // Instrucciones importantes
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("INSTRUCCIONES IMPORTANTES", 20, 225)

    doc.setDrawColor(...secondaryColor)
    doc.line(20, 230, 190, 230)

    const instrucciones = [
      "• Presente esta credencial al momento de ingresar al evento",
      "• El código QR será escaneado para validar su acceso",
      "• Llegue 30 minutos antes del inicio para acreditación",
      "• Conserve este documento durante todo el evento",
      "• Para consultas: info@reactivapetrol.online | +51 987 654 321",
    ]

    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    instrucciones.forEach((instruccion, index) => {
      doc.text(instruccion, 20, 240 + index * 6)
    })

    // Footer
    doc.setTextColor(...lightGray)
    doc.setFontSize(8)
    doc.text(
      `Generado el ${new Date().toLocaleDateString("es-ES")} a las ${new Date().toLocaleTimeString("es-ES")}`,
      105,
      275,
      { align: "center" },
    )
    doc.text("© 2025 Reactiva-Petrol. Todos los derechos reservados.", 105, 285, { align: "center" })

    // Convertir a blob para envío por email
    const pdfBlob = doc.output("blob")

    // Simular envío de email
    await sendCredentialEmail(inscripcion, pdfBlob)

    return pdfBlob
  } catch (error) {
    console.error("Error generando PDF:", error)
    throw error
  }
}

async function sendCredentialEmail(inscripcion: InscripcionData, pdfBlob: Blob) {
  try {
    // Simular envío de email con PDF adjunto
    console.log(`Enviando credencial por email a: ${inscripcion.email}`)

    // En una implementación real, aquí enviarías el email con el PDF adjunto
    // usando un servicio como Nodemailer, SendGrid, etc.

    const formData = new FormData()
    formData.append("email", inscripcion.email)
    formData.append("nombre", inscripcion.nombre)
    formData.append("codigo", inscripcion.codigo)
    formData.append("pdf", pdfBlob, `Credencial_${inscripcion.codigo}.pdf`)

    // Simular delay de envío
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Email enviado exitosamente")
    return true
  } catch (error) {
    console.error("Error enviando email:", error)
    throw error
  }
}

export { sendCredentialEmail }
