"use client";

import React from "react";
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Coins,
  ChevronRight,
  Sparkles,
  Search,
  Cpu,
  Layers,
} from "lucide-react";
import MiniSpreadPreview from "@/components/MiniSpreadPreview";
import Footer from "@/components/Footer";

interface LandingPageProps {
  onEnterTerminal: () => void;
  onOpenSimulation?: () => void;
  onEnterLogin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterTerminal,
  onOpenSimulation,
  onEnterLogin,
}) => {
  return (
    <div className="relative w-full text-[#F8FAFC] font-sans selection:bg-[#2563EB] selection:text-white overflow-hidden">
      {/* Background Square Grid matching reference screenshot */}
      <div className="absolute inset-0 pointer-events-none landing-grid landing-grid-mask opacity-90 z-0" />

      {/* Subtle ambient indigo-blue depth glow behind center grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full z-0" />

      {/* Glowing vertical light trails matching reference screenshot */}
      <div className="absolute top-24 left-[15%] w-[1.5px] h-32 bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-[0_0_10px_rgba(96,165,250,0.9)] pointer-events-none z-0" />
      <div className="absolute top-44 right-[14%] w-[1.5px] h-44 bg-gradient-to-b from-transparent via-blue-400 to-transparent shadow-[0_0_10px_rgba(96,165,250,0.9)] pointer-events-none z-0" />
      <div className="absolute top-96 right-[26%] w-[1.5px] h-24 bg-gradient-to-b from-transparent via-blue-500/70 to-transparent shadow-[0_0_8px_rgba(59,130,246,0.7)] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Top Product Announcement Pill (Clean, grounded, matches reference screenshot) */}
        <div
          onClick={onEnterTerminal}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0D121F]/80 border border-slate-800 text-xs text-slate-300 shadow-sm mb-6 hover:border-slate-700 transition-all cursor-pointer group"
        >
          <span className="font-medium text-white">Institutional Off-Hours Liquidity</span>
          <span className="text-slate-600">&bull;</span>
          <span className="text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
            BSC Mainnet
          </span>
          <span className="text-xs ml-0.5">✨</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </div>

        {/* Hero Title (Solid pure white geometric typography matching screenshot) */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.06]">
          Trade Tokenized Equities
          <span className="block mt-1 sm:mt-2">While TradFi Sleeps</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
          24/7 off-hours yield, delta-neutral drift execution, and zero-revert
          pre-flight simulation across bStocks, Ondo, and xStocks on BNB Chain.
        </p>

        {/* Hero CTA Buttons (Matches Reference Screenshot 1:1) */}
        <div className="mt-8 flex flex-row items-center justify-center gap-4">
          <button
            onClick={onEnterTerminal}
            className="px-7 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Launch Terminal</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>

          {onOpenSimulation ? (
            <button
              onClick={onOpenSimulation}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-3 px-4 cursor-pointer"
            >
              Simulate Swap &rarr;
            </button>
          ) : (
            <a
              href="https://github.com/MansiGole/NyxEquities/blob/main/docs/DX_REPORT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-3 px-4 cursor-pointer"
            >
              Learn more &rarr;
            </a>
          )}
        </div>

        {/* Live Protocol Key Figures */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-3xl pt-8 border-t border-slate-800/80 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-mono">$110M+</div>
            <div className="text-xs text-[#94A3B8] mt-1 font-medium">Tracked BSC Pool Depth</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00E599] font-mono">24 / 7</div>
            <div className="text-xs text-[#94A3B8] mt-1 font-medium">Continuous On-Chain Trading</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#06B6D4] font-mono">&lt; 0.5%</div>
            <div className="text-xs text-[#94A3B8] mt-1 font-medium">MEV Slippage Protection</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] font-mono">0.005 USDT</div>
            <div className="text-xs text-[#94A3B8] mt-1 font-medium">b402 Oracle Signal Fee</div>
          </div>
        </div>

        {/* Compact Real Mini-Terminal Preview (Replaces Empty Canvas) */}
        <div className="mt-14 w-full max-w-4xl">
          <MiniSpreadPreview onSimulate={onEnterTerminal} />
        </div>
      </section>

      {/* How NyxEquities Works: Sleek Horizontal 3-Step Linear Pipeline */}
      <section className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#06B6D4] tracking-wider uppercase px-3.5 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 inline-block font-mono">
            EXECUTION PIPELINE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
            How NyxEquities Works
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Three institutional steps from off-hours drift detection to zero-revert settlement.
          </p>
        </div>

        {/* 3-Step Horizontal Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting Line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] -translate-y-6 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-0" />

          {/* STEP 01: SCAN */}
          <div className="relative z-10 p-7 rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] shadow-xl shadow-black/40 hover:border-[#06B6D4]/50 hover:bg-[#131B2E]/90 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4]">
                STEP 01
              </span>
              <div className="w-10 h-10 rounded-2xl bg-[#080B11] border border-[#1E293B] flex items-center justify-center text-[#06B6D4] group-hover:scale-105 transition-transform shadow-sm">
                <Search className="w-5 h-5" />
              </div>
            </div>

            <h3 className="font-extrabold text-xl text-[#F8FAFC] tracking-tight">
              SCAN
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Ingests 24/7 off-hours price action across bStocks, Ondo, and xStocks via RWA Data API.
            </p>
          </div>

          {/* STEP 02: SIMULATE */}
          <div className="relative z-10 p-7 rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] shadow-xl shadow-black/40 hover:border-[#00E599]/50 hover:bg-[#131B2E]/90 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[#00E599]">
                STEP 02
              </span>
              <div className="w-10 h-10 rounded-2xl bg-[#080B11] border border-[#1E293B] flex items-center justify-center text-[#00E599] group-hover:scale-105 transition-transform shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <h3 className="font-extrabold text-xl text-[#F8FAFC] tracking-tight">
              SIMULATE
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Validates MEV protection, gas estimates (0.00042 BNB), and zero-revert routing using the Transaction API.
            </p>
          </div>

          {/* STEP 03: EXECUTE & HARVEST */}
          <div className="relative z-10 p-7 rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] shadow-xl shadow-black/40 hover:border-[#06B6D4]/50 hover:bg-[#131B2E]/90 transition-all space-y-4 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#06B6D4]/15 to-[#00E599]/15 border border-[#00E599]/30 text-[#00E599]">
                STEP 03
              </span>
              <div className="w-10 h-10 rounded-2xl bg-[#080B11] border border-[#1E293B] flex items-center justify-center text-[#00E599] group-hover:scale-105 transition-transform shadow-sm">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            <h3 className="font-extrabold text-xl text-[#F8FAFC] tracking-tight">
              EXECUTE &amp; HARVEST
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Auto-parks idle stablecoins in Venus Protocol (~6.8% APY) or dispatches spot rebalances.
            </p>
          </div>
        </div>
      </section>

      {/* Smooth Transition directly into Footer (Redundant Bottom CTA removed) */}
      <Footer />
    </div>
  );
};

export default LandingPage;
