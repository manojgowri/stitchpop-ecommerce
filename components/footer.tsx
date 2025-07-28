import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SP</span>
              </div>
              <span className="font-bold text-xl">Stitch POP</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium fashion and lifestyle brand offering the latest trends in clothing for men and women. Quality,
              style, and comfort in every piece.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/men" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Men's Collection
              </Link>
              <Link href="/women" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Women's Collection
              </Link>
              <Link
                href="/categories"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                All Categories
              </Link>
              <Link
                href="/collections"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Collections
              </Link>
              <Link href="/sale" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sale
              </Link>
              <Link
                href="/new-arrivals"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
              <Link href="/shipping" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Returns & Exchanges
              </Link>
              <Link
                href="/size-guide"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Size Guide
              </Link>
              <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link
                href="/track-order"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Track Your Order
              </Link>
            </nav>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Connected</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="space-y-2">
              <Input type="email" placeholder="Enter your email" />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@stitchpop.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Fashion St, Style City, SC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <p className="text-sm text-muted-foreground">© 2024 Stitch POP. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">We accept:</span>
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
                <span className="text-xs font-bold">VISA</span>
              </div>
              <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
                <span className="text-xs font-bold">MC</span>
              </div>
              <div className="w-8 h-5 bg-muted rounded flex items-center justify-center">
                <span className="text-xs font-bold">PP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
