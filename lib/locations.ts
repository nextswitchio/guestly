// Location data for African countries supported by Guestly

export type Country = "Nigeria" | "Ghana" | "Kenya";

export type LocationData = {
  country: Country;
  states: string[];
  majorCities: Record<string, string[]>; // state -> cities
};

export const NIGERIA: LocationData = {
  country: "Nigeria",
  states: [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe",
    "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
    "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
    "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ],
  majorCities: {
    "Lagos": ["Lagos", "Ikeja", "Lekki", "Victoria Island", "Ikoyi", "Surulere", "Yaba"],
    "FCT": ["Abuja", "Gwagwalada", "Kuje", "Bwari"],
    "Kano": ["Kano"],
    "Rivers": ["Port Harcourt"],
    "Oyo": ["Ibadan"],
    "Kaduna": ["Kaduna"],
    "Enugu": ["Enugu"],
    "Anambra": ["Onitsha", "Awka"],
  }
};

export const GHANA: LocationData = {
  country: "Ghana",
  states: [
    "Greater Accra", "Ashanti", "Western", "Eastern", "Central", "Northern",
    "Upper East", "Upper West", "Volta", "Brong-Ahafo", "Bono", "Bono East",
    "Ahafo", "Oti", "Savannah", "North East"
  ],
  majorCities: {
    "Greater Accra": ["Accra", "Tema", "Madina", "Osu", "Labadi"],
    "Ashanti": ["Kumasi"],
    "Western": ["Sekondi-Takoradi"],
    "Eastern": ["Koforidua"],
    "Central": ["Cape Coast"],
    "Northern": ["Tamale"],
  }
};

export const KENYA: LocationData = {
  country: "Kenya",
  states: [
    "Nairobi County", "Mombasa County", "Kisumu County", "Nakuru County", "Kiambu County",
    "Machakos County", "Kajiado County", "Uasin Gishu County", "Kilifi County", "Kwale County",
    "Nyeri County", "Meru County", "Embu County", "Kirinyaga County", "Murang'a County"
  ],
  majorCities: {
    "Nairobi County": ["Nairobi", "Westlands", "Karen", "Kilimani", "Parklands"],
    "Mombasa County": ["Mombasa"],
    "Kisumu County": ["Kisumu"],
    "Nakuru County": ["Nakuru"],
    "Kiambu County": ["Kiambu", "Thika"],
  }
};

export const LOCATION_DATA: Record<Country, LocationData> = {
  "Nigeria": NIGERIA,
  "Ghana": GHANA,
  "Kenya": KENYA,
};

// Helper to get states for a country
export function getStates(country: Country): string[] {
  return LOCATION_DATA[country].states;
}

// Helper to get cities for a state
export function getCities(country: Country, state: string): string[] {
  return LOCATION_DATA[country].majorCities[state] || [];
}

// Helper to detect user's country (placeholder - would use IP geolocation in production)
export function detectUserCountry(): Country {
  // In production, this would use IP geolocation API
  // For now, default to Nigeria
  return "Nigeria";
}
