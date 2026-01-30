import { createClient } from '@/lib/supabase/server'

export type Category = { id: string; name: string }

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')

  if (error) throw error
  return data ?? []
}
