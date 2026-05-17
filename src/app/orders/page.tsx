import Layout from "@/components/common/Layout";
import OrdersSection from "@/components/orders/OrdersSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function OrdersPage() {
  return (
    <PrivateRoute>
      <Layout>
        <OrdersSection />
      </Layout>
    </PrivateRoute>
  );
}