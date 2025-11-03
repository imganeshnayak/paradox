"use client"

import { useState } from "react"
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
  const router = useRouter()

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
