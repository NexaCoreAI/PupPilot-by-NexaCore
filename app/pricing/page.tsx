import Link from 'next/link'
import { Check, Heart } from 'lucide-react'
import Card from '@/components/ui/Card'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for one dog and basic daily care.',
    features: [
      '1 dog profile',
      'Daily checklist (up to 5 tasks)',
      'Basic reminders',
      'Document upload (100 MB)',
      'Sitter guide (3/month)',
    ],
    cta: 'Get started',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    description: 'For the dedicated dog parent with multiple pups.',
    features: [
      'Up to 5 dog profiles',
      'Unlimited daily tasks',
      'Advanced reminders with push notifications',
      'Document storage (5 GB)',
      'Unlimited sitter guides',
      'Training tracker with AI tips',
      'Weekly care reports',
      'Priority support',
    ],
    cta: 'Start free trial',
    href: '/signup',
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Family',
    price: '$19',
    period: 'per month',
    description: 'Multi-household, unlimited dogs, everything included.',
    features: [
      'Unlimited dog profiles',
      'Everything in Pro',
      'Up to 3 family members',
      'Shared care calendar',
      'Vet visit scheduling',
      'AI health insights',
      'Dedicated support',
    ],
    cta: 'Start free trial',
    href: '/signup',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/today" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#5B9BD5] flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-charcoal-700">PupPilot</span>
        </Link>
        <Link href="/login" className="text-sm text-charcoal-500 hover:text-charcoal-700 font-medium">Sign in</Link>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal-700 mb-3">Simple, honest pricing</h1>
          <p className="text-lg text-charcoal-400 max-w-md mx-auto">
            Start free. Upgrade when your pack grows. Cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(plan => (
            <div key={plan.name} className={`relative ${plan.highlight ? 'md:-mt-4' : ''}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-[#5B9BD5] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">{plan.badge}</span>
                </div>
              )}
              <Card className={`h-full flex flex-col ${plan.highlight ? 'border-2 border-[#5B9BD5] shadow-card-hover' : ''}`}>
                <div className="mb-5">
                  <h2 className="font-bold text-charcoal-700 text-lg">{plan.name}</h2>
                  <div className="flex items-baseline gap-1 mt-2 mb-1">
                    <span className="text-4xl font-bold text-charcoal-700">{plan.price}</span>
                    <span className="text-sm text-charcoal-400">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-charcoal-400">{plan.description}</p>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {plan.features.map(feature => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#EDFFF5] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#2D8A5A] stroke-[3]" />
                      </div>
                      <span className="text-sm text-charcoal-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-3 px-4 rounded-2xl font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? 'bg-[#5B9BD5] text-white hover:bg-[#3D7FBF]'
                      : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </Card>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="text-center mt-14">
          <p className="text-charcoal-400 text-sm">
            Questions? Email us at{' '}
            <span className="text-[#5B9BD5] font-medium">hello@puppilot.app</span>
          </p>
          <p className="text-xs text-charcoal-300 mt-2">Stripe billing · cancel anytime · no hidden fees</p>
        </div>
      </main>
    </div>
  )
}
