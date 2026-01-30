'use client'
import { useState } from 'react'
import { addCategory, deleteCategory } from '@/app/actions'

type Category = { id: string; name: string }

export default function CategoriesManager({ initial }: { initial: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initial)
  const [name, setName] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true)
    try {
      const res = await addCategory(name.trim())
      if (res?.success && res.category) {
        setCategories((s) => [res.category, ...s])
        setName('')
      } else {
        alert(`Failed to add category: ${res?.error || 'Unknown'}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error adding category')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return
    setDeletingId(id)
    try {
      const res = await deleteCategory(id)
      if (res?.success) {
        setCategories((s) => s.filter((c) => c.id !== id))
      } else {
        alert(`Failed to delete: ${res?.error || 'Unknown'}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting category')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-navy-900 p-4 rounded border border-navy-800">
        <h2 className="text-xl font-orbitron text-white mb-3">Edit Categories</h2>

        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category name"
            className="flex-1 bg-navy-800 border border-navy-700 px-3 py-2 rounded text-white"
          />
          <button
            className="bg-chem-yellow text-navy-950 px-4 py-2 rounded disabled:opacity-50"
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add'}
          </button>
        </form>

        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center justify-between bg-navy-950/40 p-3 rounded">
              <div className="text-slate-200">{cat.name}</div>
              <div>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  disabled={deletingId === cat.id}
                >
                  {deletingId === cat.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}
