export type IssuerKey = "bStocks" | "Ondo" | "xStocks";

export interface IssuerQuote {
  price: number;
  poolLiquidityUSD: number;
  address: string;
  spreadPct: number;
}

export interface RWAToken {
  ticker: string;
  name?: string;
  tradFiRefPrice: number;
  issuers: Record<IssuerKey, IssuerQuote>;
  driftPct: number;
  recommendedRoute: IssuerKey;
  marketStatus: "OPEN" | "CLOSED";
  lastUpdated?: string;
}

export interface BinanceWeb3Response<T = RWAToken[]> {
  code: number;
  msg: string;
  data: T;
  timestamp?: number;
}

