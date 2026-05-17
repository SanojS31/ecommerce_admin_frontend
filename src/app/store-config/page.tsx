import Layout from "@/components/common/Layout";
import StoreConfigSection from "@/components/storeConfig/StoreConfigSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function StoreConfigPage() {
  return (
    <PrivateRoute>
      <Layout>
        <StoreConfigSection />
      </Layout>
    </PrivateRoute>
  );
}