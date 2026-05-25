'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Bell } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Reminder {
  id: string
  title: string
  category: string
  remind_at: string | null
  frequency: string | null
  notes: string | null
  active: boolean
}

const CATEGORIES = ['Vet Visit','Vaccination','Medication','Grooming','License Renewal','Other']
const FREQUENCIES = ['Once','Daily','Weekly','Monthly','Yearly']

export default function RemindersPage() {
  const supabase = createClient()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Vet Visit', remind_at: '', frequency: 'Once', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadReminders() }, [])

  async function loadReminders() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('reminders').select('*').eq('user_id', user.id).order('remind_at', { nullsFirst: false })
    setReminders(data ?? [])
    setLoading(false)
  }

  async function addReminder() {
    if (!form.title.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('reminders').insert({
      user_id: user.id,
      title: form.title.trim(),
      category: form.category,
      remind_at: form.remind_at || null,
      frequency: form.frequency,
      notes: form.notes || null,
      active: true,
    }).select().single()

    if (!error && data) {
      setReminders(prev => [...prev, data])
      setForm({ title: '', category: 'Vet Visit', remind_at: '', frequency: 'Once', notes: '' })
      setAdding(false)
    }
    setSaving(false)
  }

  async function deleteReminder(id: string) {
    await supabase.from('reminders').delete().eq('id', id)
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const upcoming = reminders.filter(r => r.active)
  const past = reminders.filter(r => !r.active)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-charcoal-700">Reminders</h1>
        <Button onClick={() => setAdding(true)} size="sm">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      {adding && (
        <Card className="border border-[#5B9BD5]/20">
          <h3 className="font-semibold text-charcoal-700 mb-4">New reminder</h3>
          <div className="grid grid-cols-1 gap-3">
            <Input label="What's the reminder?" placeholder="Annual vet checkup" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} autoFocus />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal-700">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal-700">Frequency</label>
                <select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]">
                  {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <Input label="Date / time (optional)" type="datetime-local" value={form.remind_at} onChange={e => setForm(p => ({ ...p, remind_at: e.target.value }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal-700">Notes (optional)</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Any additional details..."
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setAdding(false)}>Cancel</Button>
            <Button onClick={addReminder} loading={saving}>Save reminder</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="py-12 text-center text-charcoal-400 text-sm">Loading...</div>
      ) : reminders.length === 0 ? (
        <Card className="text-center py-12">
          <Bell className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
          <h3 className="font-semibold text-charcoal-700 mb-1">No reminders yet</h3>
          <p className="text-sm text-charcoal-400 mb-4">Set up vet visits, medications, and recurring events</p>
          <Button onClick={() => setAdding(true)}><Plus className="w-4 h-4" /> Add reminder</Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map(r => (
            <Card key={r.id} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF0ED] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-[#E8705A]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-charcoal-700">{r.title}</p>
                  <Badge variant="coral">{r.category}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {r.remind_at && <span className="text-xs text-charcoal-400">{format(new Date(r.remind_at), 'MMM d, yyyy · h:mm a')}</span>}
                  <span className="text-xs text-charcoal-400">{r.frequency}</span>
                </div>
                {r.notes && <p className="text-xs text-charcoal-400 mt-1">{r.notes}</p>}
              </div>
              <button onClick={() => deleteReminder(r.id)} className="p-1.5 rounded-lg text-charcoal-300 hover:text-[#E8705A] hover:bg-[#FFF0ED] transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
