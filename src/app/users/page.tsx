import Layout from "@/components/common/Layout";
import UsersSection from "@/components/users/UsersSection";
import PrivateRoute from "@/components/common/PrivateRoute";

export default function UsersPage() {
  return (
    <PrivateRoute>
      <Layout>
        <UsersSection />
      </Layout>
    </PrivateRoute>
  );
}