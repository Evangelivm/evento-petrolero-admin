"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface InscriptionsByCountryProps {
  data: {
    mexico: number
    colombia: number
    peru: number
    chile: number
    venezuela: number
    otros: number
  }
}

export function InscriptionsByCountry({ data }: InscriptionsByCountryProps) {
  const chartData = [
    { name: "México", value: data.mexico },
    { name: "Colombia", value: data.colombia },
    { name: "Perú", value: data.peru },
    { name: "Chile", value: data.chile },
    { name: "Venezuela", value: data.venezuela },
    { name: "Otros", value: data.otros },
  ]

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip formatter={(value: number) => [value, "Inscripciones"]} labelFormatter={(label) => `País: ${label}`} />
        <Bar dataKey="value" fill="#e5a00d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
