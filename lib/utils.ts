/* ---------- module-level currency state ---------- */
let _primaryCurrency = "NGN";
let _rates: Record<string, number> = {};
let _currencies: Record<string, { symbol: string; name: string; decimals: number }> = {};

export function setCurrencyGlobals(
  primary: string,
  rates: Record<string, number>,
  currencies: Record<string, { symbol: string; name: string; decimals: number }>,
) {
  _primaryCurrency = primary;
  _rates = rates;
  _currencies = currencies;
}

export function getPrimaryCurrency() {
  return _primaryCurrency;
}

const DEFAULT_CURRENCY_LOCALE = "en-US";

export function formatCurrency(amount: number, currency?: string, locale?: string) {
  if (amount == null || isNaN(amount)) amount = 0;
  const cur = currency || _primaryCurrency || "NGN";
  const meta = _currencies[cur];
  const decimals = cur === "USDT" ? 2 : (meta?.decimals ?? (cur === "NGN" ? 0 : 2));
  const activeLocale = locale || DEFAULT_CURRENCY_LOCALE;

  try {
    return new Intl.NumberFormat(activeLocale, {
      style: "currency",
      currency: cur,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    const symbol = meta?.symbol || (cur === "NGN" ? "₦" : "$" );
    const formatted = Math.abs(amount).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
  }
}

export function formatDate(timestamp: number | string | Date, locale = "en-NG") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function formatDateTime(timestamp: number | string | Date, locale = "en-NG") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength)).trimEnd()}...`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateReference(prefix = "ref") {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${timestamp}-${random}`;
}

export function formatNumber(num: number): string {
  if (num == null || isNaN(num)) num = 0;
  return num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function formatPercentage(value: number, decimals: number = 1): string {
  if (value == null || isNaN(value)) value = 0;
  return `${(value * 100).toFixed(decimals)}%`;
}
