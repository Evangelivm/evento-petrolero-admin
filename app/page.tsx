"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Credenciales hardcodeadas para demo
    if (username === "admin" && password === "admin123") {
      // Guardar estado de autenticación
      localStorage.setItem("admin_authenticated", "true");
      // Redireccionar al dashboard
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } else {
      setError("Usuario o contraseña incorrectos");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-petroleum.png')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <Card className="w-[380px] bg-white/90 backdrop-blur-md z-10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img
              src="/petro-summit-logo.png"
              alt="PetroSummit 2025"
              className="h-16"
            />
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            Acceso Administrativo
          </CardTitle>
          <CardDescription className="text-center">
            PetroSummit 2025 - Panel de Control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Accediendo...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>

          {/* <div className="text-xs text-center text-gray-500 mt-2">
            <p>Credenciales de demostración:</p>
            <p>
              Usuario: <span className="font-mono">admin</span> | Contraseña:{" "}
              <span className="font-mono">admin123</span>
            </p>
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="https://reactivapetroltalara.online/"
            className="text-sm text-amber-600 hover:text-amber-800"
          >
            Ver sitio web del evento →
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
