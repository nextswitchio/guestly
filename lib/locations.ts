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

// Helper to detect user's country using browser geolocation API
export async function detectUserCountryBrowser(): Promise<Country> {
  try {
    // Try browser geolocation API first
    if (typeof navigator !== "undefined" && "geolocation" in navigator) {
      return new Promise<Country>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Use reverse geocoding to determine country
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
              const country = data?.address?.country;
              if (country?.toLowerCase().includes("nigeria")) return resolve("Nigeria");
              if (country?.toLowerCase().includes("ghana")) return resolve("Ghana");
              if (country?.toLowerCase().includes("kenya")) return resolve("Kenya");
              resolve("Nigeria");
            } catch {
              resolve("Nigeria");
            }
          },
          () => resolve("Nigeria"),
          { timeout: 5000 }
        );
      });
    }
    return "Nigeria";
  } catch {
    return "Nigeria";
  }
}

// Synchronous fallback for server-side rendering
export function detectUserCountry(): Country {
  return "Nigeria";
}
