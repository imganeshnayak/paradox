import { Smartphone, Headphones, Sparkles, Map } from "lucide-react"

const features = [
  {
    icon: Smartphone,
    title: "Instant Access",
    description: "Scan QR codes to instantly view artwork details, high-resolution images, and interactive content.",
  },
  {
    icon: Headphones,
    title: "Audio Guides",
    description: "Listen to expert narrations about artwork history, techniques, and cultural significance.",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description: "Receive personalized artwork suggestions based on your interests and exploration patterns.",
  },
  {
    icon: Map,
    title: "Museum Navigation",
    description: "Find your way around the museum with interactive maps and suggested routes.",
  },
]

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-12">
          Why Choose ArtVerse
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                    <Icon size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
