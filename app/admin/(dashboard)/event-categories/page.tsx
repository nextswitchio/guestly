import CategoryCatalogManager from "@/components/admin/CategoryCatalogManager";

export default function AdminEventCategoriesPage() {
  return (
    <CategoryCatalogManager
      resource="event-categories"
      title="Event Categories"
      description="Manage event categories and featured category placements used across organizer and attendee forms."
    />
  );
}
