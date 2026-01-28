'use client'
import { useState } from 'react'
import { createPost } from '@/app/actions'
import TipTap from '@/components/editor/TipTap'
import { CATEGORIES } from '@/config/categories' // <--- Import Config
import { redirect } from 'next/navigation'

export default function WritePage() {
  const [contentJson, setContentJson] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    // Basic validation
    if (Object.keys(contentJson).length === 0) {
      alert("Please write some content.")
      setIsSubmitting(false)
      return
    }
    
    try {
        console.log("Submitting formData and contentJson:", formData, contentJson);
        setIsSubmitting(false)
        const slug = await createPost(formData, contentJson)
        redirect(`/${slug}`) // Redirect on success
    } catch (e) {
      alert('Error saving post')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-orbitron text-white mb-8">New Experiment Log</h1>
      
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-slate-400 mb-2 font-inter">Title</label>
          <input 
            name="title"
            required
            className="w-full bg-navy-900 border border-navy-800 p-3 rounded text-white focus:border-chem-yellow focus:outline-none focus:ring-1 focus:ring-chem-yellow"
            placeholder="e.g. The Iodine Clock Reaction"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 mb-2">Category</label>
            <div className="relative">
              {/* THE DYNAMIC CATEGORY SELECTOR */}
              <select 
                name="category" 
                className="w-full bg-navy-900 border border-navy-800 p-3 rounded text-white appearance-none focus:border-chem-yellow focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {/* Custom Arrow Icon for sleek look */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
          
          <div>
             <label className="block text-slate-400 mb-2">Excerpt</label>
             <input 
               name="excerpt" 
               required
               className="w-full bg-navy-900 border border-navy-800 p-3 rounded text-white focus:border-chem-yellow focus:outline-none" 
               placeholder="Short summary for the card..." 
             />
          </div>
        </div>

        <div className="space-y-2">
           <label className="block text-slate-400">Lab Protocol (Content)</label>
           <TipTap content={contentJson} onChange={setContentJson} />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-chem-yellow text-navy-950 px-8 py-3 rounded font-bold font-orbitron hover:bg-amber-300 transition w-full md:w-auto disabled:opacity-50"
        >
          {isSubmitting ? 'Publishing...' : 'Publish Protocol'}
        </button>
      </form>
    </div>
  )
}