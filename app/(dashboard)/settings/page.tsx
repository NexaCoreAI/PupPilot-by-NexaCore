'use client'

import { useState, useEffect } from 'react'
import { User, Bell, Shield, CreditCard, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({ email: user.email ?? '', name: user.user_metadata?.full_name ?? '' })
        setName(user.user_metadata?.full_name ?? '')
      }
    })
  }, [])

  async function saveName() {
    setSaving(true)
    await supabase.auth.updateUser({ data: { full_name: name } })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setSaving(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const sections = [
    {
      icon: User, label: 'Account', color: 'bg-[#EBF5FF] text-[#5B9BD5]',
      content: (
        <div className="space-y-4">
          <Input label="Display name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Email" value={user?.email ?? ''} disabled />
          <Button onClick={saveName} loading={saving} size="sm">
            {saved ? 'Saved!' : 'Save changes'}
          </Button>
        </div>
      ),
    },
    {
      icon: Bell, label: 'Notifications', color: 'bg-[#FFF0ED] text-[#E8705A]',
      content: (
        <div className="space-y-3">
          {['Daily care summary', 'Upcoming reminders', 'Vet appointment alerts'].map(item => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm text-charcoal-700">{item}</span>
              <button className="w-10 h-6 rounded-full bg-[#5B9BD5] relative transition-colors">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          ))}
          <p className="text-xs text-charcoal-400 pt-1">Push notifications require browser permission.</p>
        </div>
      ),
    },
    {
      icon: CreditCard, label: 'Plan & Billing', color: 'bg-[#EDFFF5] text-[#2D8A5A]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#EBF5FF]">
            <div>
              <p className="text-sm font-semibold text-charcoal-700">Free Plan</p>
              <p className="text-xs text-charcoal-400">1 dog · basic features</p>
            </div>
            <Link href="/pricing">
              <Button size="sm" variant="secondary">Upgrade</Button>
            </Link>
          </div>
          <p className="text-xs text-charcoal-400">Upgrade to Pro for unlimited dogs, AI features, and priority support.</p>
        </div>
      ),
    },
    {
      icon: Shield, label: 'Privacy & Data', color: 'bg-charcoal-100 text-charcoal-500',
      content: (
        <div className="space-y-3 text-sm text-charcoal-600">
          <p>Your data is stored securely with Supabase and never sold to third parties.</p>
          <button className="text-[#E8705A] text-sm font-medium hover:underline">Delete my account</button>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <h1 className="text-2xl font-semibold text-charcoal-700">Settings</h1>

      {sections.map(({ icon: Icon, label, color, content }) => (
        <Card key={label}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <h2 className="font-semibold text-charcoal-700">{label}</h2>
          </div>
          {content}
        </Card>
      ))}

      <Card>
        <button onClick={signOut} className="flex items-center gap-3 text-[#E8705A] text-sm font-medium hover:opacity-75 transition-opacity">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </Card>
    </div>
  )
}
