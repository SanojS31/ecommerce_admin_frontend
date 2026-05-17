import Layout from "@/components/common/Layout";
import ProductsSection from "@/components/products/ProductsSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function ProductsPage() {
  return (
    <PrivateRoute>
      <Layout>
        <ProductsSection />
      </Layout>
    </PrivateRoute>
  );
}