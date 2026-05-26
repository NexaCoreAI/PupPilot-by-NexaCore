import Link from 'next/link'
import { PawPrint } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-forest">Four Leg Life</span>
        </Link>
        <Link href="/login" className="text-sm text-taupe hover:text-forest font-medium">Sign in</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-sand shadow-card p-8 md:p-12">
          <h1 className="text-3xl font-bold text-forest mb-2">Terms of Service</h1>
          <p className="text-sm text-taupe mb-8">Last updated: May 26, 2026</p>

          <div className="prose prose-sm max-w-none text-charcoal space-y-8">

            {/* Vet Disclaimer — most prominent */}
            <div className="bg-coral/10 border border-coral/30 rounded-xl p-5">
              <h2 className="text-lg font-bold text-forest mb-2">⚠️ Veterinary Disclaimer</h2>
              <p className="text-base text-charcoal">
                <strong>Four Leg Life is not a veterinary service.</strong> Nothing in this application — including care reminders, health record storage, sitter guides, training logs, or any other feature — constitutes veterinary medical advice, diagnosis, or treatment. Always consult a licensed veterinarian for any questions regarding your pet's health, medications, nutrition, or medical conditions. In the event of a pet health emergency, contact your veterinarian or an emergency animal hospital immediately.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">1. Acceptance of Terms</h2>
              <p>By creating an account or using Four Leg Life (the "Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">2. Description of Service</h2>
              <p>Four Leg Life is a pet care organization tool that helps pet owners track daily routines, store records, set reminders, and create care guides. It is a personal productivity tool only. It does not provide veterinary advice, diagnosis, treatment recommendations, or medical services of any kind.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">3. User Accounts</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must be 18 or older to create an account.</li>
                <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
                <li>You must provide accurate information when creating your account.</li>
                <li>You may not share your account with others or create accounts on behalf of others without consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">4. User Content and Data</h2>
              <p className="mb-3">You retain ownership of all content you upload to Four Leg Life, including pet profiles, documents, photos, and notes ("User Content"). By uploading content, you grant us a limited license to store and display it solely to provide the Service to you.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>You are solely responsible for the accuracy and legality of your User Content.</li>
                <li>Do not upload content that is illegal, harmful, or violates third-party rights.</li>
                <li>We do not sell, share, or use your User Content for marketing purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">5. Subscription and Billing</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Free plan features are available at no charge and may be modified at any time.</li>
                <li>Paid plans are billed monthly or annually as selected at checkout.</li>
                <li>Payments are processed securely by Stripe. We do not store your payment card details.</li>
                <li>You may cancel your paid subscription at any time. Cancellation takes effect at the end of the current billing period.</li>
                <li>We do not offer refunds for partial billing periods already paid.</li>
                <li>We reserve the right to change pricing with 30 days' notice to active subscribers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">6. Prohibited Uses</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to access other users' accounts or data</li>
                <li>Reverse engineer, copy, or resell any part of the Service</li>
                <li>Upload malware, viruses, or malicious files</li>
                <li>Use the Service to provide veterinary or medical advice to others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">7. Limitation of Liability</h2>
              <p className="mb-3">To the maximum extent permitted by applicable law, Four Leg Life and its owners, employees, and affiliates shall not be liable for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Any indirect, incidental, special, or consequential damages</li>
                <li>Loss of data, revenue, or profits</li>
                <li>Any harm to your pet resulting from reliance on information in the app</li>
                <li>Service interruptions, bugs, or data loss</li>
              </ul>
              <p className="mt-3">Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months prior to the claim, or $50, whichever is greater.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">8. Indemnification</h2>
              <p>You agree to indemnify and hold harmless Four Leg Life and its affiliates from any claims, damages, or expenses (including legal fees) arising from your use of the Service, your User Content, or your violation of these Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">9. Termination</h2>
              <p>We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or any reason we deem necessary to protect the Service or other users. You may delete your account at any time through the Settings page.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">10. Changes to Terms</h2>
              <p>We may update these Terms from time to time. We will notify you of significant changes via email or in-app notice. Continued use of the Service after changes constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">11. Governing Law</h2>
              <p>These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">12. Contact</h2>
              <p>For questions about these Terms, contact us at <strong>legal@fourleglife.com</strong></p>
            </section>

          </div>

          <div className="mt-10 pt-6 border-t border-sand flex gap-4 text-sm">
            <Link href="/privacy" className="text-sage font-medium hover:underline">Privacy Policy</Link>
            <Link href="/pricing" className="text-sage font-medium hover:underline">Pricing</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
