import { describe, it, expect } from 'vitest';
import { getStates, getCities, LOCATION_DATA } from '@/lib/locations';

describe('Location utilities', () => {
  it('returns states for Nigeria', () => {
    const states = getStates('Nigeria');
    expect(states).toContain('Lagos');
    expect(states).toContain('FCT');
  });

  it('returns states for Ghana', () => {
    const states = getStates('Ghana');
    expect(states).toContain('Greater Accra');
    expect(states).toContain('Ashanti');
  });

  it('returns states for Kenya', () => {
    const states = getStates('Kenya');
    expect(states).toContain('Nairobi County');
    expect(states).toContain('Mombasa County');
  });

  it('returns cities for Lagos state', () => {
    const cities = getCities('Nigeria', 'Lagos');
    expect(cities).toContain('Lagos');
    expect(cities).toContain('Ikeja');
    expect(cities).toContain('Lekki');
  });

  it('returns empty array for unknown state', () => {
    const cities = getCities('Nigeria', 'Unknown');
    expect(cities).toEqual([]);
  });

  it('has all three countries in LOCATION_DATA', () => {
    expect(LOCATION_DATA).toHaveProperty('Nigeria');
    expect(LOCATION_DATA).toHaveProperty('Ghana');
    expect(LOCATION_DATA).toHaveProperty('Kenya');
  });
});
