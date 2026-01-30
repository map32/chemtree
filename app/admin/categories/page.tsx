import { getCategories } from '@/app/actions'
import CategoriesManager from '@/components/admin/CategoriesManager'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-orbitron text-white mb-6">Categories</h1>
        <CategoriesManager initial={categories} />
      </div>
    </main>
  )
}