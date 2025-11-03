import { Smartphone, Map, Clock, BarChart } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Smartphone,
    title: "Scan Artwork",
    description: "Point your device at any painting to instantly reveal its history, technique, and hidden stories.",
    href: "/explore"
  },
  {
    icon: Map,
    title: "Museum Map",
    description: "Navigate through galleries and discover masterpieces waiting to be explored on every floor.",
    href: "/museum-map"
  },
  {
    icon: Clock,
    title: "Your Journey",
    description: "Revisit the artworks you've discovered and trace your path through art history.",
    href: "/journey"
  },
  {
    icon: BarChart,
    title: "Analytics",
    description: "Explore visitor engagement patterns and discover which masterpieces captivate the most.",
    href: "/admin"
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
              <Link href={feature.href} key={index} className="block">
                <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-background shadow-md hover:shadow-lg border border-[color:var(--border)] transition-all duration-200 hover:scale-[1.03] cursor-pointer h-full min-h-[220px]">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/20 text-primary mb-4">
                    <Icon size={40} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-2 text-center">{feature.title}</h3>
                  <p className="text-foreground/70 text-center text-base">{feature.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
