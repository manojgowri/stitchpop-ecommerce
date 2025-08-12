import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-gray-600">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, make a purchase,
                or contact us for support.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Personal information (name, email address, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Order history and preferences</li>
                <li>Communications with our customer service team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Provide customer support</li>
                <li>Send you promotional emails (with your consent)</li>
                <li>Improve our products and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>With service providers who help us operate our business</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. However, no method of transmission over the internet is
                100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-600">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site
                traffic, and personalize content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Access and update your personal information</li>
                <li>Delete your account and personal data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>File a complaint with relevant authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-600">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-600">
                  <strong>Email:</strong> privacy@stitchpop.in
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
