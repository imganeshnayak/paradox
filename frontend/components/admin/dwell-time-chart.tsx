"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DwellTimeChartProps {
  timeRange: string
}

interface ArtworkDwellData {
  artworkId: string
  avgDwellTime: number
  views: number
}

export function DwellTimeChart({ timeRange }: DwellTimeChartProps) {
  const [data, setData] = useState<ArtworkDwellData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDwellTimeData = async () => {
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
          if (dashboardData.topArtworks) {
            // Use top artworks data for dwell time
            setData(dashboardData.topArtworks.slice(0, 6))
          }
        }
      } catch (error) {
        console.error('Failed to fetch dwell time data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDwellTimeData()
  }, [timeRange])

  const chartData = data.map((item, index) => ({
    name: `Artwork ${index + 1}`,
    time: (item.avgDwellTime / 60).toFixed(1), // Convert seconds to minutes
  }))

  return (
    <Card className="bg-card border border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Average Dwell Time by Artwork</h3>
      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-foreground/60">
          Loading dwell time data...
        </div>
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
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
      ) : (
        <div className="h-[300px] flex items-center justify-center text-foreground/60">
          No dwell time data available
        </div>
      )}
    </Card>
  )
}
