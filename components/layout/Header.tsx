import { Search } from 'lucide-react';
import Image from 'next/image';
import { SearchBar } from '../blog/SearchBar';
import { Suspense } from 'react';

export function Header() {
  return (
    <header className="w-full bg-navy-900 border-b-4 border-chem-yellow py-12">
      <div className="container mx-auto px-4 flex items-center gap-6">
        {/* Placeholder Logo */}
        <div className="w-24 h-24 bg-chem-green rounded-3xl flex items-center justify-center border-4 border-navy-800 shadow-xl p-2">
           <div className='w-full h-full relative'>
               <Image src="/logo.png" alt="ChemTree Logo" fill={true} />
           </div>
        </div>
        
        <div>
          <h1 className="text-5xl md:text-6xl font-orbitron font-bold text-white tracking-wider">
            CHEMTREE
          </h1>
          <p className="text-chem-yellow font-mono mt-2 text-lg">
            // Growing knowledge, one bond at a time.
          </p>
        </div>
        <div className="flex-1">
            <Suspense fallback={<div className="w-full h-10 bg-navy-800 rounded-lg animate-pulse" />}>
                <SearchBar />
            </Suspense>
        </div>
      </div>
    </header>
  )
}