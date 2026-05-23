export type PlatformCountry = {
  id?: string;
  name: string;
  code?: string | null;
  nationality?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export type PlatformCity = {
  id?: string;
  name: string;
  countryId?: string | null;
  countryName: string;
  state?: string | null;
  slug: string;
  image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type PlatformCategory = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type PlatformCatalog = {
  countries: PlatformCountry[];
  cities: PlatformCity[];
  eventCategories: PlatformCategory[];
  vendorCategories: PlatformCategory[];
};

export const DEFAULT_PLATFORM_CATALOG: PlatformCatalog = {
  countries: [
    { name: "Nigeria", code: "NG", nationality: "Nigerian", isActive: true, sortOrder: 1 },
    { name: "Ghana", code: "GH", nationality: "Ghanaian", isActive: true, sortOrder: 2 },
    { name: "Kenya", code: "KE", nationality: "Kenyan", isActive: true, sortOrder: 3 },
    { name: "Rwanda", code: "RW", nationality: "Rwandan", isActive: true, sortOrder: 4 },
    { name: "Uganda", code: "UG", nationality: "Ugandan", isActive: true, sortOrder: 5 },
    { name: "Tanzania", code: "TZ", nationality: "Tanzanian", isActive: true, sortOrder: 6 },
    { name: "South Africa", code: "ZA", nationality: "South African", isActive: true, sortOrder: 7 },
  ],
  cities: [
    { name: "Lagos", countryName: "Nigeria", state: "Lagos", slug: "lagos", image: "/cities/lagos.png", latitude: 6.5244, longitude: 3.3792, isFeatured: true, isActive: true, sortOrder: 1 },
    { name: "Abuja", countryName: "Nigeria", state: "FCT", slug: "abuja", image: "/cities/abuja.png", latitude: 9.0765, longitude: 7.3986, isFeatured: true, isActive: true, sortOrder: 2 },
    { name: "Accra", countryName: "Ghana", state: "Greater Accra", slug: "accra", image: "/cities/accra.png", latitude: 5.6037, longitude: -0.187, isFeatured: true, isActive: true, sortOrder: 3 },
    { name: "Nairobi", countryName: "Kenya", state: "Nairobi County", slug: "nairobi", image: "/cities/nairobi.png", latitude: -1.2921, longitude: 36.8219, isFeatured: true, isActive: true, sortOrder: 4 },
    { name: "Kigali", countryName: "Rwanda", state: "Kigali City", slug: "kigali", image: "/cities/kigali.png", latitude: -1.9441, longitude: 30.0619, isFeatured: true, isActive: true, sortOrder: 5 },
    { name: "Kampala", countryName: "Uganda", state: "Central Region", slug: "kampala", image: "/cities/kampala.png", latitude: 0.3476, longitude: 32.5825, isFeatured: true, isActive: true, sortOrder: 6 },
    { name: "Dar es Salaam", countryName: "Tanzania", state: "Dar es Salaam", slug: "dar-es-salaam", image: "/cities/daressalaam.png", latitude: -6.7924, longitude: 39.2083, isFeatured: true, isActive: true, sortOrder: 7 },
    { name: "Johannesburg", countryName: "South Africa", state: "Gauteng", slug: "johannesburg", image: "/cities/johannesburg.png", latitude: -26.2041, longitude: 28.0473, isFeatured: true, isActive: true, sortOrder: 8 },
  ],
  eventCategories: [
    { name: "Music", slug: "music", description: "Concerts, festivals, listening parties, and live showcases", icon: "music", color: "#8B5CF6", isFeatured: true, isActive: true, sortOrder: 1 },
    { name: "Tech", slug: "tech", description: "Conferences, hackathons, demos, and founder gatherings", icon: "laptop", color: "#06B6D4", isFeatured: true, isActive: true, sortOrder: 2 },
    { name: "Business", slug: "business", description: "Networking, trade shows, investor events, and leadership forums", icon: "briefcase", color: "#0F766E", isFeatured: true, isActive: true, sortOrder: 3 },
    { name: "Art", slug: "art", description: "Exhibitions, fashion, theatre, film, and culture events", icon: "palette", color: "#F97316", isFeatured: true, isActive: true, sortOrder: 4 },
    { name: "Food", slug: "food", description: "Food fairs, tastings, lifestyle pop-ups, and culinary events", icon: "utensils", color: "#84CC16", isFeatured: true, isActive: true, sortOrder: 5 },
    { name: "Sports", slug: "sports", description: "Fitness, tournaments, viewing parties, and active communities", icon: "trophy", color: "#EF4444", isFeatured: true, isActive: true, sortOrder: 6 },
    { name: "Cultural", slug: "cultural", description: "Heritage, community, and cultural celebrations", icon: "landmark", color: "#F59E0B", isFeatured: false, isActive: true, sortOrder: 7 },
    { name: "Faith", slug: "faith", description: "Faith-based gatherings, retreats, and concerts", icon: "heart", color: "#22C55E", isFeatured: false, isActive: true, sortOrder: 8 },
    { name: "Entertainment", slug: "entertainment", description: "Comedy, nightlife, shows, and premium social experiences", icon: "sparkles", color: "#EC4899", isFeatured: false, isActive: true, sortOrder: 9 },
  ],
  vendorCategories: [
    { name: "Security", slug: "security", description: "Access control, crowd safety, and event security teams", icon: "shield", color: "#0F766E", isFeatured: true, isActive: true, sortOrder: 1 },
    { name: "Sound", slug: "sound", description: "Audio engineering, DJ equipment, lighting, and AV support", icon: "speaker", color: "#6366F1", isFeatured: true, isActive: true, sortOrder: 2 },
    { name: "Catering", slug: "catering", description: "Food, drinks, bartending, and hospitality service", icon: "utensils", color: "#F97316", isFeatured: true, isActive: true, sortOrder: 3 },
    { name: "Decoration", slug: "decoration", description: "Stage design, florals, styling, and decor production", icon: "sparkles", color: "#EC4899", isFeatured: true, isActive: true, sortOrder: 4 },
    { name: "Logistics", slug: "logistics", description: "Transportation, rentals, build crews, and event operations", icon: "truck", color: "#64748B", isFeatured: true, isActive: true, sortOrder: 5 },
    { name: "Photography", slug: "photography", description: "Photography, videography, live capture, and content crews", icon: "camera", color: "#14B8A6", isFeatured: true, isActive: true, sortOrder: 6 },
    { name: "Entertainment", slug: "entertainment", description: "Hosts, performers, dancers, comedians, and MCs", icon: "mic", color: "#A855F7", isFeatured: false, isActive: true, sortOrder: 7 },
  ],
};

function normalizeBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function toCamelCountry(raw: any): PlatformCountry {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code ?? null,
    nationality: raw.nationality ?? null,
    isActive: normalizeBoolean(raw.isActive ?? raw.is_active, true),
    sortOrder: normalizeNumber(raw.sortOrder ?? raw.sort_order, 0),
  };
}

export function toCamelCity(raw: any): PlatformCity {
  return {
    id: raw.id,
    name: raw.name,
    countryId: raw.countryId ?? raw.country_id ?? null,
    countryName: raw.countryName ?? raw.country_name ?? raw.country ?? "",
    state: raw.state ?? null,
    slug: raw.slug,
    image: raw.image ?? null,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    isFeatured: normalizeBoolean(raw.isFeatured ?? raw.is_featured),
    isActive: normalizeBoolean(raw.isActive ?? raw.is_active, true),
    sortOrder: normalizeNumber(raw.sortOrder ?? raw.sort_order, 0),
  };
}

export function toCamelCategory(raw: any): PlatformCategory {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? null,
    icon: raw.icon ?? null,
    color: raw.color ?? null,
    isFeatured: normalizeBoolean(raw.isFeatured ?? raw.is_featured),
    isActive: normalizeBoolean(raw.isActive ?? raw.is_active, true),
    sortOrder: normalizeNumber(raw.sortOrder ?? raw.sort_order, 0),
  };
}

export function normalizeCatalog(raw: any): PlatformCatalog {
  return {
    countries: (raw?.countries || DEFAULT_PLATFORM_CATALOG.countries).map(toCamelCountry),
    cities: (raw?.cities || DEFAULT_PLATFORM_CATALOG.cities).map(toCamelCity),
    eventCategories: (raw?.eventCategories || raw?.event_categories || DEFAULT_PLATFORM_CATALOG.eventCategories).map(toCamelCategory),
    vendorCategories: (raw?.vendorCategories || raw?.vendor_categories || DEFAULT_PLATFORM_CATALOG.vendorCategories).map(toCamelCategory),
  };
}

export function toSnakeCatalogPayload(raw: Record<string, unknown>) {
  return {
    name: raw.name,
    code: raw.code || undefined,
    nationality: raw.nationality || undefined,
    country_id: raw.countryId || raw.country_id || undefined,
    country_name: raw.countryName || raw.country_name || undefined,
    state: raw.state || undefined,
    slug: raw.slug || undefined,
    image: raw.image || undefined,
    latitude: raw.latitude === "" ? undefined : raw.latitude,
    longitude: raw.longitude === "" ? undefined : raw.longitude,
    description: raw.description || undefined,
    icon: raw.icon || undefined,
    color: raw.color || undefined,
    is_featured: raw.isFeatured ?? raw.is_featured,
    is_active: raw.isActive ?? raw.is_active,
    sort_order: raw.sortOrder ?? raw.sort_order,
  };
}
