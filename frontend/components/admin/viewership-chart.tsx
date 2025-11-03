"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ViewershipChartProps {
  timeRange: string
}

interface TimelineData {
  date: string
  events: number
  visitors: number
}

export function ViewershipChart({ timeRange }: ViewershipChartProps) {
  const [data, setData] = useState<TimelineData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const token = localStorage.getItem('admin-token')
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        
        const now = new Date()
        let startDate: Date
        
        if (timeRange === "week") {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        } else {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }

        const response = await fetch(
          `${backendUrl}/api/admin/dashboard?startDate=${startDate.toISOString()}&endDate=${now.toISOString()}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const dashboardData = await response.json()
          if (dashboardData.timelineData) {
            setData(dashboardData.timelineData)
          }
        }
      } catch (error) {
        console.error('Failed to fetch timeline data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTimelineData()
  }, [timeRange])

  const chartData = data.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    viewers: item.visitors,
  }))

  return (
    <Card className="bg-card border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Viewership Trends</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-foreground/60">
          Loading chart data...
        </div>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
      ) : (
        <div className="h-[300px] flex items-center justify-center text-foreground/60">
          No data available
        </div>
      )}
    </Card>
  )
}
