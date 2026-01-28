'use client'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deletePost } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  postId: string
  className?: string
  redirectAfter?: boolean // True for single post page, False for list
}

export function DeleteButton({ postId, className = "", redirectAfter = false }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault() // Stop link clicks if inside a card
    e.stopPropagation()

    const confirmed = window.confirm("Are you sure you want to delete this log? This cannot be undone.")
    if (!confirmed) return

    setIsDeleting(true)
    const result = await deletePost(postId)

    if (result.success) {
      if (redirectAfter) {
        router.push('/') // Go home if we deleted the page we are reading
      }
      // If we are on the list, the Server Action revalidatePath handles the UI update automatically
    } else {
      alert("Failed to delete post")
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`text-slate-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-navy-800 ${className}`}
      title="Delete Log"
    >
      {isDeleting ? (
        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  )
}