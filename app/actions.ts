'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import sharp from 'sharp'
import heicConvert from "heic-convert";
import { randomUUID } from 'crypto'

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

const HEVC_BRANDS = new Set(["heic", "heix", "heim", "heis", "hevc", "hevx"]);

function isHeic(buf: Buffer) {
  if (buf.length < 16 || buf.toString("ascii", 4, 8) !== "ftyp") return false;
  const boxSize = Math.min(buf.readUInt32BE(0), buf.length);
  const brands = [buf.toString("ascii", 8, 12)];
  for (let i = 16; i + 4 <= boxSize; i += 4) brands.push(buf.toString("ascii", i, i + 4));
  if (brands.includes("avif") || brands.includes("avis")) return false; // sharp handles AVIF
  return brands.some((b) => HEVC_BRANDS.has(b));
}

const MAX_BYTES = 20 * 1024 * 1024;

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

// Errors whose message is safe to show the user
class UploadError extends Error {}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: "You must be signed in to upload images." };

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) throw new UploadError("No file provided.");
    if (file.size > MAX_BYTES) throw new UploadError("Image is too large (max 20 MB).");

   let input = Buffer.from(await file.arrayBuffer());

    if (isHeic(input)) {
      const converted = await heicConvert({
        buffer: new Uint8Array(input).buffer,
        format: "JPEG",
        quality: 0.92,
      });
      input = Buffer.from(converted);
    }

    let output: Buffer;
    try {
      output = await sharp(input, { animated: true })
        .rotate() // apply EXIF orientation before metadata is stripped
        .resize({ width: 2000, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
    } catch {
      throw new Error("Unsupported or corrupted image format");
    }

    const fileName = `uploads/${randomUUID()}.webp`;
    const { error } = await supabase.storage
      .from("blog-assets")
      .upload(fileName, output, { contentType: "image/webp" });
    if (error) {
      console.error("Supabase upload failed:", error);
      throw new UploadError("Could not save the image. Please try again.");
    }

    const url = supabase.storage.from("blog-assets").getPublicUrl(fileName).data.publicUrl;
    return { ok: true, url };
  } catch (err) {
    if (err instanceof UploadError) return { ok: false, error: err.message };
    console.error("uploadImage failed:", err);
    return { ok: false, error: "Upload failed. Please try again." };
  }
}

export async function editPost(postId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const contentJson = JSON.parse(formData.get('content') as string)
  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const rawText = generateExcerpt(contentJson)
  const excerpt = rawText.slice(0, 160).trim() + (rawText.length > 160 ? '...' : '') || 'View details...'
  const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')

  // Fetch old content to diff images
  const { data: existing } = await supabase
    .from('posts')
    .select('content')
    .eq('id', postId)
    .single()

  function extractImageUrls(node: any): string[] {
    if (!node) return []
    const urls: string[] = []
    if (node.type === 'image' && node.attrs?.src) urls.push(node.attrs.src)
    if (Array.isArray(node.content)) urls.push(...node.content.flatMap(extractImageUrls))
    return urls
  }

  const oldUrls = extractImageUrls(existing?.content)
  const newUrls = extractImageUrls(contentJson)
  const removed = oldUrls.filter(url => !newUrls.includes(url))

  const BUCKET_NAME = 'blog-assets'
  const pathsToDelete = removed
    .map(url => {
      const parts = url.split(`/public/${BUCKET_NAME}/`)
      return parts.length > 1 ? parts[1] : null
    })
    .filter(Boolean) as string[]

  if (pathsToDelete.length > 0) {
    const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove(pathsToDelete)
    if (storageError) console.error('Storage Delete Error:', storageError)
  }

  const { error } = await supabase
    .from('posts')
    .update({ title, slug, excerpt, category, content: contentJson })
    .eq('id', postId)

  if (error) {
    console.error('Edit Post Error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/posts/${slug}`)
  return { success: true, slug }
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  
  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // 2. Fetch the post to get the JSON content BEFORE deleting it
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('content')
    .eq('id', postId)
    .single()

  if (fetchError) {
    console.error('Fetch Error:', fetchError)
    return { success: false, error: fetchError.message }
  }

  // 3. Extract image URLs from the JSON tree
  const imageUrls: string[] = []
  
  // Recursive helper function to find all image nodes
  function extractImageUrls(node: any) {
    if (node.type === 'image' && node.attrs?.src) {
      imageUrls.push(node.attrs.src)
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(extractImageUrls)
    }
  }

  if (post?.content) {
    extractImageUrls(post.content)
  }

  // 4. Parse the file paths and delete from Supabase Storage
  // Change 'blog-assets' if your bucket name is different
  const BUCKET_NAME = 'blog-assets' 
  
  // Extract just the path (e.g., "uploads/123.jpeg") from the full URL
  const pathsToDelete = imageUrls
    .map(url => {
      const parts = url.split(`/public/${BUCKET_NAME}/`)
      return parts.length > 1 ? parts[1] : null
    })
    .filter(Boolean) as string[]

  if (pathsToDelete.length > 0) {
    const { error: storageError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .remove(pathsToDelete)

    if (storageError) {
      // We log the error but don't return yet; we still want to delete the post itself
      console.error('Storage Delete Error:', storageError) 
    }
  }

  // 5. Delete the post
  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (deleteError) {
    console.error('Delete Error:', deleteError)
    return { success: false, error: deleteError.message }
  }

  // 6. Clear Cache so the UI updates immediately
  revalidatePath('/admin/categories')
  revalidatePath('/') 
  
  return { success: true }
}

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
  if (error) {console.log(error); throw new Error(error.message)}
  return data ?? []
}

export async function addCategory(name: string) {
  const supabase = await createClient()
  // Request the inserted row back with .select().single()
  const { data, error } = await supabase
    .from('categories')
    .insert({ name })
    .select()
    .single()

  if (error) {
    console.error('Add Category Error:', error)
    return { success: false, error: error.message }
  }

  // Revalidate pages that depend on categories so they update immediately
  revalidatePath('/admin/categories')
  revalidatePath('/')

  return { success: true, category: data }
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId)
  if (error) {
    console.error('Delete Category Error:', error)
    return { success: false, error: error.message }
  }

  // Revalidate pages that depend on categories so they update immediately
  revalidatePath('/admin/categories')
  revalidatePath('/')

  return { success: true }
}


// 2. IMAGE UPLOAD (For TipTap)
export async function uploadProfile(formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('file') as File
  const fileExt = file.name.split('.').pop()
  const fileName = `profile.${fileExt}`

  const { error } = await supabase.storage
    .from('blog-assets')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: true, // This will overwrite the existing profile picture
    })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage
    .from('blog-assets')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const introText = formData.get('introText') as string
  const avatarFile = formData.get('avatar') as File | null
  let avatarUrl = formData.get('currentAvatarUrl') as string

  // 1. Handle Image Upload if a new file was selected
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `avatars/${user.id}-${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('blog-assets')
      .upload(fileName, avatarFile, { upsert: true })

    if (uploadError) {console.log(uploadError); throw new Error('Failed to upload image')}

    const { data: publicUrlData } = supabase.storage
      .from('blog-assets')
      .getPublicUrl(fileName)

    avatarUrl = publicUrlData.publicUrl
  }

  const { error: dbError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      name,
      intro_text: introText,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })

  if (dbError) {
    // This will print to your VS Code / command line terminal, NOT the browser console
    console.error("🔥 SUPABASE DB ERROR 🔥")
    console.error("Message:", dbError.message)
    console.error("Details:", dbError.details)
    console.error("Hint:", dbError.hint)
    console.error("Code:", dbError.code)
    
    // Pass the actual message to the frontend if you want, or just throw it
    throw new Error(`Database Error: ${dbError.message}`)
  }

  // 3. Clear cache and redirect
  revalidatePath('/about')
  redirect('/about')
}