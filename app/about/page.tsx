import { createClient } from '@/lib/supabase/server'
import { FlaskConical } from 'lucide-react'

export default async function AboutPage() {
  const supabase = await createClient()
  
  // Since this is a personal blog, we just grab the first profile
  // Alternatively, you could filter by a specific user ID if there are multiple users
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  const name = profile?.name || 'Hannah Cho'
  const introText = profile?.intro_text || 'No bio available yet.'
  const avatarUrl = profile?.avatar_url

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* 1. Header Section */}
      <div className="border-b border-navy-800 pb-6">
        <h1 className="text-4xl font-orbitron font-bold text-white mb-2">
          About the <span className="text-chem-yellow">Chemist</span>
        </h1>
        <p className="text-slate-400 font-mono text-sm">
          {name}
        </p>
      </div>

      {/* 2. Profile & Bio Grid */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Left: Profile Image */}
        <div className="md:col-span-1 space-y-4">
          <div className="aspect-square bg-navy-900 rounded-xl border-2 border-navy-800 flex items-center justify-center relative overflow-hidden group">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={name} 
                className="w-full h-full object-cover absolute inset-0 z-10"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-tr from-chem-green/20 to-transparent" />
                <FlaskConical className="w-24 h-24 text-slate-600 group-hover:text-chem-yellow transition-colors duration-300 z-10" />
              </>
            )}
          </div>
        </div>

        {/* Right: The Content */}
        <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-orbitron text-white mb-4">About Me</h3>
            {/* whitespace-pre-wrap ensures standard line breaks from the textarea are respected */}
            <div className="whitespace-pre-wrap">
              {introText}
            </div>
          </div>

          {/* Current Focus Section */}
          <div className="bg-navy-900/50 p-6 rounded-lg border border-navy-800 border-l-4 border-l-chem-green">
            <h4 className="text-chem-green font-bold font-orbitron mb-2 text-sm uppercase">
              What I Focus On
            </h4>
            <p className="mb-2">Through <em>Chemtree</em>, I explore several areas of chemistry:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
              <li>Breaking down core concepts from my coursework</li>
              <li>Explaining chemistry behind everyday phenomena</li>
              <li>Researching new scientific developments and innovations</li>
              <li>Documenting experiments and hands-on learning</li>
              <li>Connecting molecular processes to real-world applications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}