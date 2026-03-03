import { createClient } from '@/lib/supabase/server'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { DeleteButton } from '@/components/blog/DeleteButton'
import { EditButton } from '@/components/blog/EditButton'
import { TextStyleKit } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import OfficePaste from '@intevation/tiptap-extension-office-paste'

export default async function BlogPost({ params }: { params: Promise<any> }) {
  const supabase = await createClient()
  const {slug} = await params;
  // 1. Check Admin Status
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = !!user
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) return <div>Post not found</div>

  // Convert JSON to HTML on the server
  const htmlContent = generateHTML(post.content, [
    StarterKit,
    TextStyleKit,
    Highlight.configure({ multicolor: true }),
    OfficePaste,
    Image
  ])

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      <header className="mb-8 border-b border-navy-800 pb-8">
        <span className="text-chem-yellow font-orbitron text-sm uppercase tracking-wider">
          {post.category}
          {isAdmin && (
               <>
                <EditButton postId={post.id} />
                <DeleteButton postId={post.id} redirectAfter={true} />
                </>
           )}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 font-orbitron">
          {post.title}
        </h1>
        <time className="text-slate-400">
          {new Date(post.created_at).toLocaleDateString()}
        </time>
      </header>

      {/* Render HTML content */}
      <div 
        className="prose prose-fix prose-invert prose-base prose-headings:font-orbitron prose-a:text-chem-yellow max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </article>
  )
}