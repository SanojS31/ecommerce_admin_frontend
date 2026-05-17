import Layout from "@/components/common/Layout";
import BrandsSection from "@/components/brands/BrandsSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function BrandsPage() {
  return (
    <PrivateRoute>
      <Layout>
        <BrandsSection />
      </Layout>
    </PrivateRoute>
  );
}