import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../libs/brevo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
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
    } = body;

    // Validación de campos obligatorios
    if (!codigo || !email || !nombre || !telefono || !tipo_participante) {
      return NextResponse.json(
        {
          message:
            "Faltan campos obligatorios: codigo, email, nombre, telefono o tipoPase",
        },
        { status: 400 }
      );
    }

    // Llamamos a la función que envía el correo
    await sendEmail({
      codigo,
      email,
      nombre,
      telefono,
      tipo_participante,
    });

    return NextResponse.json(
      {
        message: "Correo enviado exitosamente con credencial adjunta.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error en la ruta /api/send-email:", error);
    return NextResponse.json(
      {
        message: "Error al enviar el correo.",
        error: error.message || "Error desconocido",
      },
      { status: 500 }
    );
  }
}
