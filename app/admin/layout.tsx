"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./components/admin-sidebar";
import AdminHeader from "./components/admin-header";
// import { NotificationToast } from "./components/notification-toast"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Si estamos en la página de login, no verificar autenticación
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    // Verificar autenticación desde localStorage
    const authStatus = localStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);

      // Si estamos en la ruta raíz /admin, redirigir a inscripciones
      if (pathname === "/admin") {
        router.replace("/admin/inscripciones");
      }
    } else {
      router.push("/");
      return;
    }
    setIsLoading(false);
  }, [router, pathname]);

  // Mostrar loading mientras verificamos autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya se redirigió)
  if (!isAuthenticated) {
    return null;
  }

  // Renderizar el layout completo del admin
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
      {/* <NotificationToast /> */}
    </div>
  );
}
