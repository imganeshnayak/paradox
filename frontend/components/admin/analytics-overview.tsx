"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, Eye, Clock, ThumbsUp } from "lucide-react"

interface DashboardData {
  totalVisitors: number
  totalEvents: number
  avgEventsPerVisitor: string
}

export function AnalyticsOverview() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
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
          setData(dashboardData)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const metrics = [
    {
      icon: Users,
      label: "Total Visitors",
      value: data ? data.totalVisitors.toLocaleString() : "0",
      change: "+0%",
      positive: true,
    },
    {
      icon: Eye,
      label: "Total Events",
      value: data ? data.totalEvents.toLocaleString() : "0",
      change: "+0%",
      positive: true,
    },
    {
      icon: Clock,
      label: "Avg Events/Visitor",
      value: data ? parseFloat(data.avgEventsPerVisitor).toFixed(2) : "0",
      change: "+0%",
      positive: true,
    },
    {
      icon: ThumbsUp,
      label: "Active Sessions",
      value: loading ? "..." : "N/A",
      change: "+0%",
      positive: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        return (
          <Card key={index} className="bg-card border border-border hover:border-primary/50 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon size={24} className="text-primary" />
                </div>
                <span className={`text-sm font-semibold ${metric.positive ? "text-green-600" : "text-red-600"}`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-foreground/60 text-sm mb-1">{metric.label}</p>
              <p className="text-2xl font-serif font-bold text-foreground">{metric.value}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
