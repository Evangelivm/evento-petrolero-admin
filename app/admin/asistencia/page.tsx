"use client";

import { useEffect, useState } from "react";
import { getParticipants } from "@/data/connections";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, RefreshCcw, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThermalPassPreviewDialog } from "@/app/admin/components/thermal-pass-preview-dialog";

interface Participant {
  id: number;
  codigo: string;
  nombre: string;
  tipo_participante: string;
  estado_pago: string;
  asistio: string;
  dias: string; // Add dias as an optional property
}

export default function AsistenciaPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isThermalPassPreviewOpen, setIsThermalPassPreviewOpen] =
    useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<
    (Participant & { dias: string }) | null
  >(null);

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const data = await getParticipants();
      setParticipants(data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTipoParticipante = (tipo: string) => {
    const labels: { [key: string]: string } = {
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

  useEffect(() => {
    fetchParticipants();
  }, []);

  const filteredParticipants = participants
    .filter(
      (p) =>
        p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tipo_participante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.estado_pago.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.asistio === "SI" && b.asistio !== "SI") {
        return -1;
      }
      if (a.asistio !== "SI" && b.asistio === "SI") {
        return 1;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Control de Asistencia
        </h1>
        <Button variant="outline" size="sm" onClick={fetchParticipants}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Asistencia</CardTitle>
          <CardDescription>
            Gestiona la asistencia de los participantes al evento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por código, nombre, tipo de pase o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asistencia</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo de Pase</TableHead>
                  <TableHead>Estado de Pago</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            participant.asistio === "SI"
                              ? "bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
                              : "bg-gray-400 text-white hover:bg-gray-300 transition-colors"
                          }
                        >
                          {participant.asistio}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {participant.codigo}
                      </TableCell>
                      <TableCell>
                        {capitalizeWords(participant.nombre)}
                      </TableCell>
                      <TableCell>
                        {formatTipoParticipante(participant.tipo_participante)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            participant.estado_pago === "CONFIRMADO"
                              ? "bg-blue-500 text-white hover:bg-blue-400 transition-colors"
                              : participant.estado_pago === "PENDIENTE"
                              ? "bg-amber-500 text-white hover:bg-amber-400 transition-colors"
                              : "bg-red-500 text-white hover:bg-red-400 transition-colors"
                          }
                        >
                          {capitalizeWords(participant.estado_pago)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const participantForPrint = {
                              ...participant,
                              dias: participant.dias || "", // Ensure 'dias' is always a string
                            } as Participant & { dias: string };
                            handlePrintPassClick(
                              participantForPrint,
                              setSelectedParticipant,
                              setIsThermalPassPreviewOpen
                            );
                          }}
                          disabled={participant.asistio === "NO"}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Imprimir Pase
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No se encontraron participantes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ThermalPassPreviewDialog
        open={isThermalPassPreviewOpen}
        onOpenChange={setIsThermalPassPreviewOpen}
        participant={selectedParticipant}
      />
    </div>
  );
}

const handlePrintPassClick = (
  participant: Participant & { dias: string },
  setSelectedParticipant: React.Dispatch<
    React.SetStateAction<(Participant & { dias: string }) | null>
  >,
  setIsThermalPassPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setSelectedParticipant(participant);
  setIsThermalPassPreviewOpen(true);
};
