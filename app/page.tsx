import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PostSkeleton } from '@/components/ui/Skeleton'
import { DeleteButton } from '@/components/blog/DeleteButton'

// 1. The Async List Component (Handles Fetching)
async function PostList({ category }: { category?: string }) {
  const supabase = await createClient()
  // 1. Check if Admin is logged in
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = !!user // boolean: true if logged in
  // Start the query
  let query = supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  // Apply Filter if category exists
  if (category) {
    query = query.eq('category', category)
  }

  const { data: posts } = await query

  if (!posts || posts.length === 0) {
    return (
      <div className="text-slate-500 italic p-8 text-center bg-navy-900 rounded-lg border border-navy-800">
        No entries found {category ? `for ${category}` : ''}.
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <article 
          key={post.id} 
          className="bg-navy-900 border border-navy-800 p-6 rounded-lg hover:border-chem-yellow transition-colors group relative"
        >
          {isAdmin && (
            <div className="absolute top-4 right-4 z-20">
               <DeleteButton postId={post.id} />
            </div>
          )}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <span className="bg-navy-950 text-chem-yellow px-2 py-1 rounded font-mono border border-navy-800">
              {post.category}
            </span>
            <span className="text-slate-400">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Note: Link points to root /[slug] now */}
          <Link href={`/${post.slug}`}>
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-chem-yellow transition-colors font-orbitron">
              {post.title}
            </h3>
          </Link>

          <p className="text-slate-300 leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          <Link 
            href={`/${post.slug}`}
            className="inline-block text-chem-yellow text-sm font-bold uppercase tracking-wider hover:underline"
          >
            Read Entry &rarr;
          </Link>
        </article>
      ))}
    </div>
  )
}

// === THE FIXED MAIN COMPONENT ===
export default async function HomePage({ 
  searchParams 
}: { 
  // 1. Update the type to be a Promise
  searchParams: Promise<{ category?: string }> 
}) {
  // 2. Await the params before using them
  const { category } = await searchParams

  return (
    <div className="space-y-8">
      <div className="border-b border-navy-800 pb-4 mb-6">
         <h2 className="text-3xl font-orbitron text-white">
           {category ? `${category} Archive` : 'Recent Entries'}
         </h2>
      </div>

      <Suspense 
        key={category || 'home'} 
        fallback={
          <div className="grid gap-6">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        }
      >
        {/* PostList component is still async, so it works perfectly inside Suspense */}
        <PostList category={category} />
      </Suspense>
    </div>
  )
}