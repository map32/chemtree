'use client'
import { useState } from 'react'
import { PencilLine } from 'lucide-react'
import { deletePost } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface EditButtonProps {
  postId: string
  className?: string
  redirectAfter?: boolean // True for single post page, False for list
}

export function EditButton({ postId, className = "", redirectAfter = false }: EditButtonProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const handleEdit = async (e: React.MouseEvent) => {
    e.preventDefault() // Stop link clicks if inside a card
    e.stopPropagation()
    setIsEditing(true)
    router.push(`/admin/write?id=${postId}`) // Navigate to the edit page for this post
  }

  return (
    <button
      onClick={handleEdit}
      disabled={isEditing}
      className={`text-slate-500 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-navy-800 ${className}`}
      title="Edit Log"
    >
      {isEditing ? (
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <PencilLine className="w-4 h-4" />
      )}
    </button>
  )
}