'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Routine {
  id: string
  title: string
  category: string
  time_of_day: string | null
  active: boolean
}

const CATEGORIES = ['Feeding','Walk','Medication','Grooming','Play','Training','Other']
const TIMES = ['Morning','Afternoon','Evening','Night','Anytime']

const categoryBadge: Record<string, 'blue'|'coral'|'green'|'gray'> = {
  feeding: 'gray', walk: 'green', medication: 'coral', grooming: 'blue',
}

export default function ChecklistPage() {
  const supabase = createClient()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'Feeding', time_of_day: 'Morning' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadRoutines()
  }, [])

  async function loadRoutines() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('routines').select('*').eq('user_id', user.id).order('created_at')
    setRoutines(data ?? [])
    setLoading(false)
  }

  async function addRoutine() {
    if (!form.title.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('routines').insert({
      user_id: user.id,
      title: form.title.trim(),
      category: form.category.toLowerCase(),
      time_of_day: form.time_of_day,
      active: true,
    }).select().single()

    if (!error && data) {
      setRoutines(prev => [...prev, data])
      setForm({ title: '', category: 'Feeding', time_of_day: 'Morning' })
      setAdding(false)
    }
    setSaving(false)
  }

  async function deleteRoutine(id: string) {
    await supabase.from('routines').delete().eq('id', id)
    setRoutines(prev => prev.filter(r => r.id !== id))
  }

  async function toggleActive(id: string, active: boolean) {
    await supabase.from('routines').update({ active: !active }).eq('id', id)
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, active: !active } : r))
  }

  const grouped = TIMES.reduce((acc, time) => {
    const items = routines.filter(r => r.time_of_day === time)
    if (items.length) acc[time] = items
    return acc
  }, {} as Record<string, Routine[]>)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-charcoal-700">Daily Checklist</h1>
        <Button onClick={() => setAdding(true)} size="sm">
          <Plus className="w-4 h-4" /> Add task
        </Button>
      </div>

      {adding && (
        <Card className="border border-[#5B9BD5]/20">
          <h3 className="font-semibold text-charcoal-700 mb-4">New routine task</h3>
          <div className="grid grid-cols-1 gap-3">
            <Input
              label="Task name"
              placeholder="e.g. Morning walk"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              autoFocus
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal-700">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal-700">Time of day</label>
                <select value={form.time_of_day} onChange={e => setForm(p => ({ ...p, time_of_day: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]">
                  {TIMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setAdding(false)}>Cancel</Button>
            <Button onClick={addRoutine} loading={saving}>Save task</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-charcoal-400 text-sm">Loading...</div>
      ) : routines.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-4xl mb-3">📋</p>
          <h3 className="font-semibold text-charcoal-700 mb-1">No routines yet</h3>
          <p className="text-sm text-charcoal-400 mb-4">Add daily tasks to track on the Today dashboard</p>
          <Button onClick={() => setAdding(true)}><Plus className="w-4 h-4" /> Add first task</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([time, items]) => (
            <div key={time}>
              <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-2 px-1">{time}</h3>
              <div className="flex flex-col gap-2">
                {items.map(r => (
                  <Card key={r.id} className={`flex items-center gap-3 p-3.5 ${!r.active ? 'opacity-50' : ''}`}>
                    <GripVertical className="w-4 h-4 text-charcoal-300 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal-700">{r.title}</p>
                      <Badge variant={categoryBadge[r.category] ?? 'gray'} className="mt-1">{r.category}</Badge>
                    </div>
                    <button
                      onClick={() => toggleActive(r.id, r.active)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${r.active ? 'bg-[#EDFFF5] text-[#2D8A5A]' : 'bg-charcoal-100 text-charcoal-400'}`}
                    >
                      {r.active ? 'Active' : 'Paused'}
                    </button>
                    <button onClick={() => deleteRoutine(r.id)} className="p-1.5 rounded-lg text-charcoal-300 hover:text-[#E8705A] hover:bg-[#FFF0ED] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
