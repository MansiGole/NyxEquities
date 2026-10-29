"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useBalance, useDisconnect, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { formatUnits } from "viem";
import { toast } from "sonner";
import { getMarketStatus, MarketStatus } from "@/lib/marketHours";
import {
  Server,
  CircleDot,
  Moon,
  Sun,
  Clock,
  LogOut,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GlassNavbarProps {
  activeTab?: "landing" | "terminal" | "login";
  onTabChange?: (tab: "landing" | "terminal" | "login") => void;
  onNavigateSection?: (sectionId: string) => void;
  walletBalanceUSDT?: number;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  activeTab = "landing",
  onTabChange,
  onNavigateSection,
  walletBalanceUSDT = 1448.0,
}) => {
  const { address, isConnected, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { data: bnbBalance } = useBalance({
    address: address,
    chainId: bsc.id,
  });

  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [showWalletMenu, setShowWalletMenu] = useState<boolean>(false);

  // Dynamic NYSE Wall Street Market Engine
  useEffect(() => {
    const updateEngine = () => {
      setMarketStatus(getMarketStatus());
    };

    updateEngine();
    const interval = setInterval(updateEngine, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web3 Connection Toast Notification
  useEffect(() => {
    if (isConnected && address) {
      toast.success(`Wallet Connected: ${address.slice(0, 6)}...${address.slice(-4)}`, {
        description: "Connected to BSC Mainnet (Chain ID 56)",
        id: "wallet-connected",
      });
    }
  }, [isConnected, address]);

  const handleSwitchToBSC = async () => {
    if (switchChain) {
      try {
        await switchChain({ chainId: bsc.id });
        toast.success("Switched network to BSC Mainnet (Chain 56)", {
          id: "chain-switch",
        });
      } catch (err: any) {
        toast.error("Network switch was dismissed or failed");
      }
    }
  };

  const handleBrandClick = () => {
    if (onTabChange) {
      onTabChange("landing");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTerminalClick = () => {
    if (onTabChange) {
      if (activeTab === "terminal") {
        onTabChange("landing");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        onTabChange("terminal");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed top-4 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <nav className="relative rounded-full bg-[#0D121F]/85 backdrop-blur-2xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.65)] px-5 sm:px-7 py-2.5 flex items-center justify-between transition-all">
          
          {/* 1. LEFT: Clean Brand Logo nyxequities. + Nav Links (Markets, Venus Earn, b402 Oracle) */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Clean Typographic Logo without diagonal arrow circle */}
            <Link
              href="/"
              onClick={(e) => {
                if (onTabChange) {
                  e.preventDefault();
                  handleBrandClick();
                }
              }}
              className="cursor-pointer select-none flex items-center space-x-1 text-lg sm:text-xl font-bold tracking-tight text-[#F8FAFC] hover:opacity-90 transition-opacity"
            >
              <span>nyxequities</span>
              <span className="text-[#06B6D4]">.</span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center space-x-1 sm:space-x-2 text-xs font-medium text-[#94A3B8]">
              <button
                onClick={() => {
                  onTabChange?.("terminal");
                  onNavigateSection?.("markets");
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors hover:text-[#F8FAFC]",
                  activeTab === "terminal"
                    ? "text-[#00E599] font-semibold bg-[#00E599]/10"
                    : "text-[#94A3B8]"
                )}
              >
                Markets
              </button>

              <button
                onClick={() => {
                  onTabChange?.("terminal");
                  setTimeout(() => {
                    document
                      .getElementById("venus-yield-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 120);
                }}
                className="px-3 py-1.5 rounded-full transition-colors hover:text-[#F8FAFC]"
              >
                Venus Earn
              </button>

              <button
                onClick={() => {
                  onTabChange?.("terminal");
                  setTimeout(() => {
                    document
                      .getElementById("agent-feed-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 120);
                }}
                className="hidden lg:inline-flex px-3 py-1.5 rounded-full transition-colors hover:text-[#F8FAFC]"
              >
                b402 Oracle
              </button>
            </div>
          </div>

          {/* 2. CENTER: Market Status Ribbon (NYSE: OPEN / CLOSED with Dynamic Countdown) */}
          <div className="hidden lg:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#080B11]/90 border border-white/10 text-xs text-[#94A3B8]">
            {marketStatus?.isOpen ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#00E599]" />
            )}
            <span className="font-mono text-[11px] font-semibold">
              NYSE:{" "}
              <span className={marketStatus?.isOpen ? "text-amber-400" : "text-[#00E599]"}>
                {marketStatus?.isOpen ? "OPEN" : "CLOSED"}
              </span>
            </span>
            <span className="text-[10px] text-[#94A3B8] font-mono hidden xl:inline">
              ({marketStatus?.isOpen ? "Regular Trading" : "Off-Hours Yield Active"})
            </span>
            {marketStatus && (
              <span className="font-mono text-[11px] text-[#06B6D4] pl-1.5 border-l border-[#1E293B]">
                {marketStatus.countdownText}
              </span>
            )}
            {marketStatus && (
              <span className="font-mono text-[10px] text-[#94A3B8]/80 pl-1.5 border-l border-[#1E293B]">
                {marketStatus.timeString}
              </span>
            )}
          </div>

          {/* 3. RIGHT: Network tag (BSC 56), Wallet Pill, and [ Launch Terminal ] button */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 text-xs relative">
            {/* Network Tag / Switch to BSC */}
            {isConnected && chainId && chainId !== bsc.id ? (
              <button
                onClick={handleSwitchToBSC}
                className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-colors font-medium text-xs flex items-center space-x-1.5"
                title="Wrong chain detected. Click to switch to BSC Mainnet"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Switch to BSC</span>
              </button>
            ) : (
              <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#080B11]/80 border border-white/10 text-[#94A3B8]">
                <Server className="w-3 h-3 text-[#06B6D4]" />
                <span>BSC</span>
                <span className="font-semibold text-[#F8FAFC]">56</span>
                <CircleDot className="w-2.5 h-2.5 text-[#00E599] animate-pulse" />
              </div>
            )}

            {/* Wallet Address Pill (Real Web3 Account or Demo) */}
            <div className="relative">
              <div
                onClick={() => {
                  if (isConnected) {
                    setShowWalletMenu(!showWalletMenu);
                  } else {
                    onTabChange?.("login");
                  }
                }}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#080B11] border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
                title={isConnected ? `Connected: ${address}` : "Connect Web3 Wallet"}
              >
                <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-[#00E599]" : "bg-cyan-400 animate-pulse")} />
                <span className="font-mono text-[11px] text-[#F8FAFC] hidden sm:inline">
                  {isConnected && address
                    ? `${address.slice(0, 6)}...${address.slice(-4)}`
                    : "0x71C...498F"}
                </span>
                <span className="text-[#94A3B8] hidden md:inline">|</span>
                <span className="text-[#00E599] font-mono font-semibold">
                  {isConnected && bnbBalance
                    ? `${Number(formatUnits(bnbBalance.value, bnbBalance.decimals)).toFixed(3)} BNB`
                    : `$${walletBalanceUSDT.toFixed(0)} USDT`}
                </span>
                {isConnected && (
                  <ChevronDown className="w-3 h-3 text-[#94A3B8] ml-0.5" />
                )}
              </div>

              {/* Connected Wallet Dropdown Menu */}
              {showWalletMenu && isConnected && (
                <div className="absolute right-0 top-10 mt-2 w-64 rounded-2xl bg-[#0D121F] border border-[#1E293B] shadow-2xl p-3 z-50 text-xs space-y-2 animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-[#080B11] border border-slate-800">
                    <div className="text-[10px] text-[#94A3B8] uppercase font-mono">Connected Account</div>
                    <div className="font-mono text-[11px] text-[#F8FAFC] font-bold break-all mt-0.5">{address}</div>
                    <div className="text-[11px] text-[#00E599] font-mono mt-1">
                      {bnbBalance ? `${formatUnits(bnbBalance.value, bnbBalance.decimals).slice(0, 7)} BNB` : "BSC Mainnet"}
                    </div>
                  </div>

                  <a
                    href={`https://bscscan.com/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] text-[#94A3B8] hover:text-white transition-colors flex items-center justify-between text-xs"
                  >
                    <span>View on BscScan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      disconnect();
                      setShowWalletMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex items-center justify-between text-xs font-semibold"
                  >
                    <span>Disconnect Wallet</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Single Primary Action Button: Launch Terminal */}
            <button
              onClick={handleTerminalClick}
              className="px-4 sm:px-5 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-xs sm:text-sm shadow-sm hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <span>{activeTab === "terminal" ? "Overview" : "Launch Terminal"}</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default GlassNavbar;
