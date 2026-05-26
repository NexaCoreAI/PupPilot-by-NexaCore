'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, ChevronRight, Bell, CheckSquare, FileText, Sparkles, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Dog { id: string; name: string; breed: string | null; age_years: number | null; weight_lbs: number | null }
interface Routine { id: string; title: string; category: string; time_of_day: string | null }
interface Reminder { id: string; title: string; category: string; remind_at: string | null; frequency: string | null }

const categoryColors: Record<string, string> = {
  feeding: 'bg-[#FFF9E6] text-[#B8860B]',
  walk: 'bg-[#EDFFF5] text-[#2D8A5A]',
  medication: 'bg-[#FFF0ED] text-[#D45A44]',
  grooming: 'bg-[#F3EEFF] text-[#6B4DB5]',
  default: 'bg-charcoal-100 text-charcoal-500',
}

export default function TodayPage() {
  const router = useRouter()
  const supabase = createClient()
  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  const [loading, setLoading] = useState(true)
  const [dog, setDog] = useState<Dog | null>(null)
  const [routines, setRoutines] = useState<Routine[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [toggling, setToggling] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      const uid = session.user.id
      setUserId(uid)

      const [{ data: dogs }, { data: rts }, { data: logs }, { data: rems }] = await Promise.all([
        supabase.from('dogs').select('*').eq('owner_id', uid).order('created_at').limit(1),
        supabase.from('routines').select('*').eq('user_id', uid).eq('active', true),
        supabase.from('routine_logs').select('*').eq('user_id', uid).eq('log_date', todayStr),
        supabase.from('reminders').select('*').eq('user_id', uid).eq('active', true).order('remind_at').limit(3),
      ])

      setDog(dogs?.[0] ?? null)
      setRoutines(rts ?? [])
      setReminders(rems ?? [])
      setCompleted(new Set(logs?.map(l => l.routine_id) ?? []))
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
    return { label: format(d, 'EEE'), date: format(d, 'd'), isToday: format(d, 'yyyy-MM-dd') === todayStr }
  })

  const quickActions = [
    { href: '/checklist',    label: 'Checklist',    icon: CheckSquare, color: 'bg-[#EBF5FF] text-[#5B9BD5]' },
    { href: '/reminders',    label: 'Reminders',    icon: Bell,        color: 'bg-[#FFF0ED] text-[#E8705A]' },
    { href: '/records',      label: 'Records',      icon: FileText,    color: 'bg-[#EDFFF5] text-[#2D8A5A]' },
    { href: '/sitter-guide', label: 'Sitter Guide', icon: Sparkles,    color: 'bg-[#FFF9E6] text-[#B8860B]' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#5B9BD5] border-t-transparent animate-spin" />
          <p className="text-sm text-charcoal-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal-400 font-medium">{format(today, 'EEEE, MMMM d')}</p>
          <h1 className="text-2xl font-semibold text-charcoal-700 mt-0.5">
            {greeting}{dog ? `, ${dog.name}'s parent` : ''}
          </h1>
        </div>
        <Link href="/dogs/new" className="flex items-center gap-1.5 text-sm text-[#5B9BD5] font-medium hover:bg-[#EBF5FF] px-3 py-2 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add dog
        </Link>
      </div>

      {/* Dog card */}
      {dog ? (
        <Card className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B9BD5] to-[#3D7FBF] flex items-center justify-center text-2xl shadow-sm flex-shrink-0">🐶</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-charcoal-700 text-lg">{dog.name}</h2>
              {dog.breed && <Badge variant="blue">{dog.breed}</Badge>}
            </div>
            <p className="text-sm text-charcoal-400 mt-0.5">
              {[dog.age_years && `${dog.age_years} yrs`, dog.weight_lbs && `${dog.weight_lbs} lbs`].filter(Boolean).join(' · ')}
            </p>
          </div>
          <Link href="/dogs" className="text-charcoal-300 hover:text-charcoal-500"><ChevronRight className="w-5 h-5" /></Link>
        </Card>
      ) : (
        <Card className="text-center py-8">
          <p className="text-4xl mb-3">🐾</p>
          <h3 className="font-semibold text-charcoal-700 mb-1">Add your first dog</h3>
          <p className="text-sm text-charcoal-400 mb-4">Set up a profile to start tracking daily care</p>
          <Link href="/dogs/new" className="inline-flex items-center gap-2 bg-[#5B9BD5] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#3D7FBF] transition-colors">
            <Plus className="w-4 h-4" /> Add dog
          </Link>
        </Card>
      )}

      {/* Today's progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-charcoal-700">Today's Care</h3>
          <span className="text-sm text-charcoal-400">{completed.size}/{routines.length} done</span>
        </div>
        <div className="h-2 bg-charcoal-100 rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-[#5B9BD5] rounded-full transition-all duration-500"
            style={{ width: routines.length > 0 ? `${Math.round((completed.size / routines.length) * 100)}%` : '0%' }} />
        </div>
        {routines.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {routines.slice(0, 5).map(r => {
              const done = completed.has(r.id)
              const colorClass = categoryColors[r.category?.toLowerCase()] ?? categoryColors.default
              return (
                <li key={r.id} onClick={() => toggleRoutine(r.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all select-none ${done ? 'bg-[#EDFFF5]' : 'bg-cream-100 hover:bg-cream-200'}`}>
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-[#2D8A5A]' : 'border-2 border-charcoal-200 bg-white'}`}>
                    {done && <Check className="w-3 h-3 text-white stroke-[3]" />}
                  </div>
                  <span className={`text-sm font-medium flex-1 ${done ? 'line-through text-charcoal-400' : 'text-charcoal-700'}`}>{r.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>{r.category || 'General'}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-charcoal-400 mb-3">No routines set up yet</p>
            <Link href="/checklist" className="text-sm text-[#5B9BD5] font-medium hover:underline">Set up daily checklist →</Link>
          </div>
        )}
      </Card>

      {/* Reminders */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-charcoal-700">Upcoming Reminders</h3>
          <Link href="/reminders" className="text-sm text-[#5B9BD5] font-medium hover:underline">View all</Link>
        </div>
        {reminders.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {reminders.map(r => (
              <li key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-cream-100">
                <Bell className="w-4 h-4 text-[#E8705A] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-700 truncate">{r.title}</p>
                  <p className="text-xs text-charcoal-400">{r.remind_at ? format(new Date(r.remind_at), 'MMM d · h:mm a') : r.frequency}</p>
                </div>
                <Badge variant="coral">{r.category || 'General'}</Badge>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-charcoal-400 mb-2">No reminders yet</p>
            <Link href="/reminders" className="text-sm text-[#5B9BD5] font-medium hover:underline">Add a reminder →</Link>
          </div>
        )}
      </Card>

      {/* Quick actions */}
      <div>
        <h3 className="font-semibold text-charcoal-700 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <Card hover className="flex items-center gap-3 p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}><Icon className="w-4 h-4" /></div>
                <span className="text-sm font-medium text-charcoal-700">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Weekly summary */}
      <Card className="bg-gradient-to-br from-[#EBF5FF] to-[#FDF8F3] border border-[#ADDAFF]/30">
        <h3 className="font-semibold text-charcoal-700 mb-1">Weekly Summary</h3>
        <p className="text-xs text-charcoal-400 mb-4">Last 7 days</p>
        <div className="flex items-end justify-between gap-1">
          {weekDays.map(({ label, date, isToday }) => (
            <div key={date} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-full rounded-lg h-8 flex items-end justify-center pb-1 ${isToday ? 'bg-[#5B9BD5]' : 'bg-[#ADDAFF]/40'}`}>
                {isToday && <span className="text-[9px] text-white font-semibold">TODAY</span>}
              </div>
              <span className="text-[10px] text-charcoal-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
