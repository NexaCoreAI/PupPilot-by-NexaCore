export const dynamic = 'force-dynamic'

import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-5 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
