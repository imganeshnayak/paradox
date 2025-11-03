"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DwellTimeChartProps {
  timeRange: string
}

const data = [
  { name: "Starry Night", time: 8.5 },
  { name: "The Kiss", time: 9.1 },
  { name: "Girl w/ Pearl", time: 7.8 },
  { name: "Persistence", time: 7.2 },
  { name: "The Scream", time: 6.9 },
  { name: "Son of Man", time: 6.1 },
]

export function DwellTimeChart({ timeRange }: DwellTimeChartProps) {
  return (
    <Card className="bg-card border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Average Dwell Time by Artwork</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="name"
            stroke="var(--color-foreground)"
            opacity={0.6}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="var(--color-foreground)"
            opacity={0.6}
            label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--color-foreground)" }}
            formatter={(value) => `${value} min`}
          />
          <Bar dataKey="time" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
