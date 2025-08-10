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
        width: 200,
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
            visibility: visible;
            font-family: monospace; /* Fuente recomendada para térmica */
            font-size: 10pt;
          }
          #printable-content {
            position: absolute;
            left: 0;
            bottom: 60%;
            width: 80mm; /* ancho típico de rollo térmico */
          }
        }

        /* Estilos para la vista previa */
        #printable-content.dialog-content-print-visible {
          font-family: monospace; /* Aplicar la misma fuente para la vista previa */
          font-size: 10pt;
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
            className="flex-1 bg-white text-black px-4 py-3 text-md flex flex-col items-center justify-between dialog-content-print-visible"
          >
            {participant ? (
              <>
                {/* Encabezado del evento */}
                <div className="text-center">
                  <p className="text-lg font-bold leading-tight">
                    Invitado Especial
                  </p>
                </div>
                <div className="text-center">
                  <div className="border-t border-gray-400 w-24 mx-auto my-2" />
                </div>
                {/* Encabezado del evento */}
                <div className="text-center mb-3">
                  <p className="text-lg font-bold leading-tight">
                    Congreso Internacional:
                    <br />
                    Reactivación Petrolera en las
                    <br />
                    Regiones Piura y Tumbes
                  </p>
                </div>

                {/* Datos del participante */}
                <div className="w-full space-y-[2px] text-md mb-4">
                  <p>
                    <span className="font-semibold">Código:</span>{" "}
                    {participant.codigo}
                  </p>
                  <p className="break-words">
                    <span className="font-semibold">Nombre:</span>{" "}
                    {capitalizeWords(participant.nombre)} 
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
                    {capitalizeWords(participant.dias)}
                  </p>
                </div>

                {/* QR centrado */}
                {qrUrl && (
                  <div className="my-2 flex justify-center">
                    <img src={qrUrl} alt="QR Code" className="w-40 h-40" />
                  </div>
                )}

                {/* Pie del pase */}
                <div className="text-center mt-3">
                  <div className="border-t border-gray-400 w-24 mx-auto my-2" />
                  <p>Presente este pase para su ingreso</p>
                  <p className="mt-1">{new Date().toLocaleDateString()}</p>
                  <div className="border-t border-gray-400 w-24 mx-auto my-2" />
                  <p>
                    <b className="text-lg">Guardar en un lugar seguro</b>
                  </p>
                </div>
              </>
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
