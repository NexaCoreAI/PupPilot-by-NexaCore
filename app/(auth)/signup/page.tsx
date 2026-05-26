'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PawPrint } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SignupPage() {
  const supabase = createClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    })
    if (error) { setError(error.message); setLoading(false) }
    else { window.location.href = '/today' }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-card border border-sand p-8 text-center">
          <div className="text-4xl mb-4">🐾</div>
          <h2 className="text-xl font-bold text-forest mb-2">Check your email</h2>
          <p className="text-base text-taupe">We sent a confirmation link to <strong>{email}</strong>.</p>
          <Link href="/login" className="block mt-6 text-base text-sage font-semibold hover:underline">Back to sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center shadow-sm">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-forest text-xl block leading-tight">Four Leg Life</span>
            <span className="text-xs text-taupe">Your pet's life, organized.</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-sand p-8">
          <h2 className="text-2xl font-bold text-forest mb-1">Create account</h2>
          <p className="text-base text-taupe mb-6">Start managing your pet's care today</p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input label="Your name" type="text" placeholder="Alex" value={name} onChange={e => setName(e.target.value)} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
            {error && <p className="text-sm text-danger bg-danger/10 rounded-lg px-4 py-3">{error}</p>}
            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">Create account</Button>
          </form>

          <p className="text-base text-taupe text-center mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-sage font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
