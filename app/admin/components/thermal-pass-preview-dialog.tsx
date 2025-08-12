"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ThermalPassPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: {
    codigo: string;
    nombre: string;
    tipo_participante: string;
    estado_pago: string;
    asistio: string;
    dias: string;
  } | null;
}

export function ThermalPassPreviewDialog({
  open,
  onOpenChange,
  participant,
}: ThermalPassPreviewDialogProps) {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (participant?.codigo) {
      generateQR(participant.codigo);
    }
  }, [participant]);

  const generateQR = async (codigo: string) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(codigo, {
        width: 60, // Reducir el tamaño del QR Code
        margin: 1,
        color: { dark: "#000000", light: "#FFFFFF" },
      });
      setQrUrl(qrCodeDataURL);
    } catch (err) {
      console.error("Error generando QR:", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const capitalizeWords = (str: string) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const formatTipoParticipante = (tipo: string) => {
    const labels: Record<string, string> = {
      EMPRESAS: "Empresas",
      INSTITUCIONES: "Instituciones",
      PROFESIONALES: "Profesionales",
      ESTUDIANTES: "Estudiantes",
      PUBLICO_EN_GENERAL: "Público en General",
      AUSPICIADOR: "Auspiciador",
      AUTORIDAD: "Autoridad",
      MEDIA_PARTNER: "Media Partner",
      ALUMNO_UNIVERSITARIO: "Alumno Universitario",
    };
    return labels[tipo] || capitalizeWords(tipo);
  };

  return (
    <>
      {/* Estilos para impresión térmica */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible !important;
          }
          #printable-content {
            position: absolute;
            bottom: 15%;
            right: 25%;
            width: 90mm;
            height: 90mm;
            padding: 0;
            box-sizing: border-box;
            transform-origin: top left;
            transform: rotate(90deg) translate(0%, -100%);
          }
        }
      `}</style>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[80mm] min-h-[120mm] flex flex-col p-0">
          {/* Encabezado del diálogo (no se imprime) */}
          <DialogHeader className="print-hidden px-3 py-2">
            <DialogTitle className="text-sm font-semibold">
              Vista Previa de Pase
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Previsualización en papel térmico
            </DialogDescription>
          </DialogHeader>

          {/* Contenido imprimible */}
          <div
            id="printable-content"
            className="flex-1 bg-white text-black px-2 py-1 text-md flex flex-col items-start justify-start"
          >
            {participant ? (
              <div className="w-full flex flex-col items-start">
                {/* Encabezado del evento */}
                <div className="text-left mb-1">
                  <p className="text-lg font-bold leading-tight">
                    Pase para Comida
                  </p>
                </div>
                {/* Datos del participante */}
                <div className="w-full space-y-0.5 text-xs mb-1">
                  <p>
                    <span className="font-semibold">Código:</span>{" "}
                    {participant.codigo}
                  </p>
                  <p className="break-words">
                    <span className="font-semibold">Nombre:</span>{" "}
                    {formatTipoParticipante(participant.nombre)}
                  </p>
                  <p>
                    <span className="font-semibold">Tipo:</span>{" "}
                    {formatTipoParticipante(participant.tipo_participante)}
                  </p>
                  <p>
                    <span className="font-semibold">Estado:</span>{" "}
                    {capitalizeWords(participant.estado_pago)}
                  </p>
                  <p>
                    <span className="font-semibold">Días:</span>{" "}
                    {participant.dias}
                  </p>
                </div>

                {/* QR centrado */}
                {qrUrl && (
                  <div className="my-1 flex justify-start">
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="w-32 h-32" // Tamaño reducido del QR Code
                    />
                  </div>
                )}

                {/* Pie del pase */}
                <div className="text-left mt-1 text-xs"></div>
              </div>
            ) : (
              <p className="text-gray-500">No hay datos para mostrar.</p>
            )}
          </div>

          {/* Botones ocultos en impresión */}
          <DialogFooter className="print-hidden px-3 py-2">
            <Button variant="outline" onClick={handlePrint} size="sm">
              Imprimir
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              size="sm"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
