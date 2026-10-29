import axios from "axios";
import { RWAToken, BinanceWeb3Response, IssuerKey, IssuerQuote } from "@/types/rwa";

/**
 * Baseline reference data for off-hours tokenized stock simulation.
 * TradFi prices represent Friday NYSE close benchmarks.
 */
export const SEED_RWA_TOKENS: RWAToken[] = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    tradFiRefPrice: 141.54,
    driftPct: 1.28,
    marketStatus: "CLOSED",
    recommendedRoute: "bStocks",
    issuers: {
      bStocks: {
        price: 143.35,
        poolLiquidityUSD: 14250000,
        address: "0x1b44f3514812d835eb1bdb0acb33d3fa3351ee43",
        spreadPct: 1.28,
      },
      Ondo: {
        price: 143.82,
        poolLiquidityUSD: 9840000,
        address: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
        spreadPct: 1.61,
      },
      xStocks: {
        price: 142.98,
        poolLiquidityUSD: 5210000,
        address: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
        spreadPct: 1.02,
      },
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    tradFiRefPrice: 249.25,
    driftPct: 2.15,
    marketStatus: "CLOSED",
    recommendedRoute: "bStocks",
    issuers: {
      bStocks: {
        price: 254.61,
        poolLiquidityUSD: 18450000,
        address: "0x892a0e41fd27e2cfb4715f33f6793f77df23aa0a",
        spreadPct: 2.15,
      },
      Ondo: {
        price: 255.48,
        poolLiquidityUSD: 8720000,
        address: "0x33b8a1c905b766ecad966d54cf8e24483a31da64",
        spreadPct: 2.5,
      },
      xStocks: {
        price: 253.95,
        poolLiquidityUSD: 4320000,
        address: "0x5c421712a32c2535794713a296b341fbe147e4eb",
        spreadPct: 1.89,
      },
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    tradFiRefPrice: 231.85,
    driftPct: 0.38,
    marketStatus: "CLOSED",
    recommendedRoute: "Ondo",
    issuers: {
      bStocks: {
        price: 232.84,
        poolLiquidityUSD: 22100000,
        address: "0x4e6b22b10ab874df1ae34efba936eb2a1492ba66",
        spreadPct: 0.43,
      },
      Ondo: {
        price: 232.73,
        poolLiquidityUSD: 15400000,
        address: "0x12d597818296eb4c7a52e92ecdf642fc0d86eef3",
        spreadPct: 0.38,
      },
      xStocks: {
        price: 233.15,
        poolLiquidityUSD: 6150000,
        address: "0x9812ba3c0e11899a1f26a1768840d4f264d1fce2",
        spreadPct: 0.56,
      },
    },
    lastUpdated: new Date().toISOString(),
  },
  {
    ticker: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    tradFiRefPrice: 585.12,
    driftPct: 0.65,
    marketStatus: "CLOSED",
    recommendedRoute: "bStocks",
    issuers: {
      bStocks: {
        price: 588.92,
        poolLiquidityUSD: 45800000,
        address: "0x789b78e225be3ad8d7f722a4d33eb43c94f57c5a",
        spreadPct: 0.65,
      },
      Ondo: {
        price: 589.65,
        poolLiquidityUSD: 28400000,
        address: "0x6f38ab955845c4ff80a6b57d07e609758cf27489",
        spreadPct: 0.77,
      },
      xStocks: {
        price: 588.24,
        poolLiquidityUSD: 11900000,
        address: "0x2e06180633b47be2d31f24d775ea6652e80c854b",
        spreadPct: 0.53,
      },
    },
    lastUpdated: new Date().toISOString(),
  },
];

/**
 * Calculates spread percentage relative to TradFi benchmark
 */
export function calculateSpreadPct(onChainPrice: number, refPrice: number): number {
  if (!refPrice || refPrice <= 0) return 0;
  return Number((((onChainPrice - refPrice) / refPrice) * 100).toFixed(2));
}

/**
 * Calculates the best issuer route based on highest liquidity and competitive price
 */
export function determineOptimalRoute(issuers: Record<IssuerKey, IssuerQuote>): IssuerKey {
  const keys: IssuerKey[] = ["bStocks", "Ondo", "xStocks"];
  let bestKey: IssuerKey = "bStocks";
  let bestScore = -Infinity;

  for (const k of keys) {
    const quote = issuers[k];
    if (!quote) continue;
    // Score combines liquidity depth with tight spread
    // Higher liquidity + lower absolute spread = better execution route
    const liquidityWeight = Math.log10(quote.poolLiquidityUSD || 1);
    const spreadPenalty = Math.abs(quote.spreadPct);
    const score = liquidityWeight * 2 - spreadPenalty;

    if (score > bestScore) {
      bestScore = score;
      bestKey = k;
    }
  }

  return bestKey;
}

/**
 * Fetches RWA tokens data from internal API route proxying Binance Web3 schema
 */
export async function fetchRWATokens(): Promise<BinanceWeb3Response<RWAToken[]>> {
  try {
    const response = await axios.get<BinanceWeb3Response<RWAToken[]>>("/api/rwa");
    return response.data;
  } catch (error) {
    console.warn("Falling back to local seed tokens due to API error:", error);
    return {
      code: 0,
      msg: "fallback_seed_data",
      data: SEED_RWA_TOKENS,
      timestamp: Date.now(),
    };
  }
}

