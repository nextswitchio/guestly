import { redirect } from "next/navigation";

export default function ConfirmationQueryPage({ searchParams }: { searchParams: { orderId?: string; id?: string } }) {
  const orderId = searchParams?.orderId || searchParams?.id;
  if (orderId) {
    redirect(`/confirmation/${orderId}`);
  }
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Order Confirmation</h1>
      <p className="text-sm text-neutral-500 mt-2">No orderId query parameter provided.</p>
    </div>
  );
}
