import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Audio Guide", plays: 1240, completions: 1050 },
  { name: "Recommendations", clicks: 890, conversions: 670 },
  { name: "Share Feature", uses: 420, shares: 340 },
  { name: "Feedback", submissions: 580, ratings: 520 },
]

export function EngagementMetrics() {
  return (
    <Card className="bg-card border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Engagement Metrics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
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
          <Legend />
          <Bar dataKey="plays" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="completions" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
