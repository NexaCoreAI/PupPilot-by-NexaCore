'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Bell, ListChecks, FileText, BookOpen, Check, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Dog { id: string; name: string; breed: string | null; age_years: number | null; weight_lbs: number | null }
interface Routine { id: string; title: string; category: string; time_of_day: string | null }
interface Reminder { id: string; title: string; category: string; remind_at: string | null; frequency: string | null }

const categoryColor: Record<string, string> = {
  feeding:    'bg-amber/20 text-amber',
  walk:       'bg-success/15 text-success',
  medication: 'bg-coral/15 text-coral',
  grooming:   'bg-sky/20 text-sky',
  default:    'bg-sand text-taupe',
}

export default function TodayPage() {
  const router = useRouter()
  const supabase = createClient()
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const [loading, setLoading] = useState(true)
  const [dog, setDog] = useState<Dog | null>(null)
  const [routines, setRoutines] = useState<Routine[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [toggling, setToggling] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const uid = session.user.id
      setUserId(uid)
      setUserName(session.user.user_metadata?.full_name?.split(' ')[0] ?? '')

      const [{ data: dogs }, { data: rts }, { data: logs }, { data: rems }] = await Promise.all([
        supabase.from('dogs').select('*').eq('owner_id', uid).order('created_at').limit(1),
        supabase.from('routines').select('*').eq('user_id', uid).eq('active', true),
        supabase.from('routine_logs').select('*').eq('user_id', uid).eq('log_date', todayStr),
        supabase.from('reminders').select('*').eq('user_id', uid).eq('active', true).order('remind_at').limit(3),
      ])

      setDog(dogs?.[0] ?? null)
      setRoutines(rts ?? [])
      setReminders(rems ?? [])
      setCompleted(new Set(logs?.map((l: { routine_id: string }) => l.routine_id) ?? []))
      setLoading(false)
    }
    load()
  }, [])

  async function toggleRoutine(routineId: string) {
    if (!userId || toggling) return
    setToggling(routineId)
    if (completed.has(routineId)) {
      await supabase.from('routine_logs').delete().eq('routine_id', routineId).eq('user_id', userId).eq('log_date', todayStr)
      setCompleted(prev => { const s = new Set(prev); s.delete(routineId); return s })
    } else {
      await supabase.from('routine_logs').insert({ routine_id: routineId, user_id: userId, log_date: todayStr })
      setCompleted(prev => new Set(Array.from(prev).concat(routineId)))
    }
    setToggling(null)
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() - 6 + i)
    return { label: format(d, 'EEE'), isToday: format(d, 'yyyy-MM-dd') === todayStr }
  })

  const quickActions = [
    { href: '/reminders',    label: 'Add Reminder',       icon: Bell,      color: 'bg-sky/20 text-sky' },
    { href: '/records',      label: 'Upload Record',      icon: FileText,  color: 'bg-sand text-taupe' },
    { href: '/sitter-guide', label: 'Create Sitter Guide',icon: BookOpen,  color: 'bg-coral/15 text-coral' },
    { href: '/checklist',    label: 'Manage Routines',    icon: ListChecks,color: 'bg-sage/15 text-forest' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-sage border-t-transparent animate-spin" />
          <p className="text-base text-taupe">Loading...</p>
        </div>
      </div>
    )
  }

  const completedCount = completed.size
  const totalCount = routines.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <p className="text-sm text-taupe font-medium">{format(today, 'EEEE, MMMM d')}</p>
          <h1 className="text-2xl font-bold text-forest mt-1">
            {greeting}{userName ? `, ${userName}` : ''}.
          </h1>
          <p className="text-base text-taupe mt-0.5">
            {dog ? `Here's what ${dog.name} needs today.` : 'Add your first pet to get started.'}
          </p>
        </div>
        <Link href="/dogs/new" className="flex items-center gap-1.5 text-sm text-sage font-semibold hover:bg-sage/10 px-3 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add pet
        </Link>
      </div>

      {/* Pet card */}
      {dog ? (
        <Card className="flex items-center gap-4 p-5">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-sage to-forest flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
            🐾
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-forest text-xl">{dog.name}</h2>
              {dog.breed && <Badge variant="sage">{dog.breed}</Badge>}
            </div>
            <p className="text-sm text-taupe mt-0.5">
              {[dog.age_years && `${dog.age_years} yrs`, dog.weight_lbs && `${dog.weight_lbs} lbs`].filter(Boolean).join(' · ')}
            </p>
          </div>
          <Link href="/dogs" className="text-sand hover:text-taupe transition-colors">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </Card>
      ) : (
        <Card className="text-center py-10">
          <div className="text-5xl mb-4">🐾</div>
          <h3 className="font-bold text-forest text-lg mb-2">Add your first pet</h3>
          <p className="text-base text-taupe mb-5 max-w-xs mx-auto">Start by creating a profile so Four Leg Life can help organize routines, reminders, records, and care notes.</p>
          <Link href="/dogs/new" className="inline-flex items-center gap-2 bg-sage hover:bg-forest text-white px-6 py-3 rounded-lg text-base font-semibold transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Pet
          </Link>
        </Card>
      )}

      {/* Today's Care */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-forest text-lg">Today's Care</h3>
          <span className="text-sm font-medium text-taupe">{completedCount}/{totalCount} done</span>
        </div>
        <p className="text-sm text-taupe mb-3">{pct === 100 ? '🎉 All done for today!' : pct > 0 ? `${pct}% complete — keep it up!` : 'Tap any task to mark it done.'}</p>
        <div className="h-2 bg-sand rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-sage rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {routines.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {routines.slice(0, 6).map(r => {
              const done = completed.has(r.id)
              const colorClass = categoryColor[r.category?.toLowerCase()] ?? categoryColor.default
              return (
                <li key={r.id} onClick={() => toggleRoutine(r.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-lg cursor-pointer select-none transition-all ${done ? 'bg-success/10' : 'bg-cream hover:bg-sand/50'}`}>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-success' : 'border-2 border-sand bg-white'}`}>
                    {done && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  <span className={`text-base flex-1 font-medium ${done ? 'line-through text-taupe' : 'text-charcoal'}`}>{r.title}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colorClass}`}>{r.category || 'General'}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="text-center py-5">
            <p className="text-base text-taupe mb-3">No routines set up yet</p>
            <Link href="/checklist" className="text-base text-sage font-semibold hover:underline">Set up daily routines →</Link>
          </div>
        )}
      </Card>

      {/* Reminders */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-forest text-lg">Upcoming Reminders</h3>
          <Link href="/reminders" className="text-sm text-sage font-semibold hover:underline">View all</Link>
        </div>
        {reminders.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {reminders.map(r => (
              <li key={r.id} className="flex items-center gap-3 p-3.5 rounded-lg bg-sky/10 border border-sky/20">
                <Bell className="w-4 h-4 text-sky flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-charcoal truncate">{r.title}</p>
                  <p className="text-sm text-taupe">{r.remind_at ? format(new Date(r.remind_at), 'MMM d · h:mm a') : r.frequency}</p>
                </div>
                <Badge variant="sky">{r.category || 'General'}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-5">
            <p className="text-base text-taupe mb-2">Nothing coming up yet</p>
            <p className="text-sm text-taupe mb-3">Add vaccine dates, medication schedules, or grooming appointments.</p>
            <Link href="/reminders" className="text-base text-sage font-semibold hover:underline">Add Reminder →</Link>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-forest text-lg mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <Card hover className="flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-forest leading-tight">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Weekly Snapshot */}
      <Card className="bg-gradient-to-br from-sage/10 to-cream border-sage/20">
        <h3 className="font-bold text-forest text-lg mb-0.5">Weekly Snapshot</h3>
        <p className="text-sm text-taupe mb-4">{dog?.name ? `${dog.name}'s week at a glance` : 'Last 7 days'}</p>
        <div className="flex items-end justify-between gap-1.5">
          {weekDays.map(({ label, isToday }) => (
            <div key={label} className="flex flex-col items-center gap-2 flex-1">
              <div className={`w-full rounded-lg transition-all ${isToday ? 'h-10 bg-sage' : 'h-6 bg-sage/25'}`} />
              <span className={`text-xs font-medium ${isToday ? 'text-forest' : 'text-taupe'}`}>{label}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
