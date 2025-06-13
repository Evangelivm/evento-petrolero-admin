"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface PaymentMethodsChartProps {
  data: {
    transferencia: number
    yape: number
    plin: number
    tarjeta: number
  }
}

const COLORS = ["#e5a00d", "#f59e0b", "#d97706", "#b45309"]

export function PaymentMethodsChart({ data }: PaymentMethodsChartProps) {
  const chartData = [
    { name: "Transferencia", value: data.transferencia },
    { name: "Yape", value: data.yape },
    { name: "Plin", value: data.plin },
    { name: "Tarjeta", value: data.tarjeta },
  ]

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value}%`, "Porcentaje"]} />
      </PieChart>
    </ResponsiveContainer>
  )
}
