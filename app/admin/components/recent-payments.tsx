import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function RecentPayments() {
  const payments = [
    {
      id: "INV001",
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      amount: "$1,200.00",
      status: "completado",
      date: "Hace 2 horas",
      method: "Transferencia",
    },
    {
      id: "INV002",
      name: "María González",
      email: "maria@example.com",
      amount: "$800.00",
      status: "pendiente",
      date: "Hace 3 horas",
      method: "Yape",
    },
    {
      id: "INV003",
      name: "Juan Pérez",
      email: "juan@example.com",
      amount: "$350.00",
      status: "completado",
      date: "Hace 5 horas",
      method: "Tarjeta",
    },
    {
      id: "INV004",
      name: "Ana Sánchez",
      email: "ana@example.com",
      amount: "$1,200.00",
      status: "rechazado",
      date: "Hace 6 horas",
      method: "Plin",
    },
    {
      id: "INV005",
      name: "Luis Torres",
      email: "luis@example.com",
      amount: "$800.00",
      status: "completado",
      date: "Hace 8 horas",
      method: "Transferencia",
    },
  ];

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`/abstract-geometric-shapes.png?height=36&width=36&query=${payment.name}`}
                alt={payment.name}
              />
              <AvatarFallback>
                {payment.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{payment.name}</p>
              <p className="text-xs text-gray-500">{payment.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xs text-gray-500">{payment.method}</p>
                <span className="text-xs text-gray-500">•</span>
                <p className="text-xs text-gray-500">{payment.date}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-sm font-medium">{payment.amount}</p>
            <Badge
              variant={
                payment.status === "completado"
                  ? "default"
                  : payment.status === "pendiente"
                  ? "outline"
                  : "destructive"
              }
              className="text-xs"
            >
              {payment.status === "completado"
                ? "Completado"
                : payment.status === "pendiente"
                ? "Pendiente"
                : "Rechazado"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
