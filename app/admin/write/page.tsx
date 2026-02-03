'use client'
import { useEffect, useState } from 'react'
import { createPost } from '@/app/actions'
import TipTap from '@/components/editor/TipTap'
import { useRouter } from 'next/navigation' // <--- Add this
import { getCategories } from '@/app/actions'

type Category = { id: string; name: string }

export default function WriteForm() {
  const [contentJson, setContentJson] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingCats, setLoadingCats] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    setLoadingCats(true)
    getCategories()
      .then((data) => {
        if (!mounted) return
        setCategories(data ?? [])
      })
      .catch((err) => {
        console.error('Failed to load categories', err)
      })
      .finally(() => {
        if (mounted) setLoadingCats(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    
    if (Object.keys(contentJson).length === 0) {
      alert("Please write some content.")
      setIsSubmitting(false)
      return
    }
    formData.append('content', JSON.stringify(contentJson))
    // No try/catch needed here anymore, as we handle the error object
    const result = await createPost(formData)
    
    if (result.success) {
      router.push(`/${result.slug}`) // <--- Client-side redirect (Safe)
    } else {
      alert(`Error: ${result.error}`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-orbitron text-white mb-8">New Experiment Log</h1>
      
      <form action={handleSubmit} className="space-y-6">
        
        {/* Row 1: Title & Category */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-slate-400 mb-2 font-inter">Title</label>
            <input 
              name="title"
              required
              className="w-full bg-navy-900 border border-navy-800 p-3 rounded text-white focus:border-chem-yellow focus:outline-none focus:ring-1 focus:ring-chem-yellow"
              placeholder="e.g. The Iodine Clock Reaction"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-2">Category</label>
            <div className="relative">
              <select 
                name="category" 
                className="w-full bg-navy-900 border border-navy-800 p-3 rounded text-white appearance-none focus:border-chem-yellow focus:outline-none cursor-pointer"
                defaultValue={""}
                required
              >
                {loadingCats ? (
                  <option value="">Loading...</option>
                ) : categories.length ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="">No categories</option>
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="space-y-2">
           <label className="block text-slate-400">Lab Protocol (Content)</label>
           <TipTap content={contentJson} onChange={setContentJson} />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-chem-yellow text-navy-950 px-8 py-3 rounded font-bold font-orbitron hover:bg-amber-300 transition w-full md:w-auto disabled:opacity-50"
        >
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </div>
  )
}