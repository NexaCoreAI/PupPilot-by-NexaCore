'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, PawPrint, ListChecks, Bell, FileText,
  BookOpen, Dumbbell, Settings, LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { href: '/today',        label: 'Today',       icon: LayoutDashboard },
  { href: '/dogs',         label: 'Pets',         icon: PawPrint },
  { href: '/checklist',    label: 'Routines',     icon: ListChecks },
  { href: '/reminders',    label: 'Reminders',    icon: Bell },
  { href: '/records',      label: 'Records',      icon: FileText },
  { href: '/sitter-guide', label: 'Sitter Guide', icon: BookOpen },
  { href: '/training',     label: 'Training',     icon: Dumbbell },
  { href: '/settings',     label: 'Settings',     icon: Settings },
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
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-sand py-7 px-5 fixed top-0 left-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 rounded-lg bg-sage flex items-center justify-center shadow-sm">
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-forest text-lg leading-tight block">Four Leg Life</span>
          <span className="text-xs text-taupe leading-none">Your pet's life, organized.</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-sage/10 text-forest'
                  : 'text-taupe hover:bg-cream hover:text-charcoal'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-sage' : ''}`} />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={signOut}
        className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-taupe hover:bg-cream hover:text-charcoal transition-all mt-2"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </aside>
  )
}
