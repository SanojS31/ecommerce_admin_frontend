import Layout from '@/components/common/Layout'
import CategoriesSection from '@/components/categories/CategoriesSection'
import PrivateRoute from '@/components/common/PrivateRoute'

export default function CategoriesPage() {
  return (
    <PrivateRoute>
      <Layout>
        <CategoriesSection />
      </Layout>
    </PrivateRoute>
  )
}