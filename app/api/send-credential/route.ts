import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string
    const nombre = formData.get("nombre") as string
    const codigo = formData.get("codigo") as string
    const pdfFile = formData.get("pdf") as File

    console.log("Enviando credencial por email:")
    console.log("- Email:", email)
    console.log("- Nombre:", nombre)
    console.log("- Código:", codigo)
    console.log("- PDF Size:", pdfFile?.size)

    // En una implementación real, aquí usarías un servicio de email como:
    // - Nodemailer
    // - SendGrid
    // - Resend
    // - Amazon SES

    // Simular envío de email
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simular éxito/fallo aleatorio para testing
    const success = Math.random() > 0.1 // 90% de éxito

    if (!success) {
      throw new Error("Error simulado en el envío de email")
    }

    return NextResponse.json({
      success: true,
      message: `Credencial enviada exitosamente a ${email}`,
      codigo,
    })
  } catch (error) {
    console.error("Error enviando credencial:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al enviar la credencial por email",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
