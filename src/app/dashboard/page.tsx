import Layout from '@/components/common/Layout'
import DashboardSection from '@/components/dashboard/DashboardSection'
import PrivateRoute from '@/components/common/PrivateRoute'

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <Layout>
        <DashboardSection />
      </Layout>
    </PrivateRoute>
  )
}