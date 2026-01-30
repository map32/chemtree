'use client'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { UserContext } from '@/context/UserContext'

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}