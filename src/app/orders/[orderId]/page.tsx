import Layout from "@/components/common/Layout";
import OrderDetailSection from "@/components/orders/OrderDetailSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function OrderDetailPage() {
  return (
    <PrivateRoute>
      <Layout>
        <OrderDetailSection />
      </Layout>
    </PrivateRoute>
  );
}