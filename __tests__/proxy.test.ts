import { describe, it, expect, beforeEach } from 'vitest';
import { proxy } from '@/proxy';
import { NextRequest } from 'next/server';

function createMockRequest(pathname: string, cookies: Record<string, string> = {}) {
  const cookieString = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  return {
    nextUrl: { pathname },
    cookies: {
      get: (name: string) => ({ value: cookies[name] || undefined }),
    },
    url: `http://localhost${pathname}`,
  } as unknown as NextRequest;
}

describe('Proxy middleware', () => {
  it('allows access to public routes', () => {
    const req = createMockRequest('/');
    const response = proxy(req);
    expect(response.status).toBeUndefined();
  });

  it('redirects unauthenticated users from protected routes', () => {
    const req = createMockRequest('/dashboard');
    const response = proxy(req);
    expect(response.status).toBe(307);
  });

  it('redirects unauthenticated users from admin routes to login', () => {
    const req = createMockRequest('/admin');
    const response = proxy(req);
    expect(response.status).toBe(307);
  });

  it('allows authenticated users to access protected routes', () => {
    const req = createMockRequest('/attendee', {
      role: 'attendee',
      access_token: 'valid-token',
    });
    const response = proxy(req);
    expect(response.status).toBeUndefined();
  });

  it('redirects non-admin users from admin routes', () => {
    const req = createMockRequest('/admin', {
      role: 'attendee',
      access_token: 'valid-token',
    });
    const response = proxy(req);
    expect(response.status).toBe(307);
  });

  it('allows admin users to access admin routes', () => {
    const req = createMockRequest('/admin', {
      role: 'admin',
      access_token: 'valid-token',
    });
    const response = proxy(req);
    expect(response.status).toBeUndefined();
  });

  it('redirects authenticated users from auth routes', () => {
    const req = createMockRequest('/login', {
      role: 'attendee',
      access_token: 'valid-token',
    });
    const response = proxy(req);
    expect(response.status).toBe(307);
  });

  it('blocks API requests without auth token', () => {
    const req = createMockRequest('/api/admin/users');
    const response = proxy(req);
    expect(response.status).toBe(401);
  });

  it('allows API requests with auth token', () => {
    const req = createMockRequest('/api/admin/users', {
      access_token: 'valid-token',
    });
    const response = proxy(req);
    expect(response.status).toBeUndefined();
  });
});
