"use client"

import type React from "react"

import MainNavigation from "./main-navigation"

interface PageHeaderProps {
  children?: React.ReactNode
}

export default function PageHeader({ children }: PageHeaderProps) {
  return (
    <>
      <MainNavigation />
      {children && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </div>
      )}
    </>
  )
}
