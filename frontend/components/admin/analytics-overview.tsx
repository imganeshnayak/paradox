import { Card } from "@/components/ui/card"
import { Users, Eye, Clock, ThumbsUp } from "lucide-react"

const metrics = [
  {
    icon: Users,
    label: "Total Visitors",
    value: "2,847",
    change: "+12.5%",
    positive: true,
  },
  {
    icon: Eye,
    label: "Artworks Viewed",
    value: "15,294",
    change: "+8.2%",
    positive: true,
  },
  {
    icon: Clock,
    label: "Avg Dwell Time",
    value: "6:42",
    change: "+2.1 min",
    positive: true,
  },
  {
    icon: ThumbsUp,
    label: "Avg Rating",
    value: "4.6/5",
    change: "+0.3",
    positive: true,
  },
]

export function AnalyticsOverview() {
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
