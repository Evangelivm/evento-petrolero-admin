// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Download, Loader2, X } from "lucide-react"

// interface PDFViewerDialogProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   pdfUrl: string | null
//   title: string
//   inscription?: any
//   onGeneratePDF?: () => Promise<string | null>
// }

// export function PDFViewerDialog({
//   open,
//   onOpenChange,
//   pdfUrl,
//   title,
//   inscription,
//   onGeneratePDF,
// }: PDFViewerDialogProps) {
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(pdfUrl)
//   const [error, setError] = useState<string | null>(null)

//   const handleGeneratePDF = async () => {
//     if (!onGeneratePDF) return

//     setIsGenerating(true)
//     setError(null)

//     try {
//       const newPdfUrl = await onGeneratePDF()
//       if (newPdfUrl) {
//         setCurrentPdfUrl(newPdfUrl)
//       } else {
//         setError("No se pudo generar el PDF. Intente nuevamente.")
//       }
//     } catch (err) {
//       console.error("Error al generar PDF:", err)
//       setError("Ocurrió un error al generar el PDF. Intente nuevamente.")
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleDownload = () => {
//     if (!currentPdfUrl) return

//     // Crear un enlace temporal para descargar el PDF
//     const link = document.createElement("a")
//     link.href = currentPdfUrl
//     link.download = `Credencial_${inscription?.codigo || "participante"}.pdf`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
//         <DialogHeader>
//           <DialogTitle className="flex justify-between items-center">
//             <span>{title}</span>
//             <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
//               <X className="h-4 w-4" />
//             </Button>
//           </DialogTitle>
//           <DialogDescription>
//             {inscription
//               ? `Credencial de ${inscription.nombre} (${inscription.codigo})`
//               : "Visualización de credencial"}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex-1 min-h-[500px] border rounded-md overflow-hidden bg-gray-100">
//           {isGenerating ? (
//             <div className="w-full h-full flex flex-col items-center justify-center">
//               <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-4" />
//               <p className="text-gray-500">Generando PDF...</p>
//             </div>
//           ) : currentPdfUrl ? (
//             <iframe
//               src={currentPdfUrl}
//               className="w-full h-full border-0"
//               title="Visualización de PDF"
//               aria-label="Visualizador de PDF"
//             />
//           ) : (
//             <div className="w-full h-full flex flex-col items-center justify-center">
//               {error ? (
//                 <div className="text-center">
//                   <p className="text-red-500 mb-4">{error}</p>
//                   <Button onClick={handleGeneratePDF} disabled={isGenerating || !onGeneratePDF}>
//                     Intentar nuevamente
//                   </Button>
//                 </div>
//               ) : onGeneratePDF ? (
//                 <div className="text-center">
//                   <p className="text-gray-500 mb-4">No hay PDF disponible. Genere uno nuevo.</p>
//                   <Button onClick={handleGeneratePDF} disabled={isGenerating}>
//                     Generar PDF
//                   </Button>
//                 </div>
//               ) : (
//                 <p className="text-gray-500">No hay PDF disponible para visualizar.</p>
//               )}
//             </div>
//           )}
//         </div>

//         <DialogFooter className="flex justify-between items-center">
//           <div className="text-sm text-gray-500">
//             {currentPdfUrl ? "PDF generado correctamente" : "Sin PDF disponible"}
//           </div>
//           <div className="flex gap-2">
//             {currentPdfUrl && (
//               <Button onClick={handleDownload}>
//                 <Download className="mr-2 h-4 w-4" />
//                 Descargar PDF
//               </Button>
//             )}
//             <Button variant="outline" onClick={() => onOpenChange(false)}>
//               Cerrar
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
