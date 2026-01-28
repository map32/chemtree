
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCategoryLabel } from '@/config/categories' // <--- Import Helper

interface PostCardProps {
  post: {
    title: string
    excerpt: string
    slug: string
    category: string // This is the ID (e.g. "Literature")
    created_at: string
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link 
      href={`/${post.slug}`}
      className="group flex flex-col bg-navy-900 border border-navy-800 rounded-xl overflow-hidden hover:border-chem-yellow/50 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-orbitron text-chem-yellow uppercase tracking-widest">
            {/* Display the Nice Name */}
            {getCategoryLabel(post.category)}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-chem-yellow transition-colors font-orbitron">
          {post.title}
        </h3>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
          {post.excerpt}
        </p>

        <div className="flex items-center text-sm text-chem-yellow font-medium gap-2">
          Read Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}