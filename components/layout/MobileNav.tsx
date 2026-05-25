'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, Bell, Dumbbell, Settings } from 'lucide-react'

const nav = [
  { href: '/today',      label: 'Today',    icon: LayoutDashboard },
  { href: '/checklist', label: 'Tasks',    icon: CheckSquare },
  { href: '/reminders', label: 'Reminders',icon: Bell },
  { href: '/training',  label: 'Training', icon: Dumbbell },
  { href: '/settings',  label: 'Settings', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-charcoal-100 z-10 flex">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              active ? 'text-[#5B9BD5]' : 'text-charcoal-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
