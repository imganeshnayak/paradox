import { Smartphone, Map, Clock, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Scan Artwork",
    description: "Point your device at any painting to instantly reveal its history, technique, and hidden stories.",
  },
  {
    icon: Map,
    title: "Museum Map",
    description: "Navigate through galleries and discover masterpieces waiting to be explored on every floor.",
  },
  {
    icon: Clock,
    title: "Your Journey",
    description: "Revisit the artworks you've discovered and trace your path through art history.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Explore visitor engagement patterns and discover which masterpieces captivate the most.",
  },
]

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-8 rounded-lg border border-border bg-card hover:border-accent/50 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-accent/10 text-accent mb-6">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
