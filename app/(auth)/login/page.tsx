'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
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
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#5B9BD5] flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-charcoal-700 text-2xl tracking-tight">Four Leg Life</span>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          <h2 className="text-xl font-semibold text-charcoal-700 mb-1">Welcome back</h2>
          <p className="text-sm text-charcoal-400 mb-6">Sign in to your account</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-[#E8705A] bg-[#FFF0ED] rounded-xl px-3 py-2">{error}</p>}
            <Button type="submit" size="lg" loading={loading} className="w-full mt-1">
              Sign in
            </Button>
          </form>

          <p className="text-sm text-charcoal-400 text-center mt-5">
            No account?{' '}
            <Link href="/signup" className="text-[#5B9BD5] font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
