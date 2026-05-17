import Layout from "@/components/common/Layout";
import SingleProductSection from "@/components/products/SingleProductSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function ProductDetailPage() {
  return (
    <PrivateRoute>
      <Layout>
        <SingleProductSection />
      </Layout>
    </PrivateRoute>
  );
}