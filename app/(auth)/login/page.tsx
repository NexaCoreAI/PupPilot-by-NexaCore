'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PawPrint } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/today'
    }
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
          <h2 className="text-2xl font-bold text-forest mb-1">Welcome back</h2>
          <p className="text-base text-taupe mb-6">Sign in to your account</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-danger bg-danger/10 rounded-lg px-4 py-3">{error}</p>}
            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">Sign in</Button>
          </form>

          <p className="text-base text-taupe text-center mt-5">
            No account?{' '}
            <Link href="/signup" className="text-sage font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
