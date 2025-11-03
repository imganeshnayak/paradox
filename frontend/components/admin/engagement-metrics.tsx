"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface EventDistribution {
  _id: string
  count: number
}

export function EngagementMetrics() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const token = localStorage.getItem('admin-token')
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
        
        const response = await fetch(`${backendUrl}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const dashboardData = await response.json()
          if (dashboardData.eventDistribution) {
            const chartData = dashboardData.eventDistribution.map((item: EventDistribution) => ({
              name: item._id || 'Unknown',
              count: item.count,
              events: item.count,
            }))
            setData(chartData)
          }
        }
      } catch (error) {
        console.error('Failed to fetch engagement data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEngagementData()
  }, [])

  return (
    <Card className="bg-card border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Engagement Metrics</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-foreground/60">
          Loading engagement data...
        </div>
      ) : data.length > 0 ? (
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
            <Bar dataKey="count" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-foreground/60">
          No engagement data available
        </div>
      )}
    </Card>
  )
}
