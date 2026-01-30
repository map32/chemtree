'use client'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Info, Search, LogOut, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useContext, useEffect } from 'react'
import { UserContext } from '@/context/UserContext'

type Category = { id: string; name: string }

export default function SidebarClient({ categories }: { categories: Category[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get('category')
  const supabase = createClient()
  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    supabase.auth.getUser().then(({data: {user}}) => {
        setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
    router.push('/')
  }

  return (
    <nav className="sticky top-8 space-y-2">
      <div className="bg-navy-900 rounded-lg p-4 border border-navy-800 shadow-lg">
        <h3 className="font-orbitron text-chem-yellow mb-4 text-sm uppercase tracking-widest border-b border-navy-800 pb-2">
          Navigation
        </h3>
        <ul className="space-y-1">

          {/* 1. MOST RECENT (Fixed Link) */}
          <li>
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all ${
                (pathname === '/' && !currentCategory)
                  ? 'bg-chem-yellow text-navy-950 font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)]' 
                  : 'text-slate-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Search className={`w-5 h-5 ${(pathname === '/' && !currentCategory) ? 'text-navy-950' : 'text-slate-500'}`} />
              <span>Latest Logs</span>
            </Link>
          </li>

          {/* 2. DYNAMIC CATEGORIES (From DB) */}
          {categories.map((cat) => {
            const isActive = currentCategory === cat.name

            return (
              <li key={cat.id}>
                <Link
                  href={`/?category=${cat.name}`}
                  className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all ${
                    isActive 
                      ? 'bg-chem-yellow text-navy-950 font-bold shadow-[0_0_10px_rgba(251,191,36,0.2)]' 
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <Tag className={`w-5 h-5 ${isActive ? 'text-navy-950' : 'text-slate-500'}`} />
                  <span>{cat.name}</span>
                </Link>
              </li>
            )
          })}

          {/* 3. ABOUT US (Fixed Link) */}
          <li>
            <Link
              href="/about"
              className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all ${
                pathname.startsWith('/about')
                  ? 'bg-chem-yellow text-navy-950 font-bold' 
                  : 'text-slate-300 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Info className={`w-5 h-5 ${pathname.startsWith('/about') ? 'text-navy-950' : 'text-slate-500'}`} />
              <span>About Us</span>
            </Link>
          </li>

        </ul>
      </div>

      {/* Admin Panel (Only visible if logged in) */}
      <div className="pt-4 px-4 border-t border-navy-800 mt-4">
         {user ? (
           <div className="space-y-3">
             <Link href="/admin/write" className="flex items-center gap-2 text-xs text-chem-yellow hover:text-white transition-colors">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               Write Entry
             </Link>
             <Link href="/admin/categories" className="flex items-center gap-2 text-xs text-chem-yellow hover:text-white transition-colors">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               Edit Categories
             </Link>
             <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors w-full text-left"
             >
               <LogOut className="w-3 h-3" />
               Logout
             </button>
           </div>
         ) : (
           <Link href="/login" className="text-xs text-slate-600 hover:text-slate-400 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-slate-700" />
             Admin Access
           </Link>
         )}
       </div>
    </nav>
  )
}
