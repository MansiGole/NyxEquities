"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  ShieldCheck,
  Cpu,
  Flame,
  FileText,
  ExternalLink,
} from "lucide-react";
import GlassNavbar from "@/components/GlassNavbar";
import SpreadMatrix from "@/components/SpreadMatrix";
import SimulationModal from "@/components/SimulationModal";
import VenusYieldModule from "@/components/VenusYieldModule";
import AgentFeed from "@/components/AgentFeed";
import { RWAToken } from "@/types/rwa";
import { SEED_RWA_TOKENS, fetchRWATokens } from "@/lib/binanceWeb3";

export default function DedicatedTerminalPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<RWAToken[]>(SEED_RWA_TOKENS);
  const [isFetching, setIsFetching] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("Initializing...");

  // Active Simulation Drawer Modal state
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<RWAToken>(SEED_RWA_TOKENS[0]);

  // Fetch live RWA data from Binance Web3 proxy route
  const loadRWATokens = useCallback(async () => {
    setIsFetching(true);
    try {
      const result = await fetchRWATokens();
      if (result && result.data && result.data.length > 0) {
        setTokens(result.data);
      }
      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn("Failed to fetch fresh RWA matrix:", err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadRWATokens();
  }, [loadRWATokens]);

  const handleOpenSimulation = (token: RWAToken) => {
    setSelectedToken(token);
    setIsSimModalOpen(true);
  };

  const highDriftCount = tokens.filter((t) => Math.abs(t.driftPct) > 0.5).length;
  const totalLiquidityUSD = tokens.reduce((acc, t) => {
    return (
      acc +
      t.issuers.bStocks.poolLiquidityUSD +
      t.issuers.Ondo.poolLiquidityUSD +
      t.issuers.xStocks.poolLiquidityUSD
    );
  }, 0);

  return (
    <div className="relative min-h-screen bg-[#080B11] text-[#F8FAFC] selection:bg-[#06B6D4] selection:text-[#080B11] font-sans overflow-x-hidden">
      {/* 1. Subtle Terminal Blueprint Grid & Glow: Essence of landing page grid without visual noise */}
      <div className="fixed inset-0 pointer-events-none terminal-grid z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent_70%)] z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_85%_55%,rgba(0,229,153,0.04),transparent_70%)] z-0" />

      {/* Unified Institutional Glass Navbar */}
      <GlassNavbar
        activeTab="terminal"
        onTabChange={(tab) => {
          if (tab === "landing") router.push("/landing");
          if (tab === "login") router.push("/login");
        }}
        walletBalanceUSDT={1448.0}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-7 animate-fade-in">
        {/* Institutional Terminal Banner */}
        <section className="relative rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] shadow-xl shadow-black/40 p-6 sm:p-8 overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#080B11]/80 border border-[#1E293B] text-xs text-[#00E599]">
                <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
                <span className="font-semibold">BSC Mainnet &bull; Chain 56</span>
                <span className="text-[#94A3B8]/60">|</span>
                <span className="text-[#06B6D4] font-medium">Spot Execution &bull; Zero-Revert</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
                Tokenized Equities &amp; Drift Terminal
              </h1>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Decentralized 24/7 off-hours yield scanner, pre-flight zero-revert simulation
                engine, and b402 pay-per-call micro-oracle on Binance Smart Chain.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-xs text-[#94A3B8]">
                <span className="px-3 py-1.5 rounded-full bg-[#080B11]/90 border border-[#1E293B] text-[#F8FAFC] flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Settlement: BSC 56</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#080B11]/90 border border-[#1E293B] text-[#F8FAFC] flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E599]" />
                  <span>MEV Protected Router</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#080B11]/90 border border-[#1E293B] text-[#94A3B8]">
                  Last Synced: <strong className="text-[#F8FAFC] font-mono">{lastSynced}</strong>
                </span>
              </div>
            </div>

            {/* Top Quick Action */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
              <button
                onClick={() => handleOpenSimulation(tokens[0])}
                className="px-5 py-3 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#00E599] text-[#080B11] font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,153,0.4)] flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Simulate Spot Swap ({tokens[0]?.ticker || "NVDA"})</span>
              </button>

              <button
                onClick={() => handleOpenSimulation(tokens[1] || tokens[0])}
                className="px-5 py-3 rounded-full bg-[#080B11]/90 hover:bg-[#131B2E] border border-[#1E293B] hover:border-[#06B6D4]/50 text-[#F8FAFC] font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Flame className="w-3.5 h-3.5 text-[#00E599]" />
                <span>Simulate TSLA Rebalance</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Sleek Single-Row Monospace Status Bar (Replaces 4 bulky stat cards) */}
        <div className="rounded-2xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] shadow-xl shadow-black/40 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
            <span className="text-[#94A3B8]">TRACKED LIQUIDITY:</span>
            <span className="text-[#F8FAFC] font-bold">${(totalLiquidityUSD / 1_000_000).toFixed(1)}M</span>
          </div>

          <span className="text-[#1E293B] hidden md:inline">|</span>

          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8]">ACTIVE DRIFT:</span>
            <span className="text-[#06B6D4] font-bold">{highDriftCount} ASSETS &gt;0.5%</span>
          </div>

          <span className="text-[#1E293B] hidden md:inline">|</span>

          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8]">PRE-FLIGHT:</span>
            <span className="text-[#00E599] font-bold">MEV PROTECTED</span>
          </div>

          <span className="text-[#1E293B] hidden md:inline">|</span>

          <div className="flex items-center space-x-2">
            <span className="text-[#94A3B8]">b402 RATE:</span>
            <span className="text-[#06B6D4] font-bold">0.005 USDT</span>
          </div>
        </div>

        {/* RWA Spread & Drift Matrix */}
        <SpreadMatrix
          tokens={tokens}
          isLoading={isFetching}
          onRefresh={loadRWATokens}
          onSimulateRebalance={handleOpenSimulation}
        />

        {/* Venus Protocol Weekend Yield Module */}
        <VenusYieldModule idleUsdtBalance={1448.0} />

        {/* b402 Pay-Per-Call Signal Micro-Oracle */}
        <AgentFeed />

        {/* DX Showcase Footer */}
        <div className="p-6 rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#94A3B8] shadow-xl shadow-black/40">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#080B11] border border-[#1E293B] flex items-center justify-center text-[#00E599]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-[#F8FAFC] text-sm font-semibold">
                Developer Experience (DX) &amp; Ecosystem Report
              </strong>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Detailed architectural evaluation of Binance Web3 API onboarding, weekend zero-volume behavior, and multi-issuer liquidity.
              </p>
            </div>
          </div>

          <a
            href="https://github.com/MansiGole/NyxEquities/blob/main/docs/DX_REPORT.md"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#080B11] hover:bg-[#131B2E] border border-[#1E293B] hover:border-[#00E599] text-[#00E599] text-xs font-semibold transition-colors inline-flex items-center space-x-1.5 self-start sm:self-auto flex-shrink-0"
          >
            <span>Read Full DX Report</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </main>

      <SimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        token={selectedToken}
        swapAmountUSD={2.0}
      />
    </div>
  );
}
