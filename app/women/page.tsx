import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function WomenPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/women" className="text-lg font-medium text-orange-600">
              WOMEN
            </Link>
            <Link href="/men" className="text-lg font-medium hover:text-orange-600">
              MEN
            </Link>
          </div>
          <Link href="/" className="text-2xl font-bold">
            STITCH POP
          </Link>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Category Selection */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 h-[60vh]">
            {/* Tops Section */}
            <div className="relative group overflow-hidden">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Women's Tops"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300">
                <div className="absolute bottom-8 left-8">
                  <h2 className="text-4xl font-bold text-white mb-4">TOPS</h2>
                  <Link href="/women/tops">
                    <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium">
                      SHOP NOW
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottoms Section */}
            <div className="relative group overflow-hidden">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Women's Bottoms"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300">
                <div className="absolute bottom-8 right-8">
                  <h2 className="text-4xl font-bold text-white mb-4">BOTTOMS</h2>
                  <Link href="/women/bottoms">
                    <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full font-medium">
                      SHOP NOW
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
