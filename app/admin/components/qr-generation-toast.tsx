"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Download } from "lucide-react"

interface QRGenerationToastProps {
  show: boolean
  status: "generating" | "success" | "error"
  message: string
  onClose: () => void
}

export function QRGenerationToast({ show, status, message, onClose }: QRGenerationToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      if (status === "success" || status === "error") {
        const timer = setTimeout(() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }, 4000)
        return () => clearTimeout(timer)
      }
    } else {
      setIsVisible(false)
    }
  }, [show, status, onClose])

  if (!show) return null

  const getIcon = () => {
    switch (status) {
      case "generating":
        return <Download className="h-5 w-5 animate-pulse" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getBgColor = () => {
    switch (status) {
      case "generating":
        return "bg-blue-50 border-blue-200"
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
    }
  }

  const getTextColor = () => {
    switch (status) {
      case "generating":
        return "text-blue-800"
      case "success":
        return "text-green-800"
      case "error":
        return "text-red-800"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={`rounded-lg border p-4 shadow-lg ${getBgColor()}`}>
        <div className="flex items-center gap-3">
          {getIcon()}
          <div>
            <p className={`font-medium ${getTextColor()}`}>
              {status === "generating" && "Generando credencial..."}
              {status === "success" && "¡Credencial generada!"}
              {status === "error" && "Error al generar"}
            </p>
            <p className={`text-sm ${getTextColor()} opacity-80`}>{message}</p>
          </div>
          {(status === "success" || status === "error") && (
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
              className={`ml-2 ${getTextColor()} hover:opacity-70`}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
