"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Filter,
  Search,
  Eye,
  BadgeCheckIcon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";
import { PaymentDetailDialog } from "./payment-detail-dialog";
import { getParticipants } from "@/data/connections";
import { Loader2 } from "lucide-react";

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
  dias?: string;
}

const GRATIS_TYPES = [
  "AUSPICIADOR",
  "AUTORIDAD",
  "MEDIA_PARTNER",
  "ALUMNO_UNIVERSITARIO",
];

export default function PagosPage() {
  const router = useRouter();
  const [pagosData, setPagosData] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [methodFilter, setMethodFilter] = useState<string>("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchPagos = async () => {
    try {
      setIsLoading(true);
      const data = await getParticipants();
      setPagosData(data);
    } catch (error) {
      console.error("Error fetching pagos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  const handleDialogClose = (open: boolean) => {
    setIsDetailOpen(open);
    if (!open) fetchPagos();
  };

  const filteredPayments = pagosData.filter((pago) => {
    const matchesSearch =
      searchQuery === "" ||
      pago.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pago.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pago.codigo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 ||
      statusFilter.includes(pago.estado_pago.toLowerCase());

    const matchesMethod =
      methodFilter === "" ||
      methodFilter.toLowerCase() === "todos" ||
      (GRATIS_TYPES.includes(pago.tipo_participante)
        ? "gratis"
        : pago.metodo_pago.toLowerCase()) === methodFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPagos = pagosData.length;
  const pagosPendientes = pagosData.filter(
    (p) => p.estado_pago === "PENDIENTE"
  ).length;
  const pagosCompletados = pagosData.filter(
    (p) => p.estado_pago === "CONFIRMADO"
  ).length;
  const montoTotal = pagosData
    .filter((p) => p.estado_pago === "CONFIRMADO")
    .reduce((sum, p) => sum + Number(p.monto || 0), 0);

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));

  const openPaymentDetail = (payment: Payment) => {
    setSelectedPayment({ ...payment, id: payment.id });
    setIsDetailOpen(true);
  };

  const getMetodoLabel = (tipo: string, metodo: string) =>
    GRATIS_TYPES.includes(tipo) ? "Gratis" : capitalizeWords(metodo);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Pagos</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPagos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagos Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagosPendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagos Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagosCompletados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              S/. {montoTotal.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? "Cargando pagos..." : "Todos los Pagos"}
          </CardTitle>
          <CardDescription>
            Gestiona todos los pagos de inscripciones al evento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar por nombre, email o ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9">
                        <Filter className="mr-2 h-4 w-4" />
                        Estado
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {["completado", "pendiente", "rechazado"].map((s) => (
                        <DropdownMenuCheckboxItem
                          key={s}
                          checked={statusFilter.includes(s)}
                          onCheckedChange={(checked) =>
                            setStatusFilter(
                              checked
                                ? [...statusFilter, s]
                                : statusFilter.filter((v) => v !== s)
                            )
                          }
                        >
                          {capitalizeWords(s)}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="h-9 w-[180px]">
                      <SelectValue placeholder="Método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos</SelectItem>
                      <SelectItem value="Yape">Yape</SelectItem>
                      <SelectItem value="Plin">Plin</SelectItem>
                      <SelectItem value="Transferencia">
                        Transferencia
                      </SelectItem>
                      <SelectItem value="Efectivo">Efectivo</SelectItem>
                      <SelectItem value="Gratis">Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Nombre / Empresa</TableHead>
                      <TableHead>Tipo de Participante</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Días</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((pago) => (
                      <TableRow key={pago.codigo}>
                        <TableCell className="font-medium">
                          {pago.codigo}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{capitalizeWords(pago.nombre)}</p>
                            <p className="text-xs text-gray-500">
                              {pago.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatTipoParticipante(pago.tipo_participante)}
                        </TableCell>
                        <TableCell>S/. {pago.monto}</TableCell>
                        <TableCell>
                          {getMetodoLabel(
                            pago.tipo_participante,
                            pago.metodo_pago
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              pago.estado_pago === "CONFIRMADO"
                                ? "bg-blue-500 text-white hover:bg-blue-400"
                                : pago.estado_pago === "PENDIENTE"
                                ? "bg-amber-500 text-white hover:bg-amber-400"
                                : "bg-red-500 text-white hover:bg-red-400"
                            }
                          >
                            {pago.estado_pago === "CONFIRMADO" ? (
                              <>
                                <BadgeCheckIcon className="mr-1 h-3 w-3" />
                                Confirmado
                              </>
                            ) : pago.estado_pago === "PENDIENTE" ? (
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
                        </TableCell>
                        <TableCell>{formatDate(pago.fecha_registro)}</TableCell>
                        <TableCell>{pago.dias}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openPaymentDetail(pago)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalles</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPayments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No se encontraron pagos con los filtros seleccionados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPayment && (
        <PaymentDetailDialog
          payment={selectedPayment}
          open={isDetailOpen}
          onOpenChange={handleDialogClose}
          router={router}
        />
      )}
    </div>
  );
}

const formatTipoParticipante = (tipo: string) => {
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

const capitalizeWords = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
