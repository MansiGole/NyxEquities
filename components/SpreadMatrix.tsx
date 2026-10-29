"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  Zap,
  TrendingUp,
  Layers,
  Sparkles,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { RWAToken, IssuerKey } from "@/types/rwa";
import { cn } from "@/lib/utils";

interface SpreadMatrixProps {
  tokens: RWAToken[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onSimulateRebalance: (token: RWAToken) => void;
}

export const SpreadMatrix: React.FC<SpreadMatrixProps> = ({
  tokens,
  isLoading = false,
  onRefresh,
  onSimulateRebalance,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDriftOnly, setFilterDriftOnly] = useState(false);

  // Filter tokens based on search and drift filter
  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (token.name && token.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDrift = filterDriftOnly ? Math.abs(token.driftPct) > 0.5 : true;
    return matchesSearch && matchesDrift;
  });

  const formatUSD = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatLiquidity = (valUSD: number) => {
    if (valUSD >= 1_000_000) {
      return `$${(valUSD / 1_000_000).toFixed(1)}M`;
    }
    return `$${(valUSD / 1_000).toFixed(0)}K`;
  };

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const issuerList: IssuerKey[] = ["bStocks", "Ondo", "xStocks"];

  // Custom token badge styling
  const getTokenStyle = (ticker: string) => {
    if (ticker.includes("NVDA"))
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
    if (ticker.includes("TSLA"))
      return "bg-rose-500/10 text-rose-400 border-rose-500/25";
    if (ticker.includes("AAPL"))
      return "bg-sky-500/10 text-sky-400 border-sky-500/25";
    return "bg-amber-500/10 text-amber-400 border-amber-500/25";
  };

  return (
    <div className="w-full space-y-4 font-sans">
      {/* Matrix Controls & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] shadow-xl shadow-black/40">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#080B11] border border-[#1E293B] flex items-center justify-center text-[#06B6D4] shadow-md">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight">
                Off-Hours Drift &amp; Spread Matrix
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[#00E599]">
                Binance Web3 Verified
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Live on-chain synthetic pool quotes compared against Friday 16:00 TradFi close benchmarks
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search ticker or asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-2 rounded-xl bg-[#080B11] border border-[#1E293B] focus:border-[#06B6D4] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-none w-44 sm:w-52 transition-colors"
            />
          </div>

          {/* Drift Filter Toggle */}
          <button
            onClick={() => setFilterDriftOnly(!filterDriftOnly)}
            className={cn(
              "px-3.5 py-2 rounded-xl border text-xs font-medium transition-all flex items-center space-x-1.5",
              filterDriftOnly
                ? "bg-[#06B6D4]/20 border-[#06B6D4] text-[#06B6D4] font-semibold"
                : "bg-[#080B11] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
            )}
            title="Filter by active drift (> 0.5%)"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">&gt;0.5% Drift</span>
          </button>

          {/* Refresh Feed Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-[#080B11] hover:bg-[#131B2E] border border-[#1E293B] hover:border-[#06B6D4] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors disabled:opacity-50"
              title="Refresh Quotes"
            >
              <RefreshCw
                className={cn("w-4 h-4", isLoading && "animate-spin text-[#06B6D4]")}
              />
            </button>
          )}
        </div>
      </div>

      {/* Financial Matrix Table View */}
      <div className="w-full rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] overflow-hidden shadow-xl shadow-black/40">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[920px] text-left text-xs">
            <thead>
              <tr className="bg-[#080B11]/90 text-[#94A3B8] border-b border-slate-800/80 text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-4 px-6 w-52">Asset</th>
                <th className="py-4 px-6 w-40">TradFi Close</th>
                <th className="py-4 px-6">Multi-Issuer DEX Depth</th>
                <th className="py-4 px-6 w-36 text-center">Drift Spread</th>
                <th className="py-4 px-6 w-44 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#94A3B8]">
                    No tokenized equities match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((token) => {
                  const isHighDrift = Math.abs(token.driftPct) > 0.5;

                  return (
                    <tr
                      key={token.ticker}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      {/* Asset & Ticker */}
                      <td className="py-4 px-6 align-middle">
                        <div className="flex items-center space-x-3.5">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs border shadow-sm",
                              getTokenStyle(token.ticker)
                            )}
                          >
                            {token.ticker}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#F8FAFC]">
                              {token.ticker}
                            </div>
                            <div className="text-xs text-[#94A3B8] truncate max-w-[150px]">
                              {token.name}
                            </div>
                            <div className="text-[10px] text-[#00E599] font-medium mt-0.5 flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
                              <span>24/7 Trading</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* TradFi Reference Price */}
                      <td className="py-4 px-6 align-middle">
                        <div className="text-sm font-bold font-mono text-[#F8FAFC]">
                          {formatUSD(token.tradFiRefPrice)}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] mt-0.5">
                          Friday 16:00 Close
                        </div>
                        <div className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-[#94A3B8] font-medium">
                          NYSE Benchmark
                        </div>
                      </td>

                      {/* Multi-Issuer Price Cards (bStocks vs. Ondo vs. xStocks) */}
                      <td className="py-3 px-6 align-middle">
                        <div className="grid grid-cols-3 gap-2.5">
                          {issuerList.map((issuerKey) => {
                            const quote = token.issuers[issuerKey];
                            if (!quote) return null;

                            const isOptimal = token.recommendedRoute === issuerKey;
                            const isPositiveSpread = quote.spreadPct >= 0;

                            return (
                              <div
                                key={issuerKey}
                                className={cn(
                                  "relative p-3 rounded-2xl border transition-all text-left",
                                  isOptimal
                                    ? "bg-[#080B11] border-[#00E599]/60 shadow-[0_0_15px_rgba(0,229,153,0.15)]"
                                    : "bg-[#080B11]/70 border-white/10"
                                )}
                              >
                                {isOptimal && (
                                  <div className="absolute -top-2 right-2 px-2 py-0.5 bg-[#00E599] text-[#080B11] text-[9px] font-bold rounded-full flex items-center space-x-0.5 shadow-sm">
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>BEST ROUTE</span>
                                  </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                                  <span className="font-semibold text-[#F8FAFC]">
                                    {issuerKey}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-[11px] font-bold font-mono",
                                      isPositiveSpread
                                        ? "text-[#06B6D4]"
                                        : "text-amber-400"
                                    )}
                                  >
                                    {isPositiveSpread ? "+" : ""}
                                    {quote.spreadPct.toFixed(2)}%
                                  </span>
                                </div>

                                <div className="text-xs font-bold font-mono text-[#F8FAFC] mt-1">
                                  {formatUSD(quote.price)}
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-[#94A3B8] mt-1.5 pt-1.5 border-t border-white/[0.08]">
                                  <span>Liq: {formatLiquidity(quote.poolLiquidityUSD)}</span>
                                  <span
                                    title={quote.address}
                                    className="text-[9px] font-mono text-[#94A3B8]/70 hover:text-[#06B6D4] transition-colors"
                                  >
                                    {truncateAddress(quote.address)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Off-Hours Drift Indicator Pill */}
                      <td className="py-4 px-6 align-middle text-center">
                        <div
                          className={cn(
                            "inline-flex flex-col items-center px-3.5 py-2 rounded-2xl border text-xs font-bold font-mono",
                            isHighDrift
                              ? "bg-[#06B6D4]/15 border-[#06B6D4]/50 text-[#06B6D4] shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                              : "bg-[#00E599]/15 border-[#00E599]/40 text-[#00E599]"
                          )}
                        >
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>
                              {token.driftPct >= 0 ? "+" : ""}
                              {token.driftPct.toFixed(2)}%
                            </span>
                          </span>
                          <span className="text-[10px] font-sans font-medium mt-0.5 opacity-80">
                            {isHighDrift ? "Arb Opportunity" : "Tight Peg"}
                          </span>
                        </div>
                      </td>

                      {/* Action Button: Execute Rebalance */}
                      <td className="py-4 px-6 align-middle text-right">
                        <button
                          onClick={() => onSimulateRebalance(token)}
                          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-[#06B6D4]/20 to-[#00E599]/20 hover:from-[#06B6D4] hover:to-[#00E599] border border-[#06B6D4]/40 hover:border-transparent text-[#F8FAFC] hover:text-[#080B11] text-xs font-bold transition-all shadow-sm hover:shadow-[0_0_18px_rgba(0,229,153,0.4)] inline-flex items-center space-x-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Simulate Swap</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer Telemetry Bar */}
        <div className="bg-[#080B11]/90 border-t border-white/10 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#94A3B8]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#00E599]" />
            <span>
              Route optimizer automatically identifies deepest on-chain liquidity &amp; lowest spread.
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span>Router: <strong className="text-[#F8FAFC]">PancakeSwap v3</strong></span>
            <span className="text-white/20">&bull;</span>
            <span className="text-[#06B6D4]">Settlement: <strong className="text-[#F8FAFC]">BSC Chain 56</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadMatrix;
