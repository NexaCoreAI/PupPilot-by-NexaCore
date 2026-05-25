'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, CheckSquare, Bell, FileText, BookOpen,
  Dumbbell, Settings, LogOut, Sparkles, Heart,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/today',        label: 'Today',         icon: LayoutDashboard },
  { href: '/checklist',   label: 'Checklist',     icon: CheckSquare },
  { href: '/reminders',   label: 'Reminders',     icon: Bell },
  { href: '/records',     label: 'Records',       icon: FileText },
  { href: '/sitter-guide',label: 'Sitter Guide',  icon: Sparkles },
  { href: '/training',    label: 'Training',      icon: Dumbbell },
  { href: '/settings',    label: 'Settings',      icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r border-charcoal-100 py-6 px-4 fixed top-0 left-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-xl bg-[#5B9BD5] flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-charcoal-700 text-lg tracking-tight">PupPilot</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#EBF5FF] text-[#3D7FBF]'
                  : 'text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-700'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={signOut}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-charcoal-400 hover:bg-cream-100 hover:text-charcoal-600 transition-all mt-4"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </aside>
  )
}
