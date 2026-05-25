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
      .catch(() => {})
      .finally(() => setLoading(false));
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
      value={{ config, userCurrency, formatAmount, convertAmount: convertAmountFn, loading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
