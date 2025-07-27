"use client"
import Link from "next/link"
import Image from "next/image"
import { Search, User, ShoppingCart } from "lucide-react"

export default function MenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200">
      {/* Header */}
      <header className="bg-transparent p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/women" className="text-lg font-medium hover:text-orange-600">
              WOMEN
            </Link>
            <Link href="/men" className="text-lg font-medium text-orange-600">
              MEN
            </Link>
          </div>
          <Link href="/" className="text-2xl font-bold text-white">
            STITCH POP
          </Link>
          <div className="flex items-center space-x-4">
            <Search className="w-6 h-6" />
            <User className="w-6 h-6" />
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg p-6 h-screen overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3">MENS NEW ARRIVALS</h3>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">COLLECTION</h3>
              <div className="space-y-2 text-sm">
                <div>STITCH POP SKYCLUB</div>
                <div>ENDLESS SUMMER</div>
                <div>CHRISTMAS X STITCH POP</div>
                <div>FALL SZN</div>
                <div>THE KNIT EDIT</div>
                <div>CORDUROY</div>
                <div>PUSHIN B</div>
                <div>SUPIMA</div>
                <div>COCKTAIL</div>
                <div>ACOSTA</div>
                <div>FADED</div>
                <div>SHADES OF WINTER</div>
                <div>KOOKIE</div>
                <div>ANIME</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">CATEGORIES</h3>
              <div className="space-y-2 text-sm">
                <Link href="/men/t-shirts" className="block hover:text-orange-600">
                  OVERSIZED T-SHIRTS
                </Link>
                <Link href="/men/bottoms" className="block hover:text-orange-600">
                  BOTTOMS
                </Link>
                <Link href="/men/tanks" className="block hover:text-orange-600">
                  TANKS
                </Link>
                <Link href="/men/cargos" className="block hover:text-orange-600">
                  CARGOS
                </Link>
                <Link href="/men/joggers" className="block hover:text-orange-600">
                  JOGGERS
                </Link>
                <Link href="/men/shorts" className="block hover:text-orange-600">
                  SHORTS
                </Link>
                <Link href="/men/jeans" className="block hover:text-orange-600">
                  JEANS
                </Link>
                <Link href="/men/hoodies" className="block hover:text-orange-600">
                  SWEATSHIRTS & HOODIES
                </Link>
                <Link href="/men/basics" className="block hover:text-orange-600">
                  BASICS
                </Link>
                <Link href="/men/jackets" className="block hover:text-orange-600">
                  JACKETS
                </Link>
                <Link href="/men/shirts" className="block hover:text-orange-600">
                  OVERSIZED SHIRTS
                </Link>
                <Link href="/men/regular-shirts" className="block hover:text-orange-600">
                  REGULAR SHIRTS
                </Link>
                <Link href="/men/sets" className="block hover:text-orange-600">
                  CO-ORD SETS
                </Link>
                <Link href="/men/signature" className="block hover:text-orange-600">
                  SIGNATURE
                </Link>
                <Link href="/men/polo" className="block hover:text-orange-600">
                  POLO
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="relative h-[600px] overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Men's Collection"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20">
              <div className="absolute bottom-8 left-8">
                <div className="text-white">
                  <div className="text-lg font-medium mb-2">NEW IN</div>
                  <div className="text-lg font-medium">SHOP</div>
                </div>
              </div>
              <div className="absolute bottom-8 right-8">
                <div className="text-white">
                  <div className="text-lg font-medium mb-2">SPECIAL PRICE</div>
                  <div className="text-lg font-medium">SHOP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
