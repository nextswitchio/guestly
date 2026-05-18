import { NextRequest, NextResponse } from "next/server";
import { getAllVendors, VendorProfile } from "@/lib/store";
import { apiCache, CacheKeys, CacheTags } from "@/lib/cache";
import { createConditionalResponse, CacheConfigs } from "@/lib/middleware/cache";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") as VendorProfile["category"] | null;
  const city = searchParams.get("city") as VendorProfile["city"] | null;
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || "rating"; // rating, completedEvents, name
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);
  
  // Create filters object for caching
  const filters = {
    category,
    city,
    search,
    sortBy,
    page: page.toString(),
    pageSize: pageSize.toString(),
  };
  
  // Remove null values for consistent cache keys
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined)
  );
  
  try {
    // Cache vendor listings
    const result = await apiCache.get(
      CacheKeys.vendors(cleanFilters),
      () => {
        let vendors = getAllVendors();
        
        // Filter by category
        if (category) {
          vendors = vendors.filter(v => v.category === category);
        }
        
        // Filter by city
        if (city) {
          vendors = vendors.filter(v => v.city === city);
        }
        
        // Filter by search term
        if (search) {
          const searchLower = search.toLowerCase();
          vendors = vendors.filter(v => 
            v.name.toLowerCase().includes(searchLower) ||
            v.description.toLowerCase().includes(searchLower) ||
            (v.services && v.services.some(s => s.toLowerCase().includes(searchLower)))
          );
        }
        
        // Sort vendors
        vendors.sort((a, b) => {
          switch (sortBy) {
            case "rating":
              return (b.rating || 0) - (a.rating || 0);
            case "completedEvents":
              return (b.completedEvents || 0) - (a.completedEvents || 0);
            case "name":
              return a.name.localeCompare(b.name);
            default:
              return (b.rating || 0) - (a.rating || 0);
          }
        });
        
        // Paginate
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedVendors = vendors.slice(startIndex, endIndex);
        
        return {
          vendors: paginatedVendors,
          pagination: {
            page,
            pageSize,
            total: vendors.length,
            totalPages: Math.ceil(vendors.length / pageSize),
            hasNext: endIndex < vendors.length,
            hasPrev: page > 1,
          },
          filters: {
            category,
            city,
            search,
            sortBy,
          },
        };
      },
      {
        ttl: 15 * 60 * 1000, // 15 minutes for vendor listings
        staleTime: 3 * 60 * 1000, // 3 minutes stale time
        tags: [CacheTags.VENDORS],
      }
    );
    
    const responseData = { ok: true, ...result };
    
    // Return cached response with appropriate headers
    return createConditionalResponse(req, responseData, {
      ...CacheConfigs.vendorListings,
      generateETag: true,
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}