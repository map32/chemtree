'use client'
import { useEffect, useRef, useState } from 'react'
import { createPost, editPost } from '@/app/actions'
import TipTap from '@/components/editor/TipTap'
import { useRouter, useSearchParams } from 'next/navigation' // <--- Add this
import { getCategories } from '@/app/actions'
import { createClient } from '@/lib/supabase/client'

type Category = { id: string; name: string }

export default function WriteForm() {
  const params = useSearchParams() // <--- Get the post ID from the query parameters (e.g., /admin/write?id=123)
  const id = params.get('id') // <--- This will be null if we're creating a new post, or the post ID if we're editing
  const [editMode, setEditMode] = useState(false) // Not currently used, but can be helpful for future edits
  const [contentJson, setContentJson] = useState({})
  const [otherData, setOtherData] = useState({ title: '', category: '' }) // For non-editor fields
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingCats, setLoadingCats] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const editorRef = useRef<any>(null)
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
    const loadEditPost = async () => {
      if (!id) return
      try {
        const supabase = await createClient()
        const { data: post, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single()
        if (error || !post) {
          console.error('Failed to load post for editing', error)
          return
        }
        setContentJson(post.content) // Assuming content is stored as JSON
        editorRef.current?.setContent(post.content) // Set content in TipTap editor
        setOtherData({ title: post.title, category: post.category })
        setEditMode(true)
      } catch (err) {
        console.error('Error loading post for editing', err)
      }
    }
    loadEditPost();
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
    if (editMode) {
      formData.append('content', JSON.stringify(contentJson))
      const result = await editPost(id as string, formData) // <--- Call editPost instead of createPost
      if (result.success) {
        router.push(`/${result.slug}`) // <--- Client-side redirect (Safe)
      } else {
        alert(`Error: ${result.error}`)
        setIsSubmitting(false)
      }
    } else {
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
              defaultValue={editMode ? otherData.title : undefined}
              placeholder="e.g. The Iodine Clock Reaction"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-2">Category</label>
            <div className="relative">
              <select 
                name="category" 
                className="w-full bg-navy-900 border border-navy-800 p-3 rounded text-white appearance-none focus:border-chem-yellow focus:outline-none cursor-pointer"
                defaultValue={editMode ? otherData.category : ""}
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
           <TipTap content={contentJson} onChange={setContentJson} ref={editorRef}/>
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