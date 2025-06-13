// "use client";

// import { useEffect, useState } from "react";
// import { toast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import Link from "next/link";

// export function NotificationToast() {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);

//     // Simular la recepción de nuevos pagos pendientes
//     const interval = setInterval(() => {
//       const random = Math.random();
//       if (random > 0.7) {
//         showPaymentNotification();
//       }
//     }, 45000); // Cada 45 segundos hay una posibilidad de recibir una notificación

//     return () => clearInterval(interval);
//   }, []);

//   const showPaymentNotification = () => {
//     const names = [
//       "Roberto",
//       "Ana",
//       "Luis",
//       "Sofía",
//       "Miguel",
//       "Patricia",
//       "Jorge",
//       "Elena",
//     ];
//     const methods = ["transferencia", "Yape", "Plin"];
//     const randomName = names[Math.floor(Math.random() * names.length)];
//     const randomMethod = methods[Math.floor(Math.random() * methods.length)];
//     const paymentId = `PAY-${Math.floor(Math.random() * 1000)
//       .toString()
//       .padStart(3, "0")}`;

//     toast({
//       title: "Nuevo pago pendiente",
//       description: (
//         <div className="mt-2 flex flex-col space-y-2">
//           <p>
//             {randomName} ha realizado un pago por {randomMethod} que requiere
//             verificación.
//           </p>
//           <div className="flex items-center justify-between">
//             <p className="text-xs text-gray-500">ID: {paymentId}</p>
//             <Button size="sm" variant="outline" asChild>
//               <Link href={`/admin/pagos?id=${paymentId}`}>Ver detalles</Link>
//             </Button>
//           </div>
//         </div>
//       ),
//       action: (
//         <Button variant="outline" size="icon" className="h-8 w-8">
//           <X className="h-4 w-4" />
//         </Button>
//       ),
//       className: "border-l-4 border-amber-500",
//       duration: 5000,
//     });
//   };

//   if (!mounted) return null;

//   return null;
// }
