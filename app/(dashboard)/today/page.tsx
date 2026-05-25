import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
import { Plus, ChevronRight, Bell, CheckSquare, FileText, Sparkles } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import TodayChecklist from './TodayChecklist'

export default async function TodayPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date()
  const todayStr = format(today, 'yyyy-MM-dd')
  const greeting = today.getHours() < 12 ? 'Good morning' : today.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  const [{ data: dogs }, { data: routines }, { data: logs }, { data: reminders }] = await Promise.all([
    supabase.from('dogs').select('*').eq('owner_id', user.id).order('created_at'),
    supabase.from('routines').select('*').eq('user_id', user.id).eq('active', true),
    supabase.from('routine_logs').select('*').eq('user_id', user.id).eq('log_date', todayStr),
    supabase.from('reminders').select('*').eq('user_id', user.id).eq('active', true).order('remind_at').limit(3),
  ])

  const activeDog = dogs?.[0]
  const completedToday = logs?.length ?? 0
  const totalRoutines = routines?.length ?? 0
  const completedIds = new Set(logs?.map(l => l.routine_id) ?? [])

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 6 + i)
    return { label: format(d, 'EEE'), date: format(d, 'd'), isToday: format(d, 'yyyy-MM-dd') === todayStr }
  })

  const quickActions = [
    { href: '/checklist',    label: 'Checklist',    icon: CheckSquare, color: 'bg-[#EBF5FF] text-[#5B9BD5]' },
    { href: '/reminders',    label: 'Reminders',    icon: Bell,        color: 'bg-[#FFF0ED] text-[#E8705A]' },
    { href: '/records',      label: 'Records',      icon: FileText,    color: 'bg-[#EDFFF5] text-[#2D8A5A]' },
    { href: '/sitter-guide', label: 'Sitter Guide', icon: Sparkles,    color: 'bg-[#FFF9E6] text-[#B8860B]' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-charcoal-400 font-medium">{format(today, 'EEEE, MMMM d')}</p>
          <h1 className="text-2xl font-semibold text-charcoal-700 mt-0.5">
            {greeting}{activeDog ? `, ${activeDog.name}'s parent` : ''}
          </h1>
        </div>
        <Link
          href="/dogs/new"
          className="flex items-center gap-1.5 text-sm text-[#5B9BD5] font-medium hover:bg-[#EBF5FF] px-3 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add dog
        </Link>
      </div>

      {/* Dog profile card */}
      {activeDog ? (
        <Card className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B9BD5] to-[#3D7FBF] flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
            🐶
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-charcoal-700 text-lg">{activeDog.name}</h2>
              {activeDog.breed && <Badge variant="blue">{activeDog.breed}</Badge>}
            </div>
            <p className="text-sm text-charcoal-400 mt-0.5">
              {activeDog.age_years ? `${activeDog.age_years} yr${activeDog.age_years !== 1 ? 's' : ''}` : ''}
              {activeDog.age_years && activeDog.weight_lbs ? ' · ' : ''}
              {activeDog.weight_lbs ? `${activeDog.weight_lbs} lbs` : ''}
            </p>
          </div>
          <Link href="/dogs" className="text-charcoal-300 hover:text-charcoal-500">
            <ChevronRight className="w-5 h-5" />
          </Link>
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
          <span className="text-sm text-charcoal-400">{completedToday}/{totalRoutines} done</span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-charcoal-100 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-[#5B9BD5] rounded-full transition-all duration-500"
            style={{ width: totalRoutines > 0 ? `${Math.round((completedToday / totalRoutines) * 100)}%` : '0%' }}
          />
        </div>
        <TodayChecklist routines={routines ?? []} completedIds={completedIds} userId={user.id} todayStr={todayStr} />
        {totalRoutines === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-charcoal-400 mb-3">No routines set up yet</p>
            <Link href="/checklist" className="text-sm text-[#5B9BD5] font-medium hover:underline">
              Set up daily checklist →
            </Link>
          </div>
        )}
      </Card>

      {/* Upcoming reminders */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-charcoal-700">Upcoming Reminders</h3>
          <Link href="/reminders" className="text-sm text-[#5B9BD5] font-medium hover:underline">View all</Link>
        </div>
        {reminders && reminders.length > 0 ? (
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
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-charcoal-700">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Weekly summary placeholder */}
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
