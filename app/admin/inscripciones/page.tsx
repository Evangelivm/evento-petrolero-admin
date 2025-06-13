"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Filter,
  Search,
  Check,
  Loader2,
  CheckCircle,
  Clock,
  BadgeCheckIcon,
  ClockIcon,
  XCircleIcon,
  MailCheck,
  FileText,
  User,
  RefreshCcw,
} from "lucide-react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { getParticipants, updateCorreoEnviado } from "@/data/connections";
import { useRouter } from "next/navigation";

export default function InscripcionesPage() {
  const router = useRouter();
  const [inscripcionesData, setInscripcionesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [paseFilter, setPaseFilter] = useState<string>("all");
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);
  const [toastShow, setToastShow] = useState(false);
  const [toastStatus, setToastStatus] = useState<
    "generating" | "success" | "error"
  >("generating");
  const [toastMessage, setToastMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const fetchInscripciones = async () => {
    try {
      setIsLoading(true);
      const data = await getParticipants();
      setInscripcionesData(data);
    } catch (error) {
      console.error("Error fetching inscripciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInscripciones();
  }, []);

  const handleSendEmail = async (inscripcion: any) => {
    setIsSendingEmail(inscripcion.codigo);
    try {
      await updateCorreoEnviado({
        id: inscripcion.id.toString(),
        codigo: inscripcion.codigo,
        email: inscripcion.email,
        nombre: inscripcion.nombre,
        telefono: inscripcion.telefono.toString(),
        tipo_participante: inscripcion.tipo_participante,
      });

      setToastStatus("success");
      setToastMessage(`Correo enviado a ${inscripcion.email}`);
      setToastShow(true);
      await fetchInscripciones(); // Recargar datos después de enviar el correo
    } catch (error) {
      setToastStatus("error");
      setToastMessage("Error al enviar correo.");
      console.error("Error al enviar correo:", error);
    } finally {
      setIsSendingEmail(null);
    }
  };

  const generateAndDownloadPDF = async (inscripcion: any) => {
    try {
      // Datos para el QR
      const qrData = JSON.stringify(inscripcion.codigo);
      // Generar QR Code
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "Q",
      });
      // Crear PDF
      const doc = new jsPDF();
      const primaryColor: [number, number, number] = [34, 197, 94]; // Verde
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
      doc.text(inscripcion.telefono.toString(), 20, yPos + 60);
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
        { align: "center" }
      );
      // Descargar el PDF
      doc.save(
        `Credencial_${inscripcion.codigo}_${inscripcion.nombre.replace(
          /\s+/g,
          "_"
        )}.pdf`
      );
    } catch (error) {
      console.error("Error generando PDF:", error);
      throw error;
    }
  };

  const handleDownloadPDF = async (inscripcion: any) => {
    setIsDownloading(inscripcion.codigo);
    try {
      console.log(
        "🚀 Generando credencial minimalista para:",
        inscripcion.nombre
      );

      // Datos para el QR
      const qrData = JSON.stringify({
        evento: "REACTIVA-PETROL-2025",
        codigo: inscripcion.codigo,
        nombre: inscripcion.nombre,
        telefono: inscripcion.telefono.toString(), // Add if you're including telefono in QR
        estado: "CONFIRMADO",
        fechaGeneracion: new Date().toISOString(),
      });

      console.log("📱 Generando código QR...");
      const qrCodeDataURL = await QRCode.toDataURL(qrData, {
        width: 400,
        margin: 1,
        color: { dark: "#000000", light: "#ffffff" },
      });

      console.log("📄 Creando documento PDF...");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [100, 150],
      });

      const colors = {
        orange: [255, 152, 0] as [number, number, number],
        green: [76, 175, 80] as [number, number, number],
        darkGreen: [46, 125, 50] as [number, number, number],
        dark: [33, 37, 41] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
        lightGreen: [200, 230, 201] as [number, number, number],
      };

      // === FONDO VERDE SUAVE ===
      doc.setFillColor(...colors.lightGreen);
      doc.rect(0, 0, 100, 150, "F");

      // === BORDE NARANJA PRINCIPAL ===
      doc.setDrawColor(...colors.orange);
      doc.setLineWidth(3);
      doc.rect(5, 5, 90, 140, "S");

      // === BORDE INTERNO NARANJA ===
      doc.setLineWidth(1);
      doc.rect(8, 8, 84, 134, "S");

      // === HEADER SECTION CON FONDO VERDE ===
      let currentY = 15;

      // Fondo verde para el header
      doc.setFillColor(...colors.green);
      doc.rect(10, 10, 80, 35, "F");

      // Título principal en blanco
      doc.setTextColor(...colors.white);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("REACTIVACIÓN PETROLERA", 50, currentY + 5, { align: "center" });
      currentY += 6;
      doc.text("EN LA REGIÓN PIURA", 50, currentY + 5, { align: "center" });
      currentY += 12;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Hotel Pacífico Talara", 50, currentY + 5, { align: "center" });

      // === FECHA CON FONDO NARANJA ===
      currentY = 50;
      doc.setFillColor(...colors.orange);
      doc.rect(25, currentY - 0.5, 50, 15, "F");
      doc.setTextColor(...colors.white);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("12-14", 50, currentY + 6, { align: "center" });
      doc.setFontSize(10);
      doc.text("AGOSTO", 50, currentY + 12, { align: "center" });

      // === LÍNEA SEPARADORA NARANJA ===
      currentY += 20;
      doc.setDrawColor(...colors.orange);
      doc.setLineWidth(2);
      doc.line(15, currentY, 85, currentY);

      // === TÍTULO CREDENCIAL ===
      currentY += 8;
      doc.setTextColor(...colors.darkGreen);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("CREDENCIAL DE ACCESO", 50, currentY + 1.2, { align: "center" });

      // === CÓDIGO CON FONDO VERDE ===
      currentY += 10;
      doc.setFillColor(...colors.green);
      doc.rect(15, currentY - 4, 70, 10, "F");
      doc.setTextColor(...colors.white);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`CÓDIGO: ${inscripcion.codigo}`, 50, currentY + 2, {
        align: "center",
      });

      // === QR CODE CON MARCO NARANJA ===
      currentY += 12;
      const qrSize = 30;
      const qrX = (100 - qrSize) / 2;
      doc.setDrawColor(...colors.orange);
      doc.setLineWidth(2);
      doc.rect(qrX - 3, currentY - 3, qrSize + 6, qrSize + 6, "S");
      doc.setFillColor(...colors.white);
      doc.rect(qrX - 1, currentY - 1, qrSize + 2, qrSize + 2, "F");
      doc.addImage(qrCodeDataURL, "PNG", qrX, currentY, qrSize, qrSize);

      // === FECHA Y HORA DE EMISIÓN DEBAJO DEL QR ===
      currentY += qrSize + 9;
      doc.setTextColor(...colors.darkGreen);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text("FECHA Y HORA DE EMISIÓN:", 32, currentY, { align: "center" });
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
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
      doc.text(`${fechaCompleta}, ${horaCompleta}`, 66.5, currentY, {
        align: "center",
      });

      const fileName = `Credencial_Acceso_${
        inscripcion.codigo
      }_${inscripcion.nombre.replace(/\s+/g, "_")}.pdf`;
      doc.save(fileName);
      console.log("✅ Descarga exitosa");
    } catch (error) {
      console.error("❌ Error completo al generar PDF:", error);
      alert(
        `Error al generar el PDF: ${
          error instanceof Error ? error.message : String(error)
        }. Por favor, intente nuevamente.`
      );
    } finally {
      setIsDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getEstadoInscripcionColor = (estado: string) => {
    switch (estado) {
      case "registrado":
        return "hover:bg-yellow-400 bg-yellow-100 text-yellow-800 border-yellow-300";
      case "pago_confirmado":
        return "hover:bg-blue-400 bg-blue-100 text-blue-800 border-blue-300 ";
      case "email_enviado":
        return "hover:bg-green-400 bg-green-100 text-green-800 border-green-300";
      case "completado":
        return "hover:bg-emerald-400 bg-emerald-100 text-emerald-800 border-emerald-300";
      default:
        return "hover:bg-gray-400 bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getEstadoInscripcionLabel = (estado: string) => {
    switch (estado) {
      case "registrado":
        return "Registrado";
      case "pago_confirmado":
        return "Pago Confirmado";
      case "email_enviado":
        return "Email Enviado";
      case "completado":
        return "Completado";
      default:
        return estado;
    }
  };

  const getEstadoInscripcionIcon = (estado: string) => {
    switch (estado) {
      case "registrado":
        return <User className="mr-1 h-3 w-3" />;
      case "pago_confirmado":
        return <CheckCircle className="mr-1 h-3 w-3" />;
      case "email_enviado":
        return <BadgeCheckIcon className="mr-1 h-3 w-3" />;
      case "completado":
        return <ClockIcon className="mr-1 h-3 w-3" />;
      default:
        return null;
    }
  };

  const filteredInscripciones = inscripcionesData.filter((inscripcion) => {
    const matchesSearch =
      searchQuery === "" ||
      inscripcion.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inscripcion.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inscripcion.codigo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(inscripcion.estado_pago);
    const matchesPase =
      paseFilter === "all" || inscripcion.tipo_participante === paseFilter;
    return matchesSearch && matchesStatus && matchesPase;
  });

  const totalInscripciones = inscripcionesData.length;
  const inscripcionesCompletas = inscripcionesData.filter(
    (i) => i.estado_pago === "CONFIRMADO"
  ).length;

  const formatTipoParticipante = (tipo: string) => {
    const labels: { [key: string]: string } = {
      EMPRESAS: "Empresas",
      INSTITUCIONES: "Instituciones",
      PROFESIONALES_ESTUDIANTES: "Profesionales - Estudiantes",
      PUBLICO_EN_GENERAL: "Público en General",
    };
    return labels[tipo] || tipo;
  };

  type EstadoInscripcion =
    | "registrado"
    | "pago_confirmado"
    | "email_enviado"
    | "completado";
  type EstadoPago = "CONFIRMADO" | "PENDIENTE" | "RECHAZADO";
  type CorreoEnviado = "SI" | "NO";

  const getEstadoInscripcion = (
    estado_pago: EstadoPago,
    correo_enviado: CorreoEnviado
  ): EstadoInscripcion => {
    if (estado_pago === "CONFIRMADO" && correo_enviado === "NO") {
      return "pago_confirmado";
    } else if (estado_pago === "CONFIRMADO" && correo_enviado === "SI") {
      return "email_enviado";
    } else if (
      (estado_pago === "RECHAZADO" || estado_pago === "PENDIENTE") &&
      correo_enviado === "NO"
    ) {
      return "registrado";
    }
    return "registrado";
  };

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Gestión de Inscripciones
        </h1>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Mails className="mr-2 h-4 w-4" />
            Email Masivo
          </Button>
        </div> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading
              ? "Cargando inscripciones..."
              : "Listado de Inscripciones"}
          </CardTitle>
          <CardDescription>
            Gestiona todas las inscripciones al evento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por nombre, email o empresa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="mr-2 h-4 w-4" />
                      Estado
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("CONFIRMADO")}
                      onCheckedChange={(checked) => {
                        if (checked)
                          setStatusFilter([...statusFilter, "CONFIRMADO"]);
                        else
                          setStatusFilter(
                            statusFilter.filter((s) => s !== "CONFIRMADO")
                          );
                      }}
                    >
                      Confirmado
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("PENDIENTE")}
                      onCheckedChange={(checked) => {
                        if (checked)
                          setStatusFilter([...statusFilter, "PENDIENTE"]);
                        else
                          setStatusFilter(
                            statusFilter.filter((s) => s !== "PENDIENTE")
                          );
                      }}
                    >
                      Pendiente
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter.includes("RECHAZADO")}
                      onCheckedChange={(checked) => {
                        if (checked)
                          setStatusFilter([...statusFilter, "RECHAZADO"]);
                        else
                          setStatusFilter(
                            statusFilter.filter((s) => s !== "RECHAZADO")
                          );
                      }}
                    >
                      Rechazado
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Select value={paseFilter} onValueChange={setPaseFilter}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <SelectValue placeholder="Tipo de pase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="EMPRESAS">Empresas</SelectItem>
                    <SelectItem value="INSTITUCIONES">Instituciones</SelectItem>
                    <SelectItem value="PROFESIONALES_ESTUDIANTES">
                      Profesionales - Estudiantes
                    </SelectItem>
                    <SelectItem value="PUBLICO_EN_GENERAL">
                      Público en General
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre / Empresa</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Tipo de Pase</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Estado de Inscripción</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInscripciones.map((inscripcion) => (
                      <TableRow key={inscripcion.codigo}>
                        <TableCell>{inscripcion.codigo}</TableCell>
                        <TableCell>
                          {capitalizeWords(inscripcion.nombre)}
                        </TableCell>
                        <TableCell>{inscripcion.email}</TableCell>
                        <TableCell>
                          {formatTipoParticipante(
                            inscripcion.tipo_participante
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              inscripcion.estado_pago === "CONFIRMADO"
                                ? "bg-blue-500 text-white hover:bg-blue-400 transition-colors"
                                : inscripcion.estado_pago === "PENDIENTE"
                                ? "bg-amber-500 text-white hover:bg-amber-400 transition-colors"
                                : "bg-red-500 text-white hover:bg-red-400 transition-colors"
                            }
                          >
                            {inscripcion.estado_pago === "CONFIRMADO" ? (
                              <>
                                <Check className="mr-1 h-3 w-3" /> Confirmado
                              </>
                            ) : inscripcion.estado_pago === "PENDIENTE" ? (
                              <>
                                <Clock className="mr-1 h-3 w-3" /> Pendiente
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="mr-1 h-3 w-3" />{" "}
                                Rechazado
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap min-w-fit">
                          <Badge
                            className={`${getEstadoInscripcionColor(
                              getEstadoInscripcion(
                                inscripcion.estado_pago,
                                inscripcion.correo_enviado
                              )
                            )} inline-flex items-center gap-1`}
                          >
                            {getEstadoInscripcionIcon(
                              getEstadoInscripcion(
                                inscripcion.estado_pago,
                                inscripcion.correo_enviado
                              )
                            )}
                            {getEstadoInscripcionLabel(
                              getEstadoInscripcion(
                                inscripcion.estado_pago,
                                inscripcion.correo_enviado
                              )
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(inscripcion.fecha_registro)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {inscripcion.estado_pago === "CONFIRMADO" && (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSendEmail(inscripcion)}
                                disabled={isSendingEmail === inscripcion.codigo}
                                className="w-full"
                              >
                                {isSendingEmail === inscripcion.codigo ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {getEstadoInscripcion(
                                      inscripcion.estado_pago,
                                      inscripcion.correo_enviado
                                    ) === "email_enviado"
                                      ? "Reenviando..."
                                      : "Enviando..."}
                                  </>
                                ) : (
                                  <>
                                    {getEstadoInscripcion(
                                      inscripcion.estado_pago,
                                      inscripcion.correo_enviado
                                    ) === "email_enviado" ? (
                                      <>
                                        <RefreshCcw className="mr-2 h-4 w-4" />
                                        Reenviar Email
                                      </>
                                    ) : (
                                      <>
                                        <MailCheck className="mr-2 h-4 w-4" />
                                        Enviar Email
                                      </>
                                    )}
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {getEstadoInscripcion(
                            inscripcion.estado_pago,
                            inscripcion.correo_enviado
                          ) === "email_enviado" && (
                            <div className="grid grid-cols-2 gap-1 mt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  generateAndDownloadPDF(inscripcion)
                                }
                                title="Descargar PDF Completo"
                                className="px-1 py-0.5 text-xs"
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                PDF Completo
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadPDF(inscripcion)}
                                title="Descargar PDF Tarjeta"
                                className="px-1 py-0.5 text-xs"
                              >
                                <Download className="mr-1 h-3 w-3" />
                                PDF Tarjeta
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
