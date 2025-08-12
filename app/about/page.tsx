import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">About Us</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Stitch POP</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8">
              Welcome to Stitch POP - where fashion meets comfort, and style meets affordability. We're passionate about
              bringing you the latest trends in clothing for men, women, and kids.
            </p>

            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded with a vision to make quality fashion accessible to everyone, Stitch POP has grown from a
                  small startup to a trusted name in online fashion retail across India.
                </p>
                <p className="text-gray-600">
                  We believe that great style shouldn't break the bank, and that's why we work directly with
                  manufacturers to bring you premium quality clothing at unbeatable prices.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  To democratize fashion by providing high-quality, trendy clothing that's accessible to everyone,
                  regardless of their budget or location.
                </p>
                <p className="text-gray-600">
                  We're committed to sustainable practices, ethical manufacturing, and exceptional customer service that
                  makes shopping with us a delightful experience.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Stitch POP?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">Q</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quality First</h3>
                  <p className="text-gray-600 text-sm">Premium materials and careful craftsmanship in every piece</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">₹</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
                  <p className="text-gray-600 text-sm">Direct-to-consumer pricing without compromising on quality</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">🚚</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600 text-sm">Quick and reliable shipping across India</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Shopping?</h2>
              <p className="text-gray-600 mb-6">Discover our latest collections and find your perfect style today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/men">Shop Men's</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/women">Shop Women's</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/kids">Shop Kids</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
