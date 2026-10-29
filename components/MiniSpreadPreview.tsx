"use client";

import React from "react";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MiniSpreadPreviewProps {
  onSimulate?: () => void;
}

interface PreviewRow {
  ticker: string;
  name: string;
  tradFi: string;
  bStocks: string;
  ondo: string;
  drift: string;
  isHighDrift: boolean;
}

const PREVIEW_DATA: PreviewRow[] = [
  {
    ticker: "NVDA",
    name: "NVIDIA Corp",
    tradFi: "$141.54",
    bStocks: "$142.20",
    ondo: "$141.85",
    drift: "+0.63%",
    isHighDrift: true,
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc",
    tradFi: "$249.75",
    bStocks: "$254.62",
    ondo: "$251.40",
    drift: "+1.95%",
    isHighDrift: true,
  },
  {
    ticker: "AAPL",
    name: "Apple Inc",
    tradFi: "$231.85",
    bStocks: "$232.10",
    ondo: "$232.05",
    drift: "+0.10%",
    isHighDrift: false,
  },
];

export const MiniSpreadPreview: React.FC<MiniSpreadPreviewProps> = ({
  onSimulate,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] p-4 sm:p-6 shadow-xl shadow-black/40 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] animate-pulse" />
          <h3 className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#F8FAFC]">
            LIVE RWA SPREAD PREVIEW (BSC MAINNET // CHAIN ID 56)
          </h3>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono text-[#94A3B8]">
          <span className="text-[#06B6D4]">DEX SPREAD SCANNER</span>
          <span>&bull;</span>
          <span className="text-[#00E599]">24/7 ACTIVE</span>
        </div>
      </div>

      {/* 3-Row Clean Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[680px] text-left text-xs font-sans">
          <thead>
            <tr className="text-[#94A3B8] text-[11px] font-mono uppercase tracking-wider border-b border-slate-800/80">
              <th className="py-2.5 px-4">Asset</th>
              <th className="py-2.5 px-4">TradFi Close</th>
              <th className="py-2.5 px-4">bStocks Quote</th>
              <th className="py-2.5 px-4">Ondo Quote</th>
              <th className="py-2.5 px-4 text-center">Drift Spread</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {PREVIEW_DATA.map((row) => (
              <tr
                key={row.ticker}
                className="hover:bg-white/[0.03] transition-colors group"
              >
                {/* Asset */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#080B11] border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-[#06B6D4]">
                      {row.ticker}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#F8FAFC]">
                        {row.ticker}
                      </div>
                      <div className="text-[11px] text-[#94A3B8]">{row.name}</div>
                    </div>
                  </div>
                </td>

                {/* TradFi Benchmark */}
                <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#F8FAFC]">
                  {row.tradFi}
                  <div className="text-[10px] text-[#94A3B8] font-sans font-normal">
                    Friday 16:00
                  </div>
                </td>

                {/* bStocks */}
                <td className="py-3.5 px-4 font-mono text-xs text-[#F8FAFC]">
                  <span className="font-bold">{row.bStocks}</span>
                  <div className="text-[10px] text-[#06B6D4] font-sans font-medium">
                    bStocks BSC
                  </div>
                </td>

                {/* Ondo */}
                <td className="py-3.5 px-4 font-mono text-xs text-[#F8FAFC]">
                  <span className="font-bold">{row.ondo}</span>
                  <div className="text-[10px] text-[#94A3B8] font-sans font-medium">
                    Ondo Global
                  </div>
                </td>

                {/* Drift Spread */}
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold border",
                      row.isHighDrift
                        ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                        : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                    )}
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>{row.drift}</span>
                  </span>
                </td>

                {/* Quick Action Link */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      toast.info(`Opening Pre-Flight Simulation for ${row.ticker}...`, {
                        description: "Analyzing off-hours multi-issuer route on BSC Chain 56",
                        id: "preview-sim",
                      });
                      onSimulate?.();
                    }}
                    className="inline-flex items-center space-x-1 text-xs font-medium text-blue-400 hover:text-white transition-colors group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Simulate in Terminal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MiniSpreadPreview;

