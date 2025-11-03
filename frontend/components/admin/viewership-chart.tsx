"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ViewershipChartProps {
  timeRange: string
}

const weekData = [
  { name: "Mon", viewers: 340 },
  { name: "Tue", viewers: 420 },
  { name: "Wed", viewers: 380 },
  { name: "Thu", viewers: 450 },
  { name: "Fri", viewers: 520 },
  { name: "Sat", viewers: 680 },
  { name: "Sun", viewers: 590 },
]

const monthData = [
  { name: "Week 1", viewers: 2840 },
  { name: "Week 2", viewers: 2890 },
  { name: "Week 3", viewers: 3120 },
  { name: "Week 4", viewers: 3280 },
]

export function ViewershipChart({ timeRange }: ViewershipChartProps) {
  const data = timeRange === "week" ? weekData : monthData

  return (
    <Card className="bg-card border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Viewership Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="name" stroke="var(--color-foreground)" opacity={0.6} />
          <YAxis stroke="var(--color-foreground)" opacity={0.6} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "var(--color-foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="viewers"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: "var(--color-primary)", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
