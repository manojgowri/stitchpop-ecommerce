import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Terms of Service</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-gray-600">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using the Stitch POP website (www.stitchpop.in), you accept and agree to be bound by
                the terms and provision of this agreement. If you do not agree to abide by the above, please do not use
                this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of the materials on Stitch POP's website for
                personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Terms</h2>
              <p className="text-gray-600 mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current
                at all times. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Safeguarding the password and all activities under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring your account information remains accurate and up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Products and Services</h2>
              <p className="text-gray-600 mb-4">
                All products and services are subject to availability. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Limit quantities of any products or services</li>
                <li>Discontinue any product at any time</li>
                <li>Refuse service to anyone for any reason</li>
                <li>Modify prices without prior notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
              <p className="text-gray-600">
                Payment is due at the time of purchase. We accept various payment methods as displayed during checkout.
                All prices are in Indian Rupees (INR) and include applicable taxes unless otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping and Delivery</h2>
              <p className="text-gray-600 mb-4">
                We ship to addresses within India only. Shipping times and costs vary based on:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Delivery location</li>
                <li>Product availability</li>
                <li>Shipping method selected</li>
                <li>Order processing time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns and Exchanges</h2>
              <p className="text-gray-600 mb-4">
                We offer a 30-day return policy for most items. To be eligible for a return:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Items must be unworn and in original condition</li>
                <li>Items must have all original tags attached</li>
                <li>Items must be returned in original packaging</li>
                <li>Return request must be initiated within 30 days of delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prohibited Uses</h2>
              <p className="text-gray-600 mb-4">You may not use our service:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>
                  To violate any international, federal, provincial, or state regulations, rules, laws, or local
                  ordinances
                </li>
                <li>
                  To infringe upon or violate our intellectual property rights or the intellectual property rights of
                  others
                </li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimer</h2>
              <p className="text-gray-600">
                The materials on Stitch POP's website are provided on an 'as is' basis. Stitch POP makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties including without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitations</h2>
              <p className="text-gray-600">
                In no event shall Stitch POP or its suppliers be liable for any damages (including, without limitation,
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                to use the materials on Stitch POP's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-600">
                These terms and conditions are governed by and construed in accordance with the laws of India and you
                irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to revise these terms of service at any time without notice. By using this website,
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-600">
                  <strong>Email:</strong> legal@stitchpop.in
                  <br />
                  <strong>Phone:</strong> +91 98765 43210
                  <br />
                  <strong>Address:</strong> Stitch POP Fashion Pvt. Ltd., 123 Fashion Street, Mumbai, Maharashtra
                  400001, India
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
