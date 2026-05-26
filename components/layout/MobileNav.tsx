'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ListChecks, FileText, BookOpen, User } from 'lucide-react'

const nav = [
  { href: '/today',        label: 'Today',   icon: LayoutDashboard },
  { href: '/checklist',    label: 'Care',    icon: ListChecks },
  { href: '/records',      label: 'Records', icon: FileText },
  { href: '/sitter-guide', label: 'Guide',   icon: BookOpen },
  { href: '/settings',     label: 'Profile', icon: User },
]

export default function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sand z-10 flex">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              active ? 'text-sage' : 'text-taupe'
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
