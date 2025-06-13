"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Persona {
  nombre: string;
  telefono: string;
}

interface FormData {
  tipoParticipante: string;
  nombre: string;
  telefono: string;
  ruc: string;
  email: string;
  personas: Persona[];
  terminosCondiciones: boolean;
}

export default function EventRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    tipoParticipante: "",
    nombre: "",
    telefono: "",
    ruc: "",
    email: "",
    personas: Array(5)
      .fill(null)
      .map(() => ({ nombre: "", telefono: "" })),
    terminosCondiciones: false,
  });

  const specialTypes: string[] = [];
  const isSpecialType = specialTypes.includes(formData.tipoParticipante);
  const isProfesionales =
    formData.tipoParticipante === "profesionales" ||
    formData.tipoParticipante === "empresas";

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePersona = (
    index: number,
    field: keyof Persona,
    value: string
  ) => {
    const newPersonas = [...formData.personas];
    newPersonas[index] = { ...newPersonas[index], [field]: value };
    setFormData((prev) => ({ ...prev, personas: newPersonas }));
  };

  // Validación personalizada antes del envío
  const validateForm = (): string | null => {
    if (!formData.tipoParticipante) {
      return "Por favor seleccione el tipo de participante.";
    }

    if (isSpecialType) {
      if (!formData.ruc || formData.ruc.length !== 11) {
        return "El RUC debe tener exactamente 11 dígitos.";
      }
      if (!formData.email || !formData.email.includes("@")) {
        return "Por favor ingrese un correo electrónico válido.";
      }
      for (let i = 0; i < 5; i++) {
        const persona = formData.personas[i];
        if (!persona.nombre || persona.nombre.length < 2) {
          return `El nombre de la persona ${
            i + 1
          } debe tener al menos 2 caracteres.`;
        }
        if (!persona.telefono || !/^\d{9}$/.test(persona.telefono)) {
          return `El teléfono de la persona ${
            i + 1
          } debe tener exactamente 9 dígitos.`;
        }
      }
    } else if (isProfesionales) {
      if (!formData.nombre || formData.nombre.length < 2) {
        return "El nombre debe tener al menos 2 caracteres.";
      }
      if (!formData.telefono || !/^\d{9}$/.test(formData.telefono)) {
        return "El teléfono debe tener exactamente 9 dígitos.";
      }
      if (!formData.ruc || formData.ruc.length !== 11) {
        return "El RUC debe tener exactamente 11 dígitos.";
      }
      if (!formData.email || !formData.email.includes("@")) {
        return "Por favor ingrese un correo electrónico válido.";
      }
    } else {
      if (!formData.nombre || formData.nombre.length < 2) {
        return "El nombre debe tener al menos 2 caracteres.";
      }
      if (!formData.telefono || !/^\d{9}$/.test(formData.telefono)) {
        return "El teléfono debe tener exactamente 9 dígitos.";
      }
    }

    if (!formData.terminosCondiciones) {
      return "Debe aceptar los términos y condiciones para continuar.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Formulario enviado con valores:", formData);

    // Validación personalizada
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      // Generar código de inscripción único
      const codigoInscripcion = `RP2025-${Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase()}`;

      // Determinar precio según tipo de participante
      let precio = 0;
      const moneda = "S/";
      switch (formData.tipoParticipante) {
        case "empresas":
          precio = 1000;
          break;
        case "profesionales": // instituciones
          precio = 500;
          break;
        case "estudiante": // profesionales - estudiantes
          precio = 220;
          break;
        case "publico":
          precio = 220;
          break;
        default:
          precio = 220;
      }

      // Preparar datos para el email
      // const emailData = {
      //   codigo: codigoInscripcion,
      //   tipo: formData.tipoParticipante,
      //   nombre: formData.nombre,
      //   telefono: formData.telefono,
      //   ruc: formData.ruc,
      //   email: formData.email,
      //   personas: isSpecialType ? formData.personas : undefined,
      // }

      // // Enviar email si hay dirección de correo
      // if (emailData.email) {
      //   try {
      //     console.log("Enviando email con datos:", emailData)

      //     const response = await fetch("/api/send-email", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify(emailData),
      //     })

      //     console.log("Respuesta del servidor:", response.status, response.statusText)

      //     // Verificar si la respuesta es exitosa
      //     if (!response.ok) {
      //       const errorText = await response.text()
      //       console.error("Error del servidor:", errorText)
      //       throw new Error(`Error del servidor: ${response.status} - ${errorText}`)
      //     }

      //     // Verificar si la respuesta es JSON válido
      //     const contentType = response.headers.get("content-type")
      //     if (!contentType || !contentType.includes("application/json")) {
      //       const responseText = await response.text()
      //       console.error("Respuesta no es JSON:", responseText)
      //       throw new Error("La respuesta del servidor no es JSON válido")
      //     }

      //     const result = await response.json()
      //     console.log("Resultado del email:", result)

      //     if (!result.success) {
      //       console.error("Error enviando email:", result.message)
      //       // No detener el proceso, solo registrar el error
      //     } else {
      //       console.log("Email enviado exitosamente")
      //     }
      //   } catch (emailError) {
      //     console.error("Error en el envío de email:", emailError)
      //     // No detener el proceso, continuar con la redirección
      //   }
      // }

      // Crear parámetros para la URL
      const params = new URLSearchParams({
        codigo: codigoInscripcion,
        tipo: formData.tipoParticipante,
        precio: precio.toString(),
        moneda: moneda,
      });

      // Agregar datos según el tipo
      if (isSpecialType) {
        params.append("ruc", formData.ruc);
        params.append("email", formData.email);
        params.append("personas", JSON.stringify(formData.personas));
      } else {
        params.append("nombre", formData.nombre);
        params.append("telefono", formData.telefono);
        if (isProfesionales) {
          params.append("ruc", formData.ruc);
          params.append("email", formData.email);
        }
      }

      // Redirigir según el tipo
      if (isSpecialType) {
        window.location.href = `/evento-tickets?${params.toString()}`;
      } else {
        window.location.href = `/evento-pago?${params.toString()}`;
      }
    } catch (error) {
      console.error("Error general en el envío:", error);
      alert(
        "Hubo un error al procesar su inscripción. Por favor, inténtelo nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label className="text-lg font-semibold">Tipo de Participante</Label>
        <RadioGroup
          value={formData.tipoParticipante}
          onValueChange={(value) => updateField("tipoParticipante", value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="empresas" id="empresas" />
            <Label htmlFor="empresas" className="font-normal cursor-pointer">
              EMPRESAS
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="profesionales" id="profesionales" />
            <Label
              htmlFor="profesionales"
              className="font-normal cursor-pointer"
            >
              INSTITUCIONES
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="estudiante" id="estudiante" />
            <Label htmlFor="estudiante" className="font-normal cursor-pointer">
              PROFESIONALES - ESTUDIANTES
            </Label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="publico" id="publico" />
            <Label htmlFor="publico" className="font-normal cursor-pointer">
              PUBLICO EN GENERAL
            </Label>
          </div>
        </RadioGroup>
      </div>

      {!isSpecialType && (
        <div>
          <Label>
            {isProfesionales
              ? "Nombre de la Empresa/Institución"
              : "Nombre Completo"}
          </Label>
          <Input
            placeholder={
              isProfesionales
                ? "Ingrese el nombre de la empresa o institución"
                : "Ingrese su nombre completo"
            }
            value={formData.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
          />
        </div>
      )}

      {(isProfesionales || isSpecialType) && (
        <>
          <div>
            <Label>RUC de la Empresa/Institución</Label>
            <Input
              placeholder="Ingrese el RUC de la empresa o institución"
              value={formData.ruc}
              onChange={(e) => updateField("ruc", e.target.value)}
            />
          </div>

          <div>
            <Label>Correo Electrónico</Label>
            <Input
              placeholder="correo@empresa.com"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
        </>
      )}

      {isSpecialType && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Registro de 5 Personas</h3>
          {formData.personas.map((persona, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-4">
              <h4 className="font-medium">Persona {index + 1}</h4>
              <div>
                <Label>Nombre Completo</Label>
                <Input
                  placeholder="Ingrese el nombre completo"
                  value={persona.nombre}
                  onChange={(e) =>
                    updatePersona(index, "nombre", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  placeholder="987654321"
                  value={persona.telefono}
                  onChange={(e) =>
                    updatePersona(index, "telefono", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isSpecialType && (
        <div>
          <Label>Teléfono</Label>
          <Input
            placeholder="987654321"
            value={formData.telefono}
            onChange={(e) => updateField("telefono", e.target.value)}
          />
        </div>
      )}

      <div className="flex items-start space-x-3">
        <Checkbox
          id="terminos"
          checked={formData.terminosCondiciones}
          onCheckedChange={(checked) =>
            updateField("terminosCondiciones", checked)
          }
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="terminos" className="cursor-pointer">
            Acepto los términos y condiciones del evento
          </Label>
          <p className="text-sm text-gray-600">
            Al marcar esta casilla, acepta recibir información sobre el evento y
            confirma que los datos proporcionados son correctos.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando inscripción..." : "Enviar Inscripción"}
      </Button>
    </form>
  );
}
