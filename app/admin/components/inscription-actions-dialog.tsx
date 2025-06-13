"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, QrCode, Mail, Clock, Download } from "lucide-react"
import { generateQRPDF } from "./qr-pdf-generator"

interface InscriptionActionsDialogProps {
  inscription: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onPaymentConfirmed: (inscriptionId: string) => void
  onQRGenerated: (inscriptionId: string) => void
}

export function InscriptionActionsDialog({
  inscription,
  open,
  onOpenChange,
  onPaymentConfirmed,
  onQRGenerated,
}: InscriptionActionsDialogProps) {
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false)
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)

  const handleConfirmPayment = async () => {
    setIsConfirmingPayment(true)
    try {
      // Simular confirmación de pago
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onPaymentConfirmed(inscription.id)
      console.log(`Pago confirmado para ${inscription.codigo}`)
    } catch (error) {
      console.error("Error al confirmar pago:", error)
    } finally {
      setIsConfirmingPayment(false)
    }
  }

  const handleGenerateQR = async () => {
    setIsGeneratingQR(true)
    try {
      await generateQRPDF(inscription)
      onQRGenerated(inscription.id)
      console.log(`QR generado y enviado para ${inscription.codigo}`)
    } catch (error) {
      console.error("Error al generar QR:", error)
    } finally {
      setIsGeneratingQR(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "registrado":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "pago_confirmado":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "qr_generado":
        return "bg-green-100 text-green-800 border-green-300"
      case "completado":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "registrado":
        return "Registrado"
      case "pago_confirmado":
        return "Pago Confirmado"
      case "qr_generado":
        return "QR Generado"
      case "completado":
        return "Completado"
      default:
        return estado
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gestionar Inscripción</DialogTitle>
          <DialogDescription>Código: {inscription?.codigo}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del participante */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Información del Participante</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Nombre:</span> {inscription?.nombre}
              </p>
              <p>
                <span className="font-medium">Email:</span> {inscription?.email}
              </p>
              <p>
                <span className="font-medium">Empresa:</span> {inscription?.empresa}
              </p>
              <p>
                <span className="font-medium">Tipo:</span> {inscription?.tipoPase}
              </p>
            </div>
          </div>

          {/* Estado actual */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Estado actual:</span>
            <Badge className={getEstadoColor(inscription?.estadoInscripcion)}>
              {getEstadoLabel(inscription?.estadoInscripcion)}
            </Badge>
          </div>

          {/* Acciones según el estado */}
          <div className="space-y-3">
            {inscription?.estadoInscripcion === "registrado" && (
              <div className="space-y-3">
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Esta inscripción está pendiente de confirmación de pago. Una vez confirmado, podrá generar la
                    credencial.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleConfirmPayment}
                  disabled={isConfirmingPayment}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isConfirmingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Confirmando Pago...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmar Pago
                    </>
                  )}
                </Button>
              </div>
            )}

            {inscription?.estadoInscripcion === "pago_confirmado" && (
              <div className="space-y-3">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    El pago ha sido confirmado. Ahora puede generar la credencial con QR y enviarla por correo.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleGenerateQR}
                  disabled={isGeneratingQR}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isGeneratingQR ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generando QR y Enviando...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Generar QR y Enviar por Email
                    </>
                  )}
                </Button>
              </div>
            )}

            {(inscription?.estadoInscripcion === "qr_generado" || inscription?.estadoInscripcion === "completado") && (
              <div className="space-y-3">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    La credencial ha sido generada y enviada por correo. El participante está listo para el evento.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Reenviar Email
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
