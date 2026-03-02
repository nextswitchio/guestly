import ProtectedRoute from "@/components/ProtectedRoute";
import AddFundsForm from "@/components/wallet/AddFundsForm";

export default function OrganiserAddFundsPage() {
  return (
    <ProtectedRoute allowRoles={["organiser"]}>
      <AddFundsForm />
    </ProtectedRoute>
  );
}

