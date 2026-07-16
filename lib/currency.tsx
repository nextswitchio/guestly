"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { setCurrencyGlobals } from "./utils";

export interface CurrencyMeta {
  symbol: string;
  name: string;
  decimals: number;
}

export interface CurrencyConfig {
  primaryCurrency: string;
  currencies: Record<string, CurrencyMeta>;
  rates: Record<string, number>;
}

export interface UserLocation {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  currency?: string;
}

const DEFAULT_CONFIG: CurrencyConfig = {
  primaryCurrency: "NGN",
  currencies: {
    USD: { symbol: "$", name: "US Dollar", decimals: 2 },
    NGN: { symbol: "₦", name: "Nigerian Naira", decimals: 0 },
    GHS: { symbol: "GH₵", name: "Ghanaian Cedi", decimals: 2 },
    KES: { symbol: "KSh", name: "Kenyan Shilling", decimals: 0 },
    ZAR: { symbol: "R", name: "South African Rand", decimals: 2 },
    GBP: { symbol: "£", name: "British Pound", decimals: 2 },
    EUR: { symbol: "€", name: "Euro", decimals: 2 },
    XOF: { symbol: "CFA", name: "CFA Franc", decimals: 0 },
    RWF: { symbol: "FRw", name: "Rwandan Franc", decimals: 0 },
    UGX: { symbol: "USh", name: "Ugandan Shilling", decimals: 0 },
    TZS: { symbol: "TSh", name: "Tanzanian Shilling", decimals: 0 },
  },
  rates: {
    USD: 1,
    NGN: 1550,
    GHS: 15.5,
    KES: 145,
    ZAR: 18.5,
    GBP: 0.78,
    EUR: 0.92,
    XOF: 605,
    RWF: 1310,
    UGX: 3800,
    TZS: 2500,
  },
};

/* ---------- locale -> currency mapping ---------- */
const LOCALE_CURRENCY_MAP: Record<string, string> = {
  en: "NGN",
  "en-NG": "NGN",
  "en-GH": "GHS",
  "en-KE": "KES",
  "en-ZA": "ZAR",
  "en-GB": "GBP",
  "en-US": "USD",
  "fr-FR": "EUR",
  "fr-CI": "XOF",
  "fr-SN": "XOF",
  "rw-RW": "RWF",
  "en-RW": "RWF",
  "en-UG": "UGX",
  "en-TZ": "TZS",
};

function detectUserCurrency(): string {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const match = LOCALE_CURRENCY_MAP[locale];
    if (match) return match;
    const lang = locale.split("-")[0];
    return LOCALE_CURRENCY_MAP[lang] || "NGN";
  } catch {
    return "NGN";
  }
}

/* ---------- pure helpers (usable outside React) ---------- */
export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];
  if (!fromRate || !toRate) return amount;
  const inUsd = amount / fromRate;
  return inUsd * toRate;
}

export function formatAmountValue(
  amount: number,
  currency: string,
  currencies: Record<string, CurrencyMeta>,
  decimals?: number,
): string {
  const meta = currencies[currency];
  const dec = decimals ?? meta?.decimals ?? 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    }).format(amount);
  } catch {
    const sym = meta?.symbol || currency;
    return `${sym}${amount.toFixed(dec)}`;
  }
}

/* ---------- React context ---------- */
interface CurrencyContextValue {
  config: CurrencyConfig;
  userCurrency: string;
  userLocation?: UserLocation | null;
  formatAmount: (amount: number, opts?: { currency?: string; fromCurrency?: string; decimals?: number; noConvert?: boolean }) => string;
  convertAmount: (amount: number, toCurrency?: string) => number;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  config: DEFAULT_CONFIG,
  userCurrency: "NGN",
  formatAmount: (a) => `${a}`,
  convertAmount: (a) => a,
  loading: true,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<CurrencyConfig>(DEFAULT_CONFIG);
  const [userCurrency, setUserCurrency] = useState(detectUserCurrency);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    fetch("/api/currency/config")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const currencies = { ...DEFAULT_CONFIG.currencies, ...(d.currencies || {}) };
          const rates = { ...DEFAULT_CONFIG.rates, ...(d.rates || {}) };
          const primaryCurrency = d.primaryCurrency || "NGN";
          const cfg: CurrencyConfig = { primaryCurrency, currencies, rates };
          setConfig(cfg);
          setCurrencyGlobals(primaryCurrency, rates, currencies);
        }
      })
      .catch((err) => console.error("Failed to fetch currency config:", err))
      .finally(() => setLoading(false));
  }, []);

  // Detect user location: try Geolocation API then fall back to IP lookup.
  useEffect(() => {
    let canceled = false;

    async function postLocation(loc: UserLocation | null) {
      try {
        const res = await fetch('/api/users/location', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location: loc }),
        });
        if (!res.ok) return;
      } catch {
        // ignore network errors
      }
    }

    async function ipLookup() {
      try {
        const res = await fetch('/api/geolocation');
        if (!res.ok) return null;
        const d = await res.json();
        return {
          country: d.country_name,
          countryCode: d.country_code,
          region: d.region,
          city: d.city,
          latitude: d.latitude ? Number(d.latitude) : undefined,
          longitude: d.longitude ? Number(d.longitude) : undefined,
          timezone: d.timezone,
          currency: d.currency,
        } as UserLocation;
      } catch {
        return null;
      }
    }

    function saveAndApply(loc: UserLocation | null) {
      if (canceled) return;
      setUserLocation(loc);
      if (loc?.currency) {
        setUserCurrency((prev) => loc.currency || prev);
      } else if (loc?.countryCode) {
        // Map country code to currency if possible
        const map: Record<string, string> = {
          NG: 'NGN', US: 'USD', GB: 'GBP', GH: 'GHS', KE: 'KES', ZA: 'ZAR', CI: 'XOF', SN: 'XOF', RW: 'RWF', UG: 'UGX', TZ: 'TZS', FR: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR'
        };
        const cc = loc.countryCode.toUpperCase();
        if (map[cc]) setUserCurrency(map[cc]);
      }
      try {
        localStorage.setItem('userLocation', JSON.stringify(loc || {}));
      } catch {}
      postLocation(loc);
    }

    // First, try navigator geolocation for precise coords (user must grant permission)
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          // Reverse-geocode via Nominatim (no API key) - best-effort
          try {
            const rev = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            if (rev.ok) {
              const data = await rev.json();
              const loc = {
                country: data.address?.country,
                countryCode: data.address?.country_code?.toUpperCase(),
                region: data.address?.state || data.address?.region,
                city: data.address?.city || data.address?.town || data.address?.village,
                latitude: lat,
                longitude: lon,
                timezone: data.address?.timezone,
              } as UserLocation;
              // Try to fetch currency via ip fallback to get currency code
              const ipInfo = await ipLookup();
              if (ipInfo?.currency) loc.currency = ipInfo.currency;
              saveAndApply(loc);
              return;
            }
          } catch {
            // ignore and fall back to IP
          }
          const ipinfo = await ipLookup();
          saveAndApply(ipinfo);
        },
        async () => {
          const ipinfo = await ipLookup();
          saveAndApply(ipinfo);
        },
        { maximumAge: 1000 * 60 * 60, timeout: 5000 }
      );
    } else {
      // No geolocation support, fallback to IP lookup
      ipLookup().then((loc) => saveAndApply(loc));
    }

    // Try to hydrate from localStorage quickly
    try {
      const stored = localStorage.getItem('userLocation');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && !userLocation) {
          setUserLocation(parsed);
        }
      }
    } catch {}

    return () => {
      canceled = true;
    };
  }, []);

  const convertAmountFn = useCallback(
    (amount: number, toCurrency?: string): number => {
      const c = configRef.current;
      const to = toCurrency || userCurrency;
      return convertAmount(amount, c.primaryCurrency, to, c.rates);
    },
    [userCurrency],
  );

  const formatAmount = useCallback(
    (amount: number, opts?: { currency?: string; fromCurrency?: string; decimals?: number; noConvert?: boolean }): string => {
      const c = configRef.current;
      let value = amount;
      let targetCurrency = opts?.currency || userCurrency;
      if (!opts?.noConvert) {
        const from = opts?.fromCurrency || c.primaryCurrency;
        value = convertAmount(amount, from, targetCurrency, c.rates);
      }
      const dec = opts?.decimals ?? c.currencies[targetCurrency]?.decimals ?? 2;
      return formatAmountValue(value, targetCurrency, c.currencies, dec);
    },
    [userCurrency],
  );

  return (
    <CurrencyContext.Provider
      value={{ config, userCurrency, userLocation, formatAmount, convertAmount: convertAmountFn, loading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
