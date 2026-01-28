import { FlaskConical, Microscope, BookOpen, Atom, type LucideIcon } from 'lucide-react'

export type CategoryItem = {
  id: string
  label: string
  icon: LucideIcon
}

export const CATEGORIES: CategoryItem[] = [
  { 
    id: 'Experiments', 
    label: 'My Experiments', 
    icon: FlaskConical 
  },
  { 
    id: 'Daily Chem', 
    label: 'Daily Chem', 
    icon: Microscope 
  },
  { 
    id: 'Literature', 
    label: 'Literature Review', 
    icon: BookOpen 
  },
]

// Helper to get the nice name (e.g. "My Experiments") from the ID (e.g. "Experiments")
export function getCategoryLabel(id: string) {
  const category = CATEGORIES.find(c => c.id === id)
  return category ? category.label : id
}