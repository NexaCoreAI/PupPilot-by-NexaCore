'use client'

import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/today':        'Today',
  '/checklist':    'Checklist',
  '/reminders':    'Reminders',
  '/records':      'Records',
  '/sitter-guide': 'Sitter Guide',
  '/training':     'Training',
  '/settings':     'Settings',
  '/dogs':         'My Dogs',
  '/dogs/new':     'Add Dog',
}

export default function Header() {
  const pathname = usePathname()
  const title = Object.entries(titles).find(([key]) => pathname === key || pathname.startsWith(key + '/'))?.[1] ?? 'PupPilot'
  return (
    <header className="h-14 flex items-center px-5 border-b border-charcoal-100 bg-white md:hidden">
      <h1 className="text-base font-semibold text-charcoal-700">{title}</h1>
    </header>
  )
}
