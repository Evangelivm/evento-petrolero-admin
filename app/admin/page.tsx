"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Users, CreditCard, DollarSign, TrendingUp, Download, Calendar, MapPin, Clock } from "lucide-react"
import { Overview } from "./components/overview"
import { RecentPayments } from "./components/recent-payments"
import { InscriptionsByCountry } from "./components/inscriptions-by-country"
import { PaymentMethodsChart } from "./components/payment-methods-chart"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir automáticamente a la página de inscripciones
    router.replace("/admin/inscripciones")
  }, [router])

  // Datos simulados basados en las inscripciones
  const dashboardData = {
    totalIngresos: 45231.89,
    totalInscripciones: 2350,
    pagosPendientes: 573,
    tasaConversion: 12.5,
    inscripcionesPorPase: {
      completo: 850,
      ejecutivo: 920,
      virtual: 580,
    },
    inscripcionesPorPais: {
      mexico: 650,
      colombia: 480,
      peru: 320,
      chile: 280,
      venezuela: 250,
      otros: 370,
    },
    metodosPago: {
      transferencia: 45,
      yape: 25,
      plin: 15,
      tarjeta: 15,
    },
    eventInfo: {
      fecha: "15-17 Julio 2025",
      ubicacion: "Lima, Perú",
      diasRestantes: 68,
    },
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
          <p className="text-gray-600">PetroSummit 2025 - Panel de Control</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Reporte Completo
          </Button>
        </div>
      </div>

      {/* Información del Evento */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-amber-800">PetroSummit 2025</h2>
              <div className="flex items-center gap-4 text-sm text-amber-700">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {dashboardData.eventInfo.fecha}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {dashboardData.eventInfo.ubicacion}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {dashboardData.eventInfo.diasRestantes} días restantes
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-800">{dashboardData.totalInscripciones}</div>
              <div className="text-sm text-amber-600">Inscripciones totales</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="inscriptions">Análisis de Inscripciones</TabsTrigger>
          <TabsTrigger value="payments">Análisis de Pagos</TabsTrigger>
          <TabsTrigger value="reports">Reportes Detallados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${dashboardData.totalIngresos.toLocaleString()}</div>
                <p className="text-xs text-gray-500">+20.1% respecto al mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inscripciones</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{dashboardData.totalInscripciones.toLocaleString()}</div>
                <p className="text-xs text-gray-500">+180 en las últimas 24 horas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                <CreditCard className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{dashboardData.pagosPendientes}</div>
                <p className="text-xs text-gray-500">Requieren verificación</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{dashboardData.tasaConversion}%</div>
                <p className="text-xs text-gray-500">+2.1% respecto al mes anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen de Ingresos Mensuales</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Pagos Recientes</CardTitle>
                <CardDescription>Últimas transacciones procesadas</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPayments />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inscriptions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Inscripciones por Tipo de Pase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pase Completo</span>
                    <span className="font-bold">{dashboardData.inscripcionesPorPase.completo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pase Ejecutivo</span>
                    <span className="font-bold">{dashboardData.inscripcionesPorPase.ejecutivo}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pase Virtual</span>
                    <span className="font-bold">{dashboardData.inscripcionesPorPase.virtual}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Distribución por País</CardTitle>
              </CardHeader>
              <CardContent>
                <InscriptionsByCountry data={dashboardData.inscripcionesPorPais} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodsChart data={dashboardData.metodosPago} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Estado de Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Pagos Completados</span>
                    <span className="font-bold text-green-600">1,777</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">Pagos Pendientes</span>
                    <span className="font-bold text-yellow-600">{dashboardData.pagosPendientes}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">Pagos Rechazados</span>
                    <span className="font-bold text-red-600">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Reportes Disponibles</CardTitle>
                <CardDescription>Descarga reportes detallados del evento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Reporte de Inscripciones Completo",
                      description: "Lista detallada de todos los participantes",
                      date: "Actualizado: Hoy",
                      format: "Excel/PDF",
                    },
                    {
                      title: "Análisis Financiero",
                      description: "Resumen de ingresos y transacciones",
                      date: "Actualizado: Hoy",
                      format: "Excel/PDF",
                    },
                    {
                      title: "Distribución Demográfica",
                      description: "Análisis por país, empresa y sector",
                      date: "Actualizado: Ayer",
                      format: "Excel/PDF",
                    },
                    {
                      title: "Reporte de Marketing",
                      description: "Efectividad de canales de promoción",
                      date: "Actualizado: Hace 2 días",
                      format: "PDF",
                    },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-gray-500">{report.description}</p>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>{report.date}</span>
                          <span>Formato: {report.format}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Métricas Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">68%</div>
                    <div className="text-sm text-blue-800">Tasa de ocupación del evento</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$1,925</div>
                    <div className="text-sm text-purple-800">Valor promedio por inscripción</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-green-800">Tasa de conversión de pagos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
