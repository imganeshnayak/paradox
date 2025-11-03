import { Card } from "@/components/ui/card"
import { MessageSquare, Star } from "lucide-react"

const feedback = [
  { name: "Sarah M.", rating: 5, text: "The audio guides were incredibly informative!", artwork: "Starry Night" },
  { name: "James L.", rating: 4, text: "Great experience, loved the recommendations.", artwork: "The Kiss" },
  { name: "Emma T.", rating: 5, text: "Perfect way to learn about the artworks", artwork: "Girl with Pearl" },
  { name: "Michael R.", rating: 4, text: "Enjoyed exploring the museum this way", artwork: "Persistence" },
]

export function VisitorFeedback() {
  return (
    <Card className="bg-card border border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Recent Feedback</h3>
      </div>
      <div className="space-y-4">
        {feedback.map((item, index) => (
          <div key={index} className="p-4 bg-background rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-foreground/60">{item.artwork}</p>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < item.rating ? "fill-accent text-accent" : "text-muted-foreground"}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-foreground/70 italic">{`"${item.text}"`}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
