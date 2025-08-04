"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle,
  XCircle,
  Download,
  BadgeCheckIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { confirmPayment, rejectPayment } from "@/data/connections";

interface Payment {
  id: number;
  codigo: string;
  nombre: string;
  email: string;
  tipo_participante: string;
  monto: number;
  metodo_pago: string;
  estado_pago: "CONFIRMADO" | "PENDIENTE" | "RECHAZADO";
  fecha_registro: string;
  comprobante?: string | null;
  dias?: string | null; // Add the 'dias' field here
}

import { useRouter } from "next/navigation";

interface PaymentDetailDialogProps {
  payment: Payment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  router: any;
}

export function PaymentDetailDialog({
  payment,
  open,
  onOpenChange,
  router,
}: PaymentDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("detalles");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Fecha no disponible";

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "Fecha inválida";

      return new Intl.DateTimeFormat("es-ES", {
        weekday: "long", // Add day of the week
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error en fecha";
    }
  };

  const formatMonto = (monto: number | string | null) => {
    if (monto === null || monto === undefined) return "S/. 0.00";
    return `S/. ${Number(monto).toFixed(2)}`;
  };

  const handleApprovePayment = async () => {
    setIsProcessing(true);
    try {
      await confirmPayment(payment.id.toString());
      // Actualizar el estado del pago localmente
      setIsProcessing(false);
      onOpenChange(false);
      router.refresh();
      alert("Pago aprobado con éxito");
    } catch (error: any) {
      console.error("Error al aprobar el pago:", error);
      setIsProcessing(false);
      alert(
        "Error al aprobar el pago: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleRejectPayment = async () => {
    setIsProcessing(true);
    try {
      await rejectPayment(payment.id.toString());
      setIsProcessing(false);
      onOpenChange(false);
      router.refresh();
      alert("Pago rechazado con éxito");
    } catch (error: any) {
      console.error("Error al rechazar el pago:", error);
      setIsProcessing(false);
      alert(
        "Error al rechazar el pago: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDownloadComprobante = async () => {
    if (!payment.comprobante) return;

    try {
      // Fetch the image
      const response = await fetch(payment.comprobante);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Set filename - extract extension from URL or default to jpg
      const extension = payment.comprobante.split(".").pop() || "jpg";
      const filename = `comprobante_${payment.codigo}.${extension}`;

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading comprobante:", error);
      alert(
        "Error al descargar el comprobante. Por favor, intente nuevamente."
      );
    }
  };

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Pago</DialogTitle>
          <DialogDescription>ID: {payment.codigo}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="comprobante">Comprobante</TabsTrigger>
            <TabsTrigger value="acciones">Acciones</TabsTrigger>
          </TabsList>

          <TabsContent value="detalles" className="space-y-4 py-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500 ">Estado</h4>
                <Badge
                  variant="secondary"
                  className={
                    payment.estado_pago === "CONFIRMADO"
                      ? "bg-blue-500 text-white hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                      : payment.estado_pago === "PENDIENTE"
                      ? "bg-amber-500 text-white hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-500 transition-colors"
                      : "bg-red-500 text-white hover:bg-red-400 dark:bg-red-600 dark:hover:bg-red-500 transition-colors"
                  }
                >
                  {payment.estado_pago === "CONFIRMADO" ? (
                    <>
                      <BadgeCheckIcon className="mr-1 h-3 w-3" />
                      Confirmado
                    </>
                  ) : payment.estado_pago === "PENDIENTE" ? (
                    <>
                      <ClockIcon className="mr-1 h-3 w-3" />
                      Pendiente
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="mr-1 h-3 w-3" />
                      Rechazado
                    </>
                  )}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Dias</h4>
                <p>{payment.dias}</p>
              </div>
              <div className="col-span-3">
                <h4 className="text-sm font-medium text-gray-500">Fecha</h4>
                <p>{formatDate(payment.fecha_registro)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Información del Cliente
              </h4>
              <div className="rounded-md border p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Nombre / Empresa</p>
                    <p className="font-medium break-words">
                      {capitalizeWords(payment.nombre)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium break-words">{payment.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">
                Detalles del Pago
              </h4>
              <div className="rounded-md border p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Tipo de Pase</p>
                    <p className="font-medium">
                      {formatTipoParticipante(payment.tipo_participante)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monto</p>
                    <p className="font-medium">{formatMonto(payment.monto)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Método de Pago</p>
                    <p className="font-medium">
                      {capitalizeWords(payment.metodo_pago)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Comprobante</p>
                    <p className="font-medium">
                      {payment.comprobante ? "Disponible" : "No disponible"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {payment.estado_pago === "RECHAZADO" && (
              <Alert variant="destructive">
                <AlertDescription>
                  Este pago fue rechazado. Motivo: Comprobante no válido o monto
                  incorrecto.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="comprobante" className="py-4">
            {payment.comprobante ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative h-[300px] w-full max-w-[400px] overflow-hidden rounded-md border">
                    <Image
                      src={payment.comprobante}
                      alt="Comprobante de pago"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadComprobante}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Comprobante
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-[300px] items-center justify-center rounded-md border">
                <div className="text-center">
                  <p className="text-gray-500">No hay comprobante disponible</p>
                  <p className="text-sm text-gray-400">
                    Este método de pago no requiere comprobante o no se ha
                    subido.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="acciones" className="py-4">
            {payment.estado_pago === "PENDIENTE" ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleApprovePayment}
                    disabled={isProcessing}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprobar Pago
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Al aprobar, se confirmará la inscripción del participante.
                  </p>
                </div>

                <div className="space-y-2">
                  {/* <Label htmlFor="rejection-reason">Motivo de Rechazo</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Ingresa el motivo del rechazo..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  /> */}
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleRejectPayment}
                    disabled={isProcessing}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rechazar Pago
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    {payment.estado_pago === "CONFIRMADO"
                      ? "Este pago ya ha sido aprobado y completado."
                      : "Este pago ha sido rechazado."}
                  </AlertDescription>
                </Alert>

                {/* <Button className="w-full" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Correo al Participante
                </Button> */}

                {payment.estado_pago === "RECHAZADO" && (
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Cambiar a Aprobado
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const formatTipoParticipante = (tipo: string | null) => {
  if (!tipo) return "No disponible";

  const labels: { [key: string]: string } = {
    EMPRESAS: "Empresas",
    INSTITUCIONES: "Instituciones",
    PROFESIONALES_ESTUDIANTES: "Profesionales - Estudiantes",
    PUBLICO_EN_GENERAL: "Público en General",
    AUSPICIADOR: "Auspiciador",
    AUTORIDAD: "Autoridad",
    MEDIA_PARTNER: "Media Partner",
    ALUMNO_UNIVERSITARIO: "Alumno Universitario",
  };
  return labels[tipo] || tipo;
};
