import { NextRequest, NextResponse } from 'next/server';
import { events } from '@/lib/events';
import { getSitemapLastUpdated } from '@/lib/marketing';

/**
 * Sitemap.xml Route Handler (Requirement 9.3)
 * 
 * Generates XML sitemap including all public event pages and static pages.
 * The sitemap is automatically updated when events are created or modified
 * via the updateSitemap() function called in lib/events.ts addEvent().
 * 
 * Caches for 5 minutes to meet the requirement of updating within 5 minutes
 * of event creation or modification.
 * 
 * Includes:
 * - Static pages (/, /explore, /near, etc.)
 * - City pages (/cities/lagos, /cities/accra, etc.)
 * - All public event pages (/events/[id])
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://guestly.com';

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/explore', priority: 0.9, changefreq: 'daily' },
  { path: '/near', priority: 0.8, changefreq: 'daily' },
  { path: '/communities', priority: 0.7, changefreq: 'weekly' },
  { path: '/vendors', priority: 0.6, changefreq: 'weekly' },
];

// City pages
const CITY_PAGES = [
  { path: '/cities/lagos', priority: 0.8, changefreq: 'daily' },
  { path: '/cities/abuja', priority: 0.8, changefreq: 'daily' },
  { path: '/cities/accra', priority: 0.8, changefreq: 'daily' },
  { path: '/cities/nairobi', priority: 0.8, changefreq: 'daily' },
];

export async function GET(request: NextRequest) {
  try {
    const lastUpdated = getSitemapLastUpdated();
    
    // Build sitemap XML
    const sitemap = generateSitemapXML();
    
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache for 5 minutes
        'X-Sitemap-Last-Updated': new Date(lastUpdated).toISOString(),
      },
    });
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

function generateSitemapXML(): string {
  const now = new Date().toISOString();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static pages
  for (const page of STATIC_PAGES) {
    xml += generateURLEntry(page.path, now, page.changefreq, page.priority);
  }
  
  // Add city pages
  for (const city of CITY_PAGES) {
    xml += generateURLEntry(city.path, now, city.changefreq, city.priority);
  }
  
  // Add event pages (all public events)
  for (const event of events) {
    const eventPath = `/events/${event.id}`;
    const lastmod = now; // Use current time since events don't have updatedAt
    const priority = 0.9; // High priority for event pages
    const changefreq = 'daily'; // Events can be updated frequently
    
    xml += generateURLEntry(eventPath, lastmod, changefreq, priority);
  }
  
  xml += '</urlset>';
  
  return xml;
}

function generateURLEntry(
  path: string,
  lastmod: string,
  changefreq: string,
  priority: number
): string {
  const url = `${BASE_URL}${path}`;
  
  return `  <url>
    <loc>${escapeXML(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>
`;
}

function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
