'use client'

import { useState } from 'react'
import { adminDeleteCharityAction, adminUpsertCharityAction } from '@/app/admin/actions'

interface Charity {
  id: string
  name: string
  description: string
  raised: number
  image_url?: string | null
}

const emptyForm = { name: '', description: '', image_url: '' }

export default function CharityAdmin({ initialCharities = [] }: { initialCharities?: Charity[] }) {
  const [charities, setCharities] = useState<Charity[]>(initialCharities)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!formData.name || !formData.description) return

    setError(null)

    const res = await adminUpsertCharityAction({
      id: editingId || undefined,
      name: formData.name,
      description: formData.description,
      image_url: formData.image_url || null,
    })

    if (!res.ok) {
      setError(res.error)
      return
    }

    const saved: Charity = {
      id: res.data.id,
      name: res.data.name,
      description: res.data.description,
      raised: Number(res.data.total_raised || 0),
      image_url: res.data.image_url,
    }

    if (editingId) {
      setCharities((prev) => prev.map((c) => (c.id === editingId ? saved : c)))
      setEditingId(null)
    } else {
      setCharities((prev) => [saved, ...prev])
    }

    setFormData(emptyForm)
    setShowForm(false)
  }

  const handleEdit = (charity: Charity) => {
    setFormData({
      name: charity.name,
      description: charity.description,
      image_url: charity.image_url || '',
    })
    setEditingId(charity.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    setError(null)
    const res = await adminDeleteCharityAction(id)
    if (!res.ok) {
      setError(res.error)
      return
    }
    setCharities((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-[#E5E7EB]">Charities</h2>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setFormData(emptyForm)
            setEditingId(null)
          }}
          className="w-full px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0A0A0F] font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-all sm:w-auto"
        >
          + Add Charity
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-4 border border-[#D4AF37]/50 sm:p-6">
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[#A0A0A8] text-sm mb-2">Charity Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter charity name"
                className="w-full bg-[#1A1033]/60 border border-[#00D1FF]/30 rounded-lg px-4 py-2 text-[#E5E7EB] placeholder-[#A0A0A8] focus:border-[#00D1FF] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[#A0A0A8] text-sm mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
                className="w-full bg-[#1A1033]/60 border border-[#00D1FF]/30 rounded-lg px-4 py-2 text-[#E5E7EB] placeholder-[#A0A0A8] focus:border-[#00D1FF] focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[#A0A0A8] text-sm mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/charity-image.jpg"
                className="w-full bg-[#1A1033]/60 border border-[#00D1FF]/30 rounded-lg px-4 py-2 text-[#E5E7EB] placeholder-[#A0A0A8] focus:border-[#00D1FF] focus:outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={handleAdd}
                className="flex-1 px-4 py-2 rounded-lg bg-[#00D1FF] text-[#0A0A0F] font-bold hover:shadow-[0_0_20px_rgba(0,209,255,0.6)] transition-all"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-[#A0A0A8] text-[#A0A0A8] hover:text-[#E5E7EB] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map((charity) => (
          <div
            key={charity.id}
            className="glass overflow-hidden rounded-2xl border border-[#00D1FF]/30 hover:border-[#D4AF37]/50 transition-all group"
          >
            {charity.image_url && (
              <img
                src={charity.image_url}
                alt=""
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-bold text-[#E5E7EB] mb-2">{charity.name}</h3>
              <p className="text-[#A0A0A8] text-sm mb-4">{charity.description}</p>
              <p className="text-[#D4AF37] font-bold mb-4">Rs. {charity.raised.toLocaleString()}</p>
              <div className="flex gap-2 opacity-100 transition-all md:opacity-0 md:group-hover:opacity-100">
                <button
                  onClick={() => handleEdit(charity)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#00D1FF]/20 text-[#00D1FF] text-sm font-semibold hover:bg-[#00D1FF]/30 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(charity.id)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#FF4444]/20 text-[#FF4444] text-sm font-semibold hover:bg-[#FF4444]/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
