'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SignupPage() {
  const router = useRouter()
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
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-card p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EDFFF5] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🐾</span>
          </div>
          <h2 className="text-xl font-semibold text-charcoal-700 mb-2">Check your email</h2>
          <p className="text-sm text-charcoal-400">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <Link href="/login" className="block mt-6 text-sm text-[#5B9BD5] font-medium hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#5B9BD5] flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-charcoal-700 text-2xl tracking-tight">PupPilot</span>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          <h2 className="text-xl font-semibold text-charcoal-700 mb-1">Create account</h2>
          <p className="text-sm text-charcoal-400 mb-6">Start managing your dog's care today</p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <Input
              label="Your name"
              type="text"
              placeholder="Alex"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              required
            />
            {error && <p className="text-sm text-[#E8705A] bg-[#FFF0ED] rounded-xl px-3 py-2">{error}</p>}
            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
              Create account
            </Button>
          </form>

          <p className="text-sm text-charcoal-400 text-center mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-[#5B9BD5] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
