import { NextRequest, NextResponse } from 'next/server';
import { fetchBackendJson } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  try {
    // Get usage logs from backend
    const { data: logs, status, ok } = await fetchBackendJson(
      req,
      '/api/v1/api-access/usage'
    );
    
    if (!ok) return NextResponse.json(logs, { status });
    
    // Transform the logs into the format expected by the frontend
    // The frontend expects: { usage: Array<{ label: string; requests: number; date: string; endpoints: string[] }> }
    const usageByDate: Record<string, { requests: number; endpoints: Set<string> }> = {};
    
    if (Array.isArray(logs)) {
      logs.forEach((log: any) => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        if (!usageByDate[date]) {
          usageByDate[date] = { requests: 0, endpoints: new Set() };
        }
        usageByDate[date].requests++;
        if (log.endpoint) {
          usageByDate[date].endpoints.add(log.endpoint);
        }
      });
    }
    
    const usage = Object.entries(usageByDate).map(([date, stats]) => ({
      label: date,
      requests: stats.requests,
      date,
      endpoints: Array.from(stats.endpoints),
    }));
    
    return NextResponse.json({ usage });
  } catch (error) {
    console.error('Error fetching usage:', error);
    return NextResponse.json({ usage: [] }, { status: 200 });
  }
}