// src/app/layout.tsx
import Sidebar from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Orbitron, Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import UserProvider from '@/components/UserProvider'

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'Chemtree | A Chemistry Blog',
  description: 'Personal experiments and notes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} dark`}>
      {/* FORCE background to be dark navy/black everywhere */}
      <body className="bg-navy-950 text-white font-inter min-h-screen flex flex-col antialiased">
        <UserProvider>
          {/* 1. Large Top Header */}
          <Header />
          {/* 2. Main Content Grid */}
          <div className="flex-grow container mx-auto px-4 py-8 md:flex md:gap-8">

            {/* Left Column: Sidebar Navigation */}
            <aside className="md:w-64 flex-shrink-0 mb-8 md:mb-0">
              <Suspense fallback={<div className="w-64 bg-navy-900 h-screen" />}>
                <Sidebar />
              </Suspense>
            </aside>
            {/* Right Column: Main Content */}
            <main className="flex-grow min-w-0">
              {children}
            </main>

          </div>
        </UserProvider>
      </body>
    </html>
  )
}