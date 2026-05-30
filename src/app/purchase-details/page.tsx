import Layout from "@/components/common/Layout";
import PrivateRoute from "@/components/common/PrivateRoute";
import PurchaseDetailsSection from "@/components/purchaseDetails/PurchaseDetailsSection";

export default function PurchaseDetailsPage() {
  return (
    <PrivateRoute>
      <Layout>
        <PurchaseDetailsSection />
      </Layout>
    </PrivateRoute>
  );
}
