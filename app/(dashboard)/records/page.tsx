'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, FileText, ExternalLink, Trash2, Plus } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface Document {
  id: string
  name: string
  file_path: string
  file_type: string
  category: string
  notes: string | null
  created_at: string
}

const CATEGORIES = ['Vaccination','Health Record','Lab Results','Insurance','License','Prescription','Grooming','Other']

export default function RecordsPage() {
  const supabase = createClient()
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('Health Record')
  const [userId, setUserId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { loadDocs() }, [])

  async function loadDocs() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUserId(session.user.id)
    const { data } = await supabase.from('documents').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    setDocs(data ?? [])
    setLoading(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, PNG, or Word documents are allowed.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10 MB.')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('documents').upload(path, file)
    if (uploadError) { alert('Upload failed: ' + uploadError.message); setUploading(false); return }

    const { data, error } = await supabase.from('documents').insert({
      user_id: userId,
      name: file.name,
      file_path: path,
      file_type: file.type,
      category,
    }).select().single()

    if (!error && data) setDocs(prev => [data, ...prev])
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
  }

  async function openDoc(path: string) {
    const { data, error } = await supabase.storage.from('documents').createSignedUrl(path, 3600)
    if (error || !data?.signedUrl) { alert('Could not open file.'); return }
    window.open(data.signedUrl, '_blank')
  }

  async function deleteDoc(id: string, path: string) {
    await supabase.storage.from('documents').remove([path])
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
        <div>
          <h1 className="text-2xl font-bold text-forest">Records</h1>
          <p className="text-sm text-taupe mt-0.5">Keep important records in one place</p>
        </div>
      </div>

      <Card className="border-2 border-dashed border-sand hover:border-sage transition-colors">
        <div className="flex flex-col items-center text-center gap-3 py-2">
          <div className="w-12 h-12 rounded-xl bg-sage/10 flex items-center justify-center">
            <Upload className="w-5 h-5 text-sage" />
          </div>
          <div>
            <p className="font-semibold text-forest">Upload a document</p>
            <p className="text-sm text-taupe">PDF, JPG, PNG · max 10 MB</p>
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-sand bg-white text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={handleUpload} />
          <Button onClick={() => fileRef.current?.click()} loading={uploading} size="sm">
            <Plus className="w-4 h-4" /> Choose file
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="py-12 text-center text-taupe text-sm">Loading...</div>
      ) : docs.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-10 h-10 text-sand mx-auto mb-3" />
          <h3 className="font-bold text-forest text-lg mb-1">No records yet</h3>
          <p className="text-base text-taupe max-w-xs mx-auto">Upload vaccine records, vet invoices, insurance documents, and care notes so they're easy to find when you need them.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-taupe uppercase tracking-wider mb-2 px-1">{cat}</h3>
              <div className="flex flex-col gap-2">
                {items.map(doc => (
                  <Card key={doc.id} className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-sage" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-forest truncate">{doc.name}</p>
                      <p className="text-sm text-taupe">{format(new Date(doc.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <button onClick={() => openDoc(doc.file_path)}
                      className="p-2 rounded-lg text-taupe hover:text-sage hover:bg-sage/10 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteDoc(doc.id, doc.file_path)}
                      className="p-2 rounded-lg text-taupe hover:text-coral hover:bg-coral/10 transition-colors">
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
