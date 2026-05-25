'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

const breeds = [
  'Labrador Retriever','Golden Retriever','German Shepherd','French Bulldog','Bulldog',
  'Poodle','Beagle','Rottweiler','German Shorthaired Pointer','Dachshund','Pembroke Welsh Corgi',
  'Australian Shepherd','Yorkshire Terrier','Boxer','Cavalier King Charles Spaniel',
  'Doberman Pinscher','Shih Tzu','Siberian Husky','Great Dane','Miniature Schnauzer',
  'Mixed / Other',
]

export default function NewDogPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', breed: '', age_years: '', weight_lbs: '', sex: '', notes: '',
    vet_name: '', vet_phone: '', microchip: '',
  })

  function update(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('dogs').insert({
      owner_id: user.id,
      name: form.name,
      breed: form.breed || null,
      age_years: form.age_years ? parseFloat(form.age_years) : null,
      weight_lbs: form.weight_lbs ? parseFloat(form.weight_lbs) : null,
      sex: form.sex || null,
      notes: form.notes || null,
      vet_name: form.vet_name || null,
      vet_phone: form.vet_phone || null,
      microchip: form.microchip || null,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/today')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dogs" className="p-2 rounded-xl hover:bg-charcoal-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-charcoal-500" />
        </Link>
        <h1 className="text-2xl font-semibold text-charcoal-700">Add Dog</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <h2 className="font-semibold text-charcoal-700 mb-4">Basic Info</h2>
          <div className="grid grid-cols-1 gap-4">
            <Input label="Dog's name *" placeholder="Buddy" value={form.name} onChange={e => update('name', e.target.value)} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal-700">Breed</label>
              <select
                value={form.breed}
                onChange={e => update('breed', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5]"
              >
                <option value="">Select breed</option>
                {breeds.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Age (years)" type="number" placeholder="3" min="0" max="30" step="0.5" value={form.age_years} onChange={e => update('age_years', e.target.value)} />
              <Input label="Weight (lbs)" type="number" placeholder="45" min="0" step="0.5" value={form.weight_lbs} onChange={e => update('weight_lbs', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal-700">Sex</label>
              <div className="flex gap-2">
                {['Male','Female'].map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => update('sex', form.sex === s ? '' : s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.sex === s ? 'bg-[#5B9BD5] text-white border-[#5B9BD5]' : 'bg-white text-charcoal-600 border-charcoal-200 hover:border-[#5B9BD5]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-charcoal-700">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => update('notes', e.target.value)}
                placeholder="Any special info, allergies, or personality notes..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 placeholder-charcoal-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30 focus:border-[#5B9BD5] resize-none"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-charcoal-700 mb-4">Vet Info</h2>
          <div className="grid grid-cols-1 gap-4">
            <Input label="Vet name / clinic" placeholder="Paws & Claws Animal Hospital" value={form.vet_name} onChange={e => update('vet_name', e.target.value)} />
            <Input label="Vet phone" type="tel" placeholder="(555) 123-4567" value={form.vet_phone} onChange={e => update('vet_phone', e.target.value)} />
            <Input label="Microchip ID" placeholder="985121234567890" value={form.microchip} onChange={e => update('microchip', e.target.value)} />
          </div>
        </Card>

        {error && <p className="text-sm text-[#E8705A] bg-[#FFF0ED] rounded-xl px-4 py-3">{error}</p>}

        <div className="flex gap-3 pb-4">
          <Link href="/dogs" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">Cancel</Button>
          </Link>
          <Button type="submit" size="lg" loading={loading} className="flex-1">Save dog</Button>
        </div>
      </form>
    </div>
  )
}
