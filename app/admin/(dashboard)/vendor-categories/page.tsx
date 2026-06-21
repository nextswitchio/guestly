import CategoryCatalogManager from "@/components/admin/CategoryCatalogManager";

export default function AdminVendorCategoriesPage() {
  return (
    <CategoryCatalogManager
      resource="vendor-categories"
      title="Vendor Categories"
      description="Manage vendor service categories used in vendor onboarding, profiles, service profiles, and organizer sourcing."
    />
  );
}
