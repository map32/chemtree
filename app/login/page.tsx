'use client'
import { useContext, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FlaskConical, Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/context/UserContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const {setUser} = useContext(UserContext);
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      // Login successful!
      setUser(data.user);
      router.refresh() // Refreshes Server Components (like Middleware)
      router.push('/admin/write')
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 bg-navy-900 p-8 rounded-2xl border border-navy-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-chem-yellow/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

        <div className="text-center relative z-10">
          <div className="inline-flex p-3 rounded-full bg-navy-950 border border-navy-800 mb-4">
            <FlaskConical className="w-8 h-8 text-chem-yellow" />
          </div>
          <h2 className="text-3xl font-orbitron font-bold text-white">Lab Access</h2>
          <p className="mt-2 text-slate-400">Enter credentials to proceed.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {errorMsg && (
            <div className="p-3 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <Input 
                type="email" 
                required 
                placeholder="Email Address"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <Input 
                type="password" 
                required 
                placeholder="Password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Unlock Terminal'}
          </Button>
        </form>
      </div>
    </div>
  )
}