'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// HELPER: Recursively extract text from TipTap JSON
function generateExcerpt(node: any): string {
  if (typeof node !== 'object' || !node) return ''
  
  // Found a text node? Return it.
  if (node.type === 'text' && node.text) {
    return node.text
  }
  
  // If it has children (content), map through them and join with spaces
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(generateExcerpt).join(' ')
  }
  
  return ''
}

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const contentJson = JSON.parse(formData.get('content') as string)
  console.log("contentjson:", JSON.stringify(contentJson));
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const rawText = generateExcerpt(contentJson)
  const excerpt = rawText.slice(0, 160).trim() + (rawText.length > 160 ? '...' : '') || 'View details...'

  const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')

  const { error } = await supabase.from('posts').insert({
    title,
    slug,
    excerpt,
    category,
    content: contentJson,
    author_id: user.id,
    published: true
  })

  if (error) {
    console.error(error)
    // Return failure object
    return { success: false, error: error.message }
  }

  // Return success object (Don't redirect here!)
  return { success: true, slug }
}

// 2. IMAGE UPLOAD (For TipTap)
export async function uploadImage(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('file') as File
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { error } = await supabase.storage
    .from('blog-assets')
    .upload(filePath, file)

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('blog-assets')
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  
  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Delete the post
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    console.error('Delete Error:', error)
    return { success: false, error: error.message }
  }

  // 3. Clear Cache so the UI updates immediately
  revalidatePath('/') // Updates the homepage list
  
  return { success: true }
}