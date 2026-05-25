import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default async function DogsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: dogs } = await supabase.from('dogs').select('*').eq('owner_id', user.id).order('created_at')

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-charcoal-700">My Dogs</h1>
        <Link href="/dogs/new" className="flex items-center gap-1.5 bg-[#5B9BD5] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#3D7FBF] transition-colors">
          <Plus className="w-4 h-4" /> Add dog
        </Link>
      </div>

      {dogs && dogs.length > 0 ? (
        <div className="flex flex-col gap-3">
          {dogs.map(dog => (
            <Link key={dog.id} href={`/dogs/${dog.id}`}>
              <Card hover className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B9BD5] to-[#3D7FBF] flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                  🐶
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-charcoal-700">{dog.name}</h2>
                    {dog.breed && <Badge variant="blue">{dog.breed}</Badge>}
                  </div>
                  <p className="text-sm text-charcoal-400 mt-0.5">
                    {[dog.age_years && `${dog.age_years} yrs`, dog.weight_lbs && `${dog.weight_lbs} lbs`].filter(Boolean).join(' · ')}
                  </p>
                  {dog.notes && <p className="text-xs text-charcoal-400 mt-1 truncate">{dog.notes}</p>}
                </div>
                <ChevronRight className="w-5 h-5 text-charcoal-300 flex-shrink-0" />
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-5xl mb-4">🐾</p>
          <h3 className="font-semibold text-charcoal-700 text-lg mb-2">No dogs yet</h3>
          <p className="text-sm text-charcoal-400 mb-5">Add your first dog to get started</p>
          <Link href="/dogs/new" className="inline-flex items-center gap-2 bg-[#5B9BD5] text-white px-5 py-3 rounded-2xl text-sm font-medium hover:bg-[#3D7FBF] transition-colors">
            <Plus className="w-4 h-4" /> Add your dog
          </Link>
        </Card>
      )}
    </div>
  )
}
