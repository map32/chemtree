import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/admin/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch existing profile data
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      
    profile = data
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <h1 className="text-3xl font-orbitron font-bold text-white mb-8 border-b border-navy-800 pb-4">
        Edit <span className="text-chem-yellow">Profile</span>
      </h1>
      <ProfileForm profile={profile} />
    </div>
  )
}