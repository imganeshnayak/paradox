import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-6">Ready to Explore?</h2>
        <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Join thousands of visitors discovering artworks in a whole new way.
        </p>
        <Link href="/explore">
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Start Your Journey
          </Button>
        </Link>
      </div>
    </section>
  )
}
