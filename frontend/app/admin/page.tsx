"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminHeader } from "@/components/admin/admin-header"
import { AnalyticsOverview } from "@/components/admin/analytics-overview"
import { ViewershipChart } from "@/components/admin/viewership-chart"
import { DwellTimeChart } from "@/components/admin/dwell-time-chart"
import { TopArtworks } from "@/components/admin/top-artworks"
import { EngagementMetrics } from "@/components/admin/engagement-metrics"
import { VisitorFeedback } from "@/components/admin/visitor-feedback"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("week")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if admin token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin-token')
      if (token) {
        setIsAuthenticated(true)
      } else {
        // Redirect to login if no token
        router.push('/admin/login')
      }
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <AdminHeader 
          timeRange={timeRange} 
          onTimeRangeChange={setTimeRange}
          onUploadClick={() => router.push("/admin/upload")}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         
          <AnalyticsOverview />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <ViewershipChart timeRange={timeRange} />
            <DwellTimeChart timeRange={timeRange} />
          </div>

          <div className="mt-8">
            <EngagementMetrics />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <TopArtworks />
            <VisitorFeedback />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
