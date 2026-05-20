import { describe, it, expect, beforeEach } from 'vitest';
import {
  formatCurrency,
  formatDate,
  truncateText,
  slugify,
  generateReference,
} from '@/lib/utils';

describe('Utility functions', () => {
  describe('formatCurrency', () => {
    it('formats NGN currency correctly', () => {
      const result = formatCurrency(10000, 'NGN');
      expect(result).toContain('₦');
    });

    it('formats USD currency correctly', () => {
      const result = formatCurrency(100, 'USD');
      expect(result).toContain('$');
    });
  });

  describe('formatDate', () => {
    it('formats timestamp to readable date', () => {
      const timestamp = Date.now();
      const result = formatDate(timestamp);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than max length', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result.length).toBeLessThanOrEqual(23);
      expect(result.endsWith('...')).toBe(true);
    });

    it('does not truncate short text', () => {
      const text = 'Short text';
      const result = truncateText(text, 50);
      expect(result).toBe(text);
    });
  });

  describe('slugify', () => {
    it('converts string to slug format', () => {
      const result = slugify('Hello World');
      expect(result).toBe('hello-world');
    });

    it('handles special characters', () => {
      const result = slugify('Hello! @#$ World');
      expect(result).toBe('hello-world');
    });
  });

  describe('generateReference', () => {
    it('generates a unique reference', () => {
      const ref1 = generateReference();
      const ref2 = generateReference();
      expect(ref1).not.toBe(ref2);
    });

    it('generates reference with correct prefix', () => {
      const ref = generateReference('test');
      expect(ref.startsWith('test-')).toBe(true);
    });
  });
});
