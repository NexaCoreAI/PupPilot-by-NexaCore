'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, Download, Trash2, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Document {
  id: string
  name: string
  file_url: string
  file_type: string
  category: string
  notes: string | null
  created_at: string
}

const CATEGORIES = ['Vaccination','Health Record','Lab Results','Insurance','License','Prescription','Other']

export default function RecordsPage() {
  const supabase = createClient()
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('Health Record')
  const [notes, setNotes] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadDocs() }, [])

  async function loadDocs() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setDocs(data ?? [])
    setLoading(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
    if (uploadError) { setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path)

    const { data, error } = await supabase.from('documents').insert({
      user_id: user.id,
      name: file.name,
      file_url: publicUrl,
      file_type: file.type,
      category,
      notes: notes || null,
    }).select().single()

    if (!error && data) {
      setDocs(prev => [data, ...prev])
      setNotes('')
    }
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
  }

  async function deleteDoc(id: string) {
    await supabase.from('documents').delete().eq('id', id)
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = docs.filter(d => d.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {} as Record<string, Document[]>)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-charcoal-700">Records</h1>
      </div>

      {/* Upload card */}
      <Card className="border-2 border-dashed border-charcoal-200 hover:border-[#5B9BD5] transition-colors">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF5FF] flex items-center justify-center">
            <Upload className="w-5 h-5 text-[#5B9BD5]" />
          </div>
          <div>
            <p className="font-medium text-charcoal-700">Upload a document</p>
            <p className="text-sm text-charcoal-400">PDF, JPG, PNG · up to 10 MB</p>
          </div>
          <div className="flex gap-2 w-full max-w-xs">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-charcoal-200 bg-white text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/30"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={handleUpload} />
          <Button onClick={() => fileRef.current?.click()} loading={uploading} size="sm">
            <Plus className="w-4 h-4" /> Choose file
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="py-12 text-center text-charcoal-400 text-sm">Loading...</div>
      ) : docs.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-10 h-10 text-charcoal-200 mx-auto mb-3" />
          <h3 className="font-semibold text-charcoal-700 mb-1">No documents yet</h3>
          <p className="text-sm text-charcoal-400">Upload vet records, vaccination certificates, and more</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-charcoal-400 uppercase tracking-wider mb-2 px-1">{cat}</h3>
              <div className="flex flex-col gap-2">
                {items.map(doc => (
                  <Card key={doc.id} className="flex items-center gap-3 p-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#EBF5FF] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-[#5B9BD5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal-700 truncate">{doc.name}</p>
                      <p className="text-xs text-charcoal-400">{format(new Date(doc.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-charcoal-300 hover:text-[#5B9BD5] hover:bg-[#EBF5FF] transition-colors">
                      <Download className="w-4 h-4" />
                    </a>
                    <button onClick={() => deleteDoc(doc.id)}
                      className="p-1.5 rounded-lg text-charcoal-300 hover:text-[#E8705A] hover:bg-[#FFF0ED] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
