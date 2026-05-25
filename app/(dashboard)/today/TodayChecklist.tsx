'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Routine {
  id: string
  title: string
  category: string
  time_of_day: string | null
}

interface Props {
  routines: Routine[]
  completedIds: Set<string>
  userId: string
  todayStr: string
}

const categoryColors: Record<string, string> = {
  feeding:    'bg-[#FFF9E6] text-[#B8860B]',
  walk:       'bg-[#EDFFF5] text-[#2D8A5A]',
  medication: 'bg-[#FFF0ED] text-[#D45A44]',
  grooming:   'bg-[#F3EEFF] text-[#6B4DB5]',
  default:    'bg-charcoal-100 text-charcoal-500',
}

export default function TodayChecklist({ routines, completedIds, userId, todayStr }: Props) {
  const supabase = createClient()
  const [completed, setCompleted] = useState<Set<string>>(completedIds)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggle(routineId: string) {
    if (loading) return
    setLoading(routineId)

    if (completed.has(routineId)) {
      await supabase
        .from('routine_logs')
        .delete()
        .eq('routine_id', routineId)
        .eq('user_id', userId)
        .eq('log_date', todayStr)
      setCompleted(prev => { const s = new Set(prev); s.delete(routineId); return s })
    } else {
      await supabase.from('routine_logs').insert({ routine_id: routineId, user_id: userId, log_date: todayStr })
      setCompleted(prev => new Set([...prev, routineId]))
    }

    setLoading(null)
  }

  return (
    <ul className="flex flex-col gap-2">
      {routines.slice(0, 5).map(r => {
        const done = completed.has(r.id)
        const colorClass = categoryColors[r.category?.toLowerCase()] ?? categoryColors.default
        return (
          <li
            key={r.id}
            onClick={() => toggle(r.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all select-none ${done ? 'bg-[#EDFFF5]' : 'bg-cream-100 hover:bg-cream-200'}`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${done ? 'bg-[#2D8A5A]' : 'border-2 border-charcoal-200 bg-white'}`}>
              {done && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </div>
            <span className={`text-sm font-medium flex-1 ${done ? 'line-through text-charcoal-400' : 'text-charcoal-700'}`}>
              {r.title}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
              {r.category || 'General'}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
