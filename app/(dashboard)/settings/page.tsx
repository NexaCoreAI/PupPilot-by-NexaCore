'use client'

import { useState, useEffect } from 'react'
import { User, Bell, Shield, CreditCard, LogOut, Trash2, AlertTriangle } from 'lucide-react'
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email ?? '', name: session.user.user_metadata?.full_name ?? '' })
        setName(session.user.user_metadata?.full_name ?? '')
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

  async function deleteAccount() {
    if (deleteConfirm !== 'DELETE') return
    setDeleting(true)
    setDeleteError('')
    const res = await fetch('/api/delete-account', { method: 'DELETE' })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      setDeleteError(body.error ?? 'Something went wrong. Please try again.')
      setDeleting(false)
      return
    }
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-forest">Settings</h1>
        <p className="text-sm text-taupe mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Account */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-sky/20 text-sky">
            <User className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-forest">Account</h2>
        </div>
        <div className="space-y-4">
          <Input label="Display name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Email" value={user?.email ?? ''} disabled />
          <Button onClick={saveName} loading={saving} size="sm">
            {saved ? 'Saved!' : 'Save changes'}
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-coral/10 text-coral">
            <Bell className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-forest">Notifications</h2>
        </div>
        <div className="space-y-3">
          {['Daily care summary', 'Upcoming reminders', 'Vet appointment alerts'].map(item => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-sm text-charcoal">{item}</span>
              <button className="w-10 h-6 rounded-full bg-sage relative transition-colors">
                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>
          ))}
          <p className="text-xs text-taupe pt-1">Push notifications require browser permission.</p>
        </div>
      </Card>

      {/* Plan & Billing */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-sage/10 text-sage">
            <CreditCard className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-forest">Plan &amp; Billing</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-sand">
            <div>
              <p className="text-sm font-semibold text-forest">Free Plan</p>
              <p className="text-xs text-taupe">1 dog · basic features</p>
            </div>
            <Link href="/pricing">
              <Button size="sm" variant="secondary">Upgrade</Button>
            </Link>
          </div>
          <p className="text-xs text-taupe">Upgrade to Pro for unlimited dogs, AI features, and priority support.</p>
        </div>
      </Card>

      {/* Privacy & Data */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-taupe/10 text-taupe">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="font-semibold text-forest">Privacy &amp; Data</h2>
        </div>
        <div className="space-y-3 text-sm text-charcoal">
          <p>Your data is stored securely and never sold to third parties.</p>
          <div className="flex gap-4 text-sm pt-1">
            <Link href="/privacy" className="text-sage font-medium hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-sage font-medium hover:underline">Terms of Service</Link>
          </div>
          <div className="pt-2 border-t border-sand">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-coral text-sm font-medium hover:opacity-75 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
              Delete my account
            </button>
            <p className="text-xs text-taupe mt-1">Permanently deletes your account, all pets, and all data.</p>
          </div>
        </div>
      </Card>

      {/* Sign out */}
      <Card>
        <button onClick={signOut} className="flex items-center gap-3 text-coral text-sm font-medium hover:opacity-75 transition-opacity">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </Card>

      {/* Delete account modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-sand shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-coral" />
              </div>
              <h3 className="text-lg font-bold text-forest">Delete account</h3>
            </div>
            <p className="text-sm text-charcoal mb-4">
              This will permanently delete your account, all pet profiles, care logs, reminders, and uploaded documents. <strong>This cannot be undone.</strong>
            </p>
            <p className="text-sm text-taupe mb-3">Type <strong>DELETE</strong> to confirm:</p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2.5 rounded-lg border border-sand text-sm focus:outline-none focus:ring-2 focus:ring-coral/30 focus:border-coral mb-4"
            />
            {deleteError && (
              <p className="text-sm text-coral bg-coral/10 rounded-lg px-4 py-3 mb-4">{deleteError}</p>
            )}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); setDeleteError('') }}
                className="flex-1"
              >
                Cancel
              </Button>
              <button
                onClick={deleteAccount}
                disabled={deleteConfirm !== 'DELETE' || deleting}
                className="flex-1 h-10 rounded-lg bg-coral text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {deleting ? 'Deleting…' : 'Delete forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
