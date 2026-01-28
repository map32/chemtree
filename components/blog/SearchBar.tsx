'use client'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce' // npm install use-debounce

export function SearchBar() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    replace(`/blog?${params.toString()}`)
  }, 300)

  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
      <input
        className="w-full bg-navy-900 border border-navy-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-chem-yellow focus:ring-1 focus:ring-chem-yellow placeholder:text-slate-600"
        placeholder="Search for compounds, reactions..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString()}
      />
    </div>
  )
}