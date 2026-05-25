'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Dumbbell, Check } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Goal {
  id: string
  title: string
  category: string
  target_date: string | null
  notes: string | null
  completed: boolean
  created_at: string
}

interface Log {
  id: string
  goal_id: string
  session_date: string
  duration_minutes: number | null
  notes: string | null
}

const CATEGORIES = ['Basic Commands','Leash Training','Socialization','Tricks','Agility','Behavioral','Other']

export default function TrainingPage() {
  const supabase = createClient()
  const [goals, setGoals] = useState<Goal[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [addingGoal, setAddingGoal] = useState(false)
  const [loggingId, setLoggingId] = useState<string | null>(null)
  const [goalForm, setGoalForm] = useState({ title: '', category: 'Basic Commands', target_date: '', notes: '' })
  const [logForm, setLogForm] = useState({ duration_minutes: '', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [{ data: g }, { data: l }] = await Promise.all([
      supabase.from('training_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('training_logs').select('*').eq('user_id', user.id).order('session_date', { ascending: false }).limit(20),
    ])
    setGoals(g ?? [])
    setLogs(l ?? [])
    setLoading(false)
  }

  async function addGoal() {
    if (!goalForm.title.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('training_goals').insert({
      user_id: user.id,
      title: goalForm.title.trim(),
      category: goalForm.category,
      target_date: goalForm.target_date || null,
      notes: goalForm.notes || null,
      completed: false,
    }).select().single()

    if (!error && data) {
      setGoals(prev => [data, ...prev])
      setGoalForm({ title: '', category: 'Basic Commands', target_date: '', notes: '' })
      setAddingGoal(false)
    }
    setSaving(false)
  }

  async function logSession(goalId: string) {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase.from('training_logs').insert({
      goal_id: goalId,
      user_id: user.id,
      session_date: format(new Date(), 'yyyy-MM-dd'),
      duration_minutes: logForm.duration_minutes ? parseInt(logForm.duration_minutes) : null,
      notes: logForm.notes || null,
    }).select().single()

    if (!error && data) {
      setLogs(prev => [data, ...prev])
      setLogForm({ duration_minutes: '', notes: '' })
      setLoggingId(null)
    }
    setSaving(false)
  }

  async function toggleComplete(id: string, completed: boolean) {
    await supabase.from('training_goals').update({ completed: !completed }).eq('id', id)
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !completed } : g))
  }

  async function deleteGoal(id: string) {
    await supabase.from('training_goals').delete().eq('id', id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  const active = goals.filter(g => !g.completed)
  const completed = goals.filter(g => g.completed)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-charcoal-700">Training</h1>
        <Button onClick={() => setAddingGoal(true)} size="sm">
          <Plus className="w-4 h-4" /> Add goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active goals', value: active.length },
          { label: 'Completed', value: completed.length },
          { label: 'Sessions logged', value: logs.length },
        ].map(s => (
          <Card key={s.label} className="text-center py-3 px-2">
            <p className="text-2xl font-bold text-[#5B9BD5]">{s.value}</p>
            <p className="text-xs text-charcoal-400 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {addingGoal && (
        <Card className="border border-[#5B9BD5]/20">
          <h3 className="font-semibold text-charcoal-700 mb-4">New training goal</h3>
          <div className="grid grid-cols-1 gap-3">
            <Input label="Goal" placeholder="e.g. Sit on command" value={goalForm.title} onChange={e => setGoalForm(p => ({ ...p, title: e.target.value }))} autoFocus />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-charcoal-700">Category</label>
                <select value={goalForm.category} onChange={e => setGoalForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Input label="Target date" type="date" value={goalForm.target_date} onChange={e => setGoalForm(p => ({ ...p, target_date: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal-700">Notes</label>
              <textarea value={goalForm.notes} onChange={e => setGoalForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Training tips, resources..."
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary" onClick={() => setAddingGoal(false)}>Cancel</Button>
            <Button onClick={addGoal} loading={saving}>Save goal</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="py-12 text-center text-charcoal-400 text-sm">Loading...</div>
      ) : goals.length === 0 ? (
        <Card className="text-center py-12">
          <Dumbbell className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
          <h3 className="font-semibold text-charcoal-700 mb-1">No training goals yet</h3>
          <p className="text-sm text-charcoal-400 mb-4">Track commands, tricks, and behavioral training</p>
          <Button onClick={() => setAddingGoal(true)}><Plus className="w-4 h-4" /> Add first goal</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {active.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-2 px-1">Active Goals</h3>
              <div className="flex flex-col gap-3">
                {active.map(goal => (
                  <Card key={goal.id}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleComplete(goal.id, goal.completed)}
                        className="w-5 h-5 rounded-md border-2 border-charcoal-200 bg-white flex items-center justify-center flex-shrink-0 mt-0.5 hover:border-[#5B9BD5] transition-colors">
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-charcoal-700 text-sm">{goal.title}</p>
                          <Badge variant="blue">{goal.category}</Badge>
                        </div>
                        {goal.target_date && (
                          <p className="text-xs text-charcoal-400 mt-0.5">Target: {format(new Date(goal.target_date), 'MMM d, yyyy')}</p>
                        )}
                        {goal.notes && <p className="text-xs text-charcoal-400 mt-1">{goal.notes}</p>}
                        {/* Sessions for this goal */}
                        <div className="mt-2 flex items-center gap-3">
                          <span className="text-xs text-charcoal-400">
                            {logs.filter(l => l.goal_id === goal.id).length} sessions
                          </span>
                          {loggingId === goal.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input type="number" placeholder="mins" value={logForm.duration_minutes} onChange={e => setLogForm(p => ({ ...p, duration_minutes: e.target.value }))}
                                className="w-16 px-2 py-1 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30" />
                              <input type="text" placeholder="Notes" value={logForm.notes} onChange={e => setLogForm(p => ({ ...p, notes: e.target.value }))}
                                className="flex-1 px-2 py-1 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30" />
                              <Button size="sm" onClick={() => logSession(goal.id)} loading={saving}>Log</Button>
                              <Button size="sm" variant="ghost" onClick={() => setLoggingId(null)}>×</Button>
                            </div>
                          ) : (
                            <button onClick={() => setLoggingId(goal.id)}
                              className="text-xs text-[#5B9BD5] font-medium hover:underline">+ Log session</button>
                          )}
                        </div>
                      </div>
                      <button onClick={() => deleteGoal(goal.id)} className="p-1.5 rounded-lg text-charcoal-300 hover:text-[#E8705A] hover:bg-[#FFF0ED] transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {completed.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-2 px-1">Completed</h3>
              <div className="flex flex-col gap-2">
                {completed.map(goal => (
                  <Card key={goal.id} className="opacity-60 flex items-center gap-3 p-3.5">
                    <div className="w-5 h-5 rounded-md bg-[#2D8A5A] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white stroke-[3]" />
                    </div>
                    <p className="text-sm font-medium text-charcoal-600 line-through flex-1">{goal.title}</p>
                    <Badge variant="green">{goal.category}</Badge>
                    <button onClick={() => toggleComplete(goal.id, goal.completed)} className="text-xs text-charcoal-400 hover:underline">Undo</button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
