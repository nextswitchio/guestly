import Link from "next/link";

function WalletIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 10h20" /><circle cx="17" cy="14.5" r="1" />
    </svg>
  );
}

function BitcoinIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
    </svg>
  );
}

function USDTIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.949 9.684h-3.897v1.779c1.656.088 2.888.35 2.888.664 0 .314-1.232.576-2.888.664v4.896h-2.104v-4.896c-1.656-.088-2.888-.35-2.888-.664 0-.314 1.232-.576 2.888-.664V9.684H7.051V7.896h10.898v1.788zm-5.949-.664V7.241h3.897v1.779h-3.897z"/>
    </svg>
  );
}

type CryptoBalance = {
  symbol: 'USDT' | 'BTC';
  amount: number;
  usdValue: number;
  conversionRate: number;
};

type WalletCardProps = {
  balance: number;
  promoBalance?: number;
  loading?: boolean;
  cryptoBalances?: CryptoBalance[];
  totalPortfolioValue?: number;
};

export default function WalletCard({ balance, promoBalance = 0, loading, cryptoBalances = [], totalPortfolioValue }: WalletCardProps) {
  const hasCrypto = cryptoBalances.length > 0;
  const hasPromo = promoBalance > 0;
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-dark p-6 text-white shadow-lg">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-lime/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/[0.03] blur-2xl" />
      <div className="pointer-events-none absolute top-1/3 right-1/3 h-px w-24 bg-gradient-to-r from-transparent via-lime/20 to-transparent" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-white/70">
          <WalletIcon />
          <span className="text-sm font-medium">Guestly Wallet</span>
        </div>

        {/* Fiat Balance - Always Prominent */}
        <p className="mt-4 text-sm font-medium text-white/50">USD Balance</p>
        <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
          {loading ? (
            <span className="inline-block h-12 w-40 animate-pulse rounded-lg bg-white/20" />
          ) : (
            `${balance.toFixed(2)}`
          )}
        </p>

        {/* Promo Balance - Show when available */}
        {hasPromo && !loading && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-lime/10 border border-lime/20 px-3 py-2">
            <svg className="h-4 w-4 text-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-medium text-lime/80">Promo Credits</p>
              <p className="text-lg font-bold tabular-nums text-white">
                ${promoBalance.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Total Portfolio Value - When crypto exists */}
        {hasCrypto && totalPortfolioValue !== undefined && !loading && (
          <div className="mt-3">
            <p className="text-xs font-medium text-white/50">Total Portfolio Value</p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-white">
              ${totalPortfolioValue.toFixed(2)}
            </p>
          </div>
        )}

        {/* Crypto Breakdown */}
        {hasCrypto && !loading && (
          <div className="mt-4 space-y-2 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            {cryptoBalances.map((crypto) => (
              <div key={crypto.symbol} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  {crypto.symbol === 'BTC' ? <BitcoinIcon /> : <USDTIcon />}
                  <span className="text-white/80">{crypto.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums">
                    {crypto.amount.toFixed(crypto.symbol === 'BTC' ? 8 : 2)} {crypto.symbol}
                  </div>
                  <div className="text-xs text-white/50">
                    ≈ ${crypto.usdValue.toFixed(2)} USD
                  </div>
                </div>
              </div>
            ))}
            
            {/* Live Conversion Rates */}
            <div className="mt-2 border-t border-white/10 pt-2">
              <div className="flex items-center justify-between text-xs text-white/50">
                <div className="flex items-center gap-1">
                  <svg className="h-3 w-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Live rates</span>
                </div>
                <div className="flex gap-3 font-medium">
                  {cryptoBalances.map((crypto) => (
                    <span key={crypto.symbol}>
                      {crypto.symbol} ${crypto.conversionRate.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/wallet/add"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-dark shadow-sm transition hover:bg-lime hover:text-dark"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
            Add Money
          </Link>
          <Link
            href="/wallet/transactions"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            History
          </Link>
        </div>
      </div>
    </div>
  );
}
