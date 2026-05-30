/**
 * Security Utilities
 * XSS protection and input sanitization for Guestly Platform
 */

import DOMPurify from 'dompurify';
import { filterXSS } from 'xss';

// Configure DOMPurify for server-side use
// Note: DOMPurify works in both browser and Node.js (with jsdom)
if (typeof window === 'undefined') {
  // Node.js environment - DOMPurify requires jsdom
  // @ts-ignore - jsdom is a peer dependency
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('');
  // @ts-ignore
  global.window = dom.window;
  // @ts-ignore
  global.document = dom.window.document;
  // @ts-ignore
  global.navigator = dom.window.navigator;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - Raw HTML content
 * @param options - DOMPurify configuration options
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string, options: DOMPurify.Config = {}): string {
  const defaultOptions: DOMPurify.Config = {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'blockquote',
      'code', 'pre', 'img', 'video', 'audio', 'table', 'thead',
      'tbody', 'tr', 'th', 'td', 'caption', 'figure', 'figcaption'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height',
      'class', 'id', 'style', 'target', 'rel', 'data-*'
    ],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'javascript:'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed'],
    ALLOW_DATA_ATTR: true,
    USE_PROFILES: { html: true },
    ...options
  };

  return DOMPurify.sanitize(html, defaultOptions);
}

/**
 * Sanitize plain text (removes all HTML tags)
 * @param text - Raw text content
 * @returns Plain text string with HTML tags removed
 */
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize URL to prevent javascript: and data: XSS vectors
 * @param url - Raw URL string
 * @returns Sanitized URL string
 */
export function sanitizeUrl(url: string): string {
  if (!url) return url;
  
  // Block javascript: and data: URLs
  const blockedProtocols = ['javascript:', 'data:', 'vbscript:', 'about:'];
  for (const protocol of blockedProtocols) {
    if (url.toLowerCase().startsWith(protocol)) {
      return '';
    }
  }
  
  return url;
}

/**
 * Sanitize object keys and values (for JSON data)
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof key === 'string') {
        sanitized[sanitizeText(key)] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Validate and sanitize email input
 * @param email - Raw email string
 * @returns Sanitized email string
 */
export function sanitizeEmail(email: string): string {
  if (!email) return email;
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '';
  }
  
  return email.toLowerCase().trim();
}

/**
 * Sanitize CSS input to prevent CSS injection
 * @param css - Raw CSS string
 * @returns Sanitized CSS string (or empty if dangerous)
 */
export function sanitizeCss(css: string): string {
  if (!css) return css;
  
  // Block dangerous CSS properties
  const dangerousPatterns = [
    /url\(/i,
    /expression\(/i,
    /behavior:/i,
    /-moz-binding:/i,
    /javascript:/i
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(css)) {
      return '';
    }
  }
  
  return css;
}

/**
 * Sanitize SQL-like input to prevent SQL injection in search queries
 * @param input - Raw search input
 * @returns Sanitized search string
 */
export function sanitizeSearchQuery(input: string): string {
  if (!input) return input;
  
  // Remove SQL keywords and special characters
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP',
    'UNION', 'OR', 'AND', 'NOT', 'WHERE', 'FROM',
    ';', '--', '/*', '*/', '\b', '\n', '\r', '\t'
  ];
  
  let sanitized = input;
  for (const keyword of sqlKeywords) {
    sanitized = sanitized.replace(new RegExp(`\\b${keyword}\\b`, 'gi'), '');
  }
  
  return sanitized.trim();
}

/**
 * Create a sanitized HTML fragment safe for rendering
 * @param content - User-generated content
 * @param allowHtml - Whether to allow basic HTML formatting
 * @returns Safe content for rendering
 */
export function safeRender(content: string, allowHtml: boolean = false): string {
  if (!content) return content;
  
  if (allowHtml) {
    return sanitizeHtml(content);
  }
  
  return sanitizeText(content);
}

/**
 * Sanitize content for use in meta tags (prevents meta tag injection)
 * @param content - Raw content
 * @returns Sanitized content safe for meta tags
 */
export function sanitizeMeta(content: string): string {
  if (!content) return content;
  
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Re-export DOMPurify for direct use
export { DOMPurify };

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeObject,
  sanitizeEmail,
  sanitizeCss,
  sanitizeSearchQuery,
  safeRender,
  sanitizeMeta,
  DOMPurify
};
