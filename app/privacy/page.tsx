import Link from 'next/link'
import { PawPrint } from 'lucide-react'

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-forest mb-2">Privacy Policy</h1>
          <p className="text-sm text-taupe mb-8">Last updated: May 26, 2026</p>

          <div className="space-y-8 text-charcoal">

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">1. Overview</h2>
              <p>Four Leg Life ("we", "us", "our") takes your privacy seriously. This policy explains what personal data we collect, how we use it, who we share it with, and what rights you have. By using the Service, you agree to the practices described here.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">2. Data We Collect</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-cream border border-sand">
                  <h3 className="font-semibold text-forest mb-2">Account Data</h3>
                  <p className="text-sm">Name, email address, and password (hashed — we never see it in plain text). Collected when you create an account.</p>
                </div>
                <div className="p-4 rounded-lg bg-cream border border-sand">
                  <h3 className="font-semibold text-forest mb-2">Pet Profile Data</h3>
                  <p className="text-sm">Pet name, breed, age, weight, vet information, medications, allergies, and notes you choose to add. You control all of this.</p>
                </div>
                <div className="p-4 rounded-lg bg-cream border border-sand">
                  <h3 className="font-semibold text-forest mb-2">Care Activity Data</h3>
                  <p className="text-sm">Daily routine completions, reminder dates, training logs, and checklist activity. Used to power your dashboard.</p>
                </div>
                <div className="p-4 rounded-lg bg-cream border border-sand">
                  <h3 className="font-semibold text-forest mb-2">Uploaded Documents</h3>
                  <p className="text-sm">Files you upload to Records (vet documents, vaccine certificates, etc.). Stored securely and only accessible to your account.</p>
                </div>
                <div className="p-4 rounded-lg bg-cream border border-sand">
                  <h3 className="font-semibold text-forest mb-2">Payment Data</h3>
                  <p className="text-sm">Billing is handled entirely by Stripe. We never see or store your full card number, CVV, or banking details.</p>
                </div>
                <div className="p-4 rounded-lg bg-cream border border-sand">
                  <h3 className="font-semibold text-forest mb-2">Usage Data</h3>
                  <p className="text-sm">Basic analytics such as pages visited and features used, collected anonymously to improve the product.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">3. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>To provide and operate the Service</li>
                <li>To send reminders and care notifications you configure</li>
                <li>To process payments via Stripe</li>
                <li>To respond to support requests</li>
                <li>To improve app features and fix bugs (using anonymized data)</li>
                <li>To comply with legal obligations</li>
              </ul>
              <p className="mt-3 text-sm font-medium text-forest">We do not sell your personal data. We do not use your data for advertising.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">4. Third-Party Services</h2>
              <p className="mb-3 text-sm">We use the following trusted third-party services to operate Four Leg Life:</p>
              <div className="space-y-3">
                {[
                  { name: 'Supabase', use: 'Database, authentication, and file storage. Data is encrypted at rest and in transit.', link: 'supabase.com/privacy' },
                  { name: 'Vercel', use: 'Application hosting and delivery. Processes request data to serve the app.', link: 'vercel.com/legal/privacy-policy' },
                  { name: 'Stripe', use: 'Payment processing for paid plans. Subject to Stripe\'s own privacy policy.', link: 'stripe.com/privacy' },
                ].map(s => (
                  <div key={s.name} className="flex gap-3 p-3 rounded-lg bg-cream border border-sand">
                    <div className="flex-1">
                      <span className="font-semibold text-forest text-sm">{s.name} — </span>
                      <span className="text-sm text-charcoal">{s.use}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">5. Data Storage and Security</h2>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>All data is stored on Supabase infrastructure with encryption at rest</li>
                <li>All data in transit is protected by TLS/HTTPS</li>
                <li>Access to your data is restricted by Row Level Security — only your account can access your records</li>
                <li>Uploaded documents are stored in private, access-controlled storage</li>
                <li>We do not have employees who routinely access your personal data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">6. Your Rights (GDPR &amp; CCPA)</h2>
              <p className="mb-3 text-sm">Depending on your location, you may have the following rights:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { right: 'Access', desc: 'Request a copy of the data we hold about you' },
                  { right: 'Correction', desc: 'Update or correct inaccurate personal data' },
                  { right: 'Deletion', desc: 'Delete your account and all associated data' },
                  { right: 'Portability', desc: 'Export your data in a machine-readable format' },
                  { right: 'Restriction', desc: 'Restrict how we process your data in certain cases' },
                  { right: 'Objection', desc: 'Object to processing based on legitimate interests' },
                ].map(r => (
                  <div key={r.right} className="p-3 rounded-lg bg-cream border border-sand">
                    <p className="font-semibold text-forest text-sm">{r.right}</p>
                    <p className="text-sm text-taupe">{r.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm">To exercise any of these rights, you can delete your account directly in Settings, or contact us at <strong>privacy@fourleglife.com</strong>. We will respond within 30 days.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">7. Data Retention</h2>
              <p className="text-sm">We retain your data for as long as your account is active. When you delete your account, all personal data — including pet profiles, care logs, reminders, documents, and sitter guides — is permanently deleted within 30 days. Anonymized, aggregated usage statistics may be retained indefinitely.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">8. Children's Privacy</h2>
              <p className="text-sm">Four Leg Life is not directed at children under 13. We do not knowingly collect personal data from anyone under 13. If you believe a child has provided us with personal data, contact us at <strong>privacy@fourleglife.com</strong> and we will delete it promptly.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">9. Cookies</h2>
              <p className="text-sm">We use essential cookies only — specifically, session cookies required to keep you logged in. We do not use third-party tracking cookies or advertising cookies.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">10. Changes to This Policy</h2>
              <p className="text-sm">We may update this Privacy Policy from time to time. We will notify you of material changes via email or in-app notice at least 14 days before they take effect.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-forest mb-3">11. Contact</h2>
              <p className="text-sm">For privacy questions or to exercise your rights: <strong>privacy@fourleglife.com</strong></p>
            </section>

          </div>

          <div className="mt-10 pt-6 border-t border-sand flex gap-4 text-sm">
            <Link href="/terms" className="text-sage font-medium hover:underline">Terms of Service</Link>
            <Link href="/pricing" className="text-sage font-medium hover:underline">Pricing</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
