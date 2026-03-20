'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/actions'
import { FlaskConical } from 'lucide-react'

export default function ProfileForm({ profile }: { profile: any }) {
  const [preview, setPreview] = useState<string | null>(profile?.avatar_url || null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <form action={updateProfile} className="space-y-6">
      <input type="hidden" name="currentAvatarUrl" value={profile?.avatar_url || ''} />

      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Profile Image</label>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-navy-900 rounded-xl border-2 border-navy-800 flex items-center justify-center overflow-hidden relative">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <FlaskConical className="w-8 h-8 text-slate-600" />
            )}
          </div>
          <input 
            type="file" 
            name="avatar" 
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-chem-green file:text-navy-950 hover:file:bg-chem-yellow transition-colors cursor-pointer"
          />
        </div>
      </div>

      {/* Name Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Name</label>
        <input 
          type="text" 
          name="name" 
          defaultValue={profile?.name || ''} 
          required
          className="w-full bg-navy-900 border border-navy-800 rounded-lg p-3 text-white focus:outline-none focus:border-chem-green"
        />
      </div>

      {/* Intro Text Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">About Me Text</label>
        <textarea 
          name="introText" 
          rows={10} 
          defaultValue={profile?.intro_text || ''} 
          required
          className="w-full bg-navy-900 border border-navy-800 rounded-lg p-3 text-white focus:outline-none focus:border-chem-green"
          placeholder="Write your bio here..."
        />
      </div>

      <button 
        type="submit"
        className="px-6 py-3 bg-chem-green text-navy-950 font-bold rounded-lg hover:bg-chem-yellow transition-colors"
      >
        Save Profile
      </button>
    </form>
  )
}