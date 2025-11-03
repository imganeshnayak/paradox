export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">ArtVerse</h3>
            <p className="text-background/80 text-sm">Transforming how visitors experience museum artworks.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <a href="/explore" className="hover:text-background">
                  Explore
                </a>
              </li>
              <li>
                <a href="/guide" className="hover:text-background">
                  Guide
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <a href="#" className="hover:text-background">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li>
                <a href="#" className="hover:text-background">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/20 pt-8 text-center text-sm text-background/70">
          <p>&copy; 2025 ArtVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
