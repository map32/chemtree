import { getCategories } from '@/app/actions'
import SidebarClient from './SidebarClient'

export default async function Sidebar() {
  const categories = await getCategories()

  return <SidebarClient categories={categories} />
}