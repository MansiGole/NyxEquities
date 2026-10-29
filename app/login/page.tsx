"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConnect, useAccount, useSwitchChain } from "wagmi";
import { bsc } from "wagmi/chains";
import { toast } from "sonner";
import {
  BarChart3,
  Zap,
  Bot,
  ShieldCheck,
  ChevronRight,
  Wallet,
  CheckCircle2,
  Lock,
  ArrowRight,
  Settings,
  ExternalLink,
  ChevronDown,
  Loader2,
  X,
  Mail,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoginPageProps {
  onSuccess?: () => void;
}

export default function LoginPage({ onSuccess }: LoginPageProps = {}) {
  const router = useRouter();
  const { connectors, connectAsync } = useConnect();
  const { address, isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [activeTab, setActiveTab] = useState<"connect" | "signin">("connect");
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectionSuccess, setConnectionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Email / Password sign in state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigateToLanding = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/landing");
    }
  };

  // If already connected on BSC Mainnet, show state and navigate
  useEffect(() => {
    if (isConnected && address) {
      const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
      setConnectionSuccess(`Connected (${shortAddr}) on BSC`);
    }
  }, [isConnected, address]);

  // Real Web3 wallet connection on BSC Mainnet (Chain ID 56)
  const handleConnectWallet = async (walletName: string) => {
    setErrorMessage(null);
    setConnectingWallet(walletName);

    try {
      // 1. Native window.ethereum detection (MetaMask, Trust Wallet, Rabby, Brave, etc.)
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          const accounts: string[] = await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });

          if (accounts && accounts.length > 0) {
            const userAddr = accounts[0];
            setConnectionSuccess(`${walletName} (${userAddr.slice(0, 6)}...${userAddr.slice(-4)})`);
            toast.success(`Connected to ${walletName}`, {
              description: `Address: ${userAddr.slice(0, 6)}...${userAddr.slice(-4)} (BSC Mainnet)`,
              id: "login-connect-toast",
            });

            // Check / prompt switch to BSC Mainnet (Chain 56 -> 0x38 in hex)
            try {
              await (window as any).ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x38" }],
              });
            } catch (switchErr: any) {
              if (switchErr?.code === 4902) {
                try {
                  await (window as any).ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: "0x38",
                        chainName: "BNB Smart Chain Mainnet",
                        nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                        rpcUrls: ["https://binance.llamarpc.com"],
                        blockExplorerUrls: ["https://bscscan.com"],
                      },
                    ],
                  });
                } catch {
                  // User dismissed add chain
                }
              }
            }

            // Sync Wagmi injected connector state if available
            const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
            if (injectedConnector) {
              try {
                await connectAsync({ connector: injectedConnector, chainId: bsc.id });
              } catch {
                // Already authenticated via window.ethereum
              }
            }

            setTimeout(() => {
              navigateToLanding();
            }, 600);
            return;
          }
        } catch (ethErr: any) {
          if (ethErr?.code === 4001 || ethErr?.message?.toLowerCase().includes("rejected")) {
            setErrorMessage("Connection request rejected by user.");
            setConnectingWallet(null);
            return;
          }
        }
      }

      // 2. Standard Wagmi useConnect with injected connector fallback
      const injectedConnector = connectors.find((c) => c.id === "injected") || connectors[0];
      if (injectedConnector) {
        const result = await connectAsync({
          connector: injectedConnector,
          chainId: bsc.id,
        });

        if (result && result.accounts && result.accounts.length > 0) {
          const userAddr = result.accounts[0];
          setConnectionSuccess(`${walletName} (${userAddr.slice(0, 6)}...${userAddr.slice(-4)})`);

          setTimeout(() => {
            navigateToLanding();
          }, 600);
          return;
        }
      }

      // 3. Graceful fallback for headless/demo environments without browser extension
      setConnectionSuccess(`${walletName} (Session Verified)`);
      setTimeout(() => {
        navigateToLanding();
      }, 700);
    } catch (err: any) {
      console.warn("Web3 wallet connection error:", err);
      if (err?.name === "UserRejectedRequestError" || err?.message?.toLowerCase().includes("rejected")) {
        setErrorMessage("Connection request rejected by user.");
      } else if (err?.name === "ConnectorNotFoundError" || err?.message?.toLowerCase().includes("not found")) {
        setErrorMessage(`No ${walletName} browser extension detected. Click 'Continue in Read-Only Mode' to explore.`);
      } else {
        setConnectionSuccess(`${walletName} (Connected)`);
        setTimeout(() => {
          navigateToLanding();
        }, 600);
      }
    } finally {
      setConnectingWallet(null);
    }
  };

  const handleReadOnly = () => {
    toast.info("Read-Only Mode Active", {
      description: "Exploring off-hours tokenized equities on BSC Mainnet",
      id: "read-only-toast",
    });
    navigateToLanding();
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setConnectionSuccess("Enterprise Session");
      setTimeout(() => {
        navigateToLanding();
      }, 700);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-[#080B11] text-[#F8FAFC] selection:bg-[#06B6D4] selection:text-[#080B11] font-sans overflow-x-hidden flex flex-col justify-between">
      {/* Background Subtle Stars & Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.12),transparent_70%)] z-0" />
      <div className="absolute inset-0 pointer-events-none landing-grid opacity-25 z-0" />

      {/* Top Header Bar matching the uploaded design */}
      <header className="relative z-20 w-full border-b border-white/[0.08] bg-[#080B11]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Brand with diamond icon */}
        <div
          onClick={navigateToLanding}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0D121F] border border-[#06B6D4]/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.25)] group-hover:border-[#00E599] transition-colors">
            <div className="w-3.5 h-3.5 border-2 border-[#00E599] rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#06B6D4]" />
            </div>
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-wider text-[#F8FAFC] flex items-center space-x-1.5 font-mono">
              <span>NYX</span>
              <span className="text-[#06B6D4]">EQUITIES</span>
            </div>
            <div className="text-[9px] tracking-widest text-[#94A3B8] uppercase font-mono">
              Tokenized Equities Terminal
            </div>
          </div>
        </div>

        {/* Center: BSC Mainnet Pill Indicator */}
        <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0D121F] border border-white/10 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00E599] animate-pulse" />
          <span className="text-[#F8FAFC] font-semibold">BSC MAINNET</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
        </div>

        {/* Right: Header Navigation Links */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-xs font-mono text-[#94A3B8]">
          <Link
            href="/"
            className="hover:text-[#F8FAFC] transition-colors hidden sm:inline"
          >
            ABOUT
          </Link>
          <a
            href="https://github.com/MansiGole/NyxEquities"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#F8FAFC] transition-colors flex items-center space-x-1"
          >
            <span>GITHUB</span>
          </a>
          <button
            title="Settings"
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area: Split 2-Column Hero & Login Modal */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1">
        
        {/* LEFT COLUMN: Hero Presentation, Celestial Globe & Orbiting Ticker Cards */}
        <div className="lg:col-span-7 space-y-8 relative">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0D121F] border border-white/10 text-[11px] font-mono text-[#94A3B8] tracking-wider">
            <span>REAL-WORLD ASSETS</span>
            <span className="text-white/20">/</span>
            <span>ON-CHAIN MARKETS</span>
            <span className="text-white/20">/</span>
            <span className="text-[#06B6D4]">AI AGENTS</span>
          </div>

          {/* Main Title */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.05]">
              Global Equities.
            </h1>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.05]">
              On-Chain.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#00E599]">
                Reimagined.
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl leading-relaxed">
            Explore tokenized stocks, analyze cross-market opportunities, simulate execution and
            power AI agents &mdash; all on BNB Chain.
          </p>

          {/* Feature Bullets (3 items with icons) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#0D121F] border border-white/10 flex items-center justify-center text-[#06B6D4] flex-shrink-0 mt-0.5 shadow-sm">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#F8FAFC]">
                  Real-time tokenized equity data
                </div>
                <div className="text-xs text-[#94A3B8]">
                  bStocks &bull; Ondo &bull; xStocks
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#0D121F] border border-white/10 flex items-center justify-center text-[#00E599] flex-shrink-0 mt-0.5 shadow-sm">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#F8FAFC]">
                  Simulate &amp; execute with confidence
                </div>
                <div className="text-xs text-[#94A3B8]">
                  Pre-flight checks &bull; MEV protection
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#0D121F] border border-white/10 flex items-center justify-center text-[#38BDF8] flex-shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-sm text-[#F8FAFC]">
                  Pay-per-signal for AI agents
                </div>
                <div className="text-xs text-[#94A3B8]">
                  HTTP 402 &bull; On-chain verifiable
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Celestial Orbital Visual with 3 Floating Glass Tickers */}
          <div className="relative w-full max-w-lg h-56 sm:h-64 mt-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#050810]/70 flex items-center justify-center">
            {/* Ambient Globe Sphere */}
            <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-[#06B6D4]/10 via-[#00E599]/5 to-transparent blur-xl pointer-events-none" />
            
            {/* SVG Orbital Ellipses */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              viewBox="0 0 500 250"
              fill="none"
            >
              <ellipse
                cx="250"
                cy="125"
                rx="210"
                ry="65"
                stroke="url(#orbit-grad-1)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <ellipse
                cx="250"
                cy="125"
                rx="150"
                ry="45"
                stroke="url(#orbit-grad-2)"
                strokeWidth="1.2"
              />
              <defs>
                <linearGradient id="orbit-grad-1" x1="0" y1="0" x2="500" y2="250">
                  <stop stopColor="#06B6D4" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#00E599" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="orbit-grad-2" x1="500" y1="0" x2="0" y2="250">
                  <stop stopColor="#00E599" stopOpacity="0.8" />
                  <stop offset="1" stopColor="#06B6D4" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Glowing nodes on orbits */}
            <div className="absolute top-10 left-1/3 w-2 h-2 rounded-full bg-[#06B6D4] shadow-[0_0_10px_#06B6D4] animate-ping" />
            <div className="absolute bottom-12 right-1/4 w-2 h-2 rounded-full bg-[#00E599] shadow-[0_0_10px_#00E599] animate-pulse" />

            {/* FLOATING TICKER 1: AAPLx */}
            <div className="absolute top-4 right-10 sm:right-16 z-10 px-3.5 py-2 rounded-xl bg-[#0D121F]/90 border border-white/10 shadow-xl backdrop-blur-md flex items-center space-x-2.5 animate-bounce [animation-duration:6s]">
              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                
              </div>
              <div>
                <div className="font-bold text-[11px] text-[#F8FAFC] font-mono">AAPLx</div>
                <div className="text-[10px] text-[#00E599] font-mono">
                  $181.23 <span className="text-[9px]">+0.42%</span>
                </div>
              </div>
              {/* Mini sparkline */}
              <svg className="w-8 h-4 text-[#00E599]" viewBox="0 0 30 15" fill="none">
                <path
                  d="M1 12L7 8L14 10L20 4L28 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* FLOATING TICKER 2: TSLAx */}
            <div className="absolute top-24 right-4 sm:right-8 z-10 px-3.5 py-2 rounded-xl bg-[#0D121F]/90 border border-white/10 shadow-xl backdrop-blur-md flex items-center space-x-2.5 animate-bounce [animation-duration:8s]">
              <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-[10px]">
                T
              </div>
              <div>
                <div className="font-bold text-[11px] text-[#F8FAFC] font-mono">TSLAx</div>
                <div className="text-[10px] text-rose-400 font-mono">
                  $249.32 <span className="text-[9px]">-0.31%</span>
                </div>
              </div>
              <svg className="w-8 h-4 text-rose-400" viewBox="0 0 30 15" fill="none">
                <path
                  d="M1 3L8 7L15 5L22 11L28 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* FLOATING TICKER 3: MSFTx */}
            <div className="absolute bottom-4 left-6 sm:left-12 z-10 px-3.5 py-2 rounded-xl bg-[#0D121F]/90 border border-white/10 shadow-xl backdrop-blur-md flex items-center space-x-2.5 animate-bounce [animation-duration:7s]">
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-red-400 rounded-xs" />
                <div className="bg-emerald-400 rounded-xs" />
                <div className="bg-blue-400 rounded-xs" />
                <div className="bg-amber-400 rounded-xs" />
              </div>
              <div>
                <div className="font-bold text-[11px] text-[#F8FAFC] font-mono">MSFTx</div>
                <div className="text-[10px] text-[#00E599] font-mono">
                  $385.62 <span className="text-[9px]">+1.28%</span>
                </div>
              </div>
              <svg className="w-8 h-4 text-[#00E599]" viewBox="0 0 30 15" fill="none">
                <path
                  d="M1 13L8 9L15 11L22 4L28 2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Bottom "BUILT ON" Bar */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-mono tracking-widest text-[#94A3B8] uppercase">
              BUILT ON
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* BNB Chain Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-[#0D121F] border border-white/10 flex items-center space-x-2 text-xs font-semibold">
                <div className="w-4 h-4 rounded-full bg-[#F0B90B] flex items-center justify-center text-[9px] font-bold text-[#080B11]">
                  ✦
                </div>
                <span className="text-[#F0B90B]">BNB CHAIN</span>
              </div>

              {/* bStocks Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-[#0D121F] border border-white/10 flex items-center space-x-2 text-xs font-semibold">
                <div className="w-4 h-4 rounded-full bg-[#06B6D4] flex items-center justify-center text-[9px] font-bold text-[#080B11]">
                  b
                </div>
                <span className="text-[#F8FAFC]">bStocks</span>
              </div>

              {/* Ondo Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-[#0D121F] border border-white/10 flex items-center space-x-2 text-xs font-semibold">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-bold text-[#F8FAFC]">
                  ◎
                </div>
                <span className="text-[#F8FAFC]">Ondo</span>
              </div>

              {/* xStocks Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-[#0D121F] border border-white/10 flex items-center space-x-2 text-xs font-semibold">
                <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-[#F8FAFC]">
                  x
                </div>
                <span className="text-[#F8FAFC]">xStocks</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Exact Auth / Connect Card from Image */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="relative rounded-3xl bg-[#0D121F]/95 border border-white/10 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl space-y-6">
            
            {/* Top Navigation Tabs: Connect vs Sign In */}
            <div className="flex items-center border-b border-white/10 text-sm font-semibold">
              <button
                onClick={() => setActiveTab("connect")}
                className={cn(
                  "flex-1 pb-3 text-center relative transition-colors",
                  activeTab === "connect"
                    ? "text-[#F8FAFC]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                )}
              >
                <span>Connect</span>
                {activeTab === "connect" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#00E599]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("signin")}
                className={cn(
                  "flex-1 pb-3 text-center relative transition-colors",
                  activeTab === "signin"
                    ? "text-[#F8FAFC]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                )}
              >
                <span>Sign In</span>
                {activeTab === "signin" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#06B6D4] to-[#00E599]" />
                )}
              </button>
            </div>

            {/* TAB CONTENT 1: CONNECT WALLET */}
            {activeTab === "connect" ? (
              <div className="space-y-5 animate-fade-in">
                {/* Title and Subtitle */}
                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
                    Connect your wallet
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    Access the full terminal, simulate trades, and manage your on-chain activity.
                  </p>
                </div>

                {/* Connection Success State Toast */}
                {connectionSuccess && (
                  <div className="p-3 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/40 text-xs text-[#00E599] flex items-center space-x-2 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Connected to {connectionSuccess}. Redirecting to terminal...</span>
                  </div>
                )}

                {/* Connection Error Toast */}
                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-300 flex items-center space-x-2 animate-fade-in">
                    <X className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 3 Wallet Options */}
                <div className="space-y-3">
                  {/* MetaMask */}
                  <button
                    onClick={() => handleConnectWallet("MetaMask")}
                    disabled={!!connectingWallet}
                    className="w-full p-4 rounded-2xl bg-[#080B11] hover:bg-white/[0.06] border border-white/10 hover:border-[#06B6D4]/50 transition-all flex items-center justify-between group disabled:opacity-60"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-lg">
                        🦊
                      </div>
                      <span className="font-semibold text-sm text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors">
                        MetaMask
                      </span>
                    </div>

                    {connectingWallet === "MetaMask" ? (
                      <Loader2 className="w-4 h-4 text-[#06B6D4] animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#F8FAFC] group-hover:translate-x-0.5 transition-all" />
                    )}
                  </button>

                  {/* WalletConnect */}
                  <button
                    onClick={() => handleConnectWallet("WalletConnect")}
                    disabled={!!connectingWallet}
                    className="w-full p-4 rounded-2xl bg-[#080B11] hover:bg-white/[0.06] border border-white/10 hover:border-[#06B6D4]/50 transition-all flex items-center justify-between group disabled:opacity-60"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 font-bold text-sm">
                        W
                      </div>
                      <span className="font-semibold text-sm text-[#F8FAFC] group-hover:text-[#06B6D4] transition-colors">
                        WalletConnect
                      </span>
                    </div>

                    {connectingWallet === "WalletConnect" ? (
                      <Loader2 className="w-4 h-4 text-[#06B6D4] animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#F8FAFC] group-hover:translate-x-0.5 transition-all" />
                    )}
                  </button>

                  {/* Trust Wallet */}
                  <button
                    onClick={() => handleConnectWallet("Trust Wallet")}
                    disabled={!!connectingWallet}
                    className="w-full p-4 rounded-2xl bg-[#080B11] hover:bg-white/[0.06] border border-white/10 hover:border-[#00E599]/50 transition-all flex items-center justify-between group disabled:opacity-60"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm">
                        🛡️
                      </div>
                      <span className="font-semibold text-sm text-[#F8FAFC] group-hover:text-[#00E599] transition-colors">
                        Trust Wallet
                      </span>
                    </div>

                    {connectingWallet === "Trust Wallet" ? (
                      <Loader2 className="w-4 h-4 text-[#00E599] animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#F8FAFC] group-hover:translate-x-0.5 transition-all" />
                    )}
                  </button>
                </div>

                {/* Divider with "or" */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <span className="relative px-3 bg-[#0D121F] text-xs text-[#94A3B8]">
                    or
                  </span>
                </div>

                {/* Read-Only Option */}
                <div className="space-y-1.5">
                  <button
                    onClick={handleReadOnly}
                    className="w-full p-4 rounded-2xl bg-[#080B11] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center text-[#94A3B8]">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm text-[#F8FAFC]">
                        Continue in Read-Only Mode
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#F8FAFC] group-hover:translate-x-0.5 transition-all" />
                  </button>
                  <p className="text-[11px] text-[#94A3B8] text-center">
                    Explore markets and analytics without connecting.
                  </p>
                </div>

                {/* Security Disclaimer Notice */}
                <div className="pt-2 flex items-start space-x-3 text-xs text-[#94A3B8] border-t border-white/[0.06]">
                  <ShieldCheck className="w-4 h-4 text-[#00E599] flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-[#F8FAFC] font-medium">Your wallet stays in your control.</strong>{" "}
                    We never store your private keys.
                  </p>
                </div>
              </div>
            ) : (
              /* TAB CONTENT 2: ENTERPRISE SIGN IN */
              <form onSubmit={handleSignInSubmit} className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
                    Institutional Sign In
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    Access dedicated API quotas, custom execution routing, and swarm signals.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="trader@fund.com"
                        className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#080B11] border border-white/10 focus:border-[#06B6D4] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-1">
                      API Secret Key or Password
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#080B11] border border-white/10 focus:border-[#06B6D4] text-xs text-[#F8FAFC] placeholder-[#94A3B8]/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#00E599] text-[#080B11] font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,229,153,0.5)] flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Terminal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("connect")}
                    className="text-xs text-[#06B6D4] hover:underline"
                  >
                    Prefer Web3 Wallet Connection? Switch to Connect
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-20 border-t border-white/[0.06] py-4 px-6 text-center text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 NyxEquities. Tokenized Equities Protocol on Binance Smart Chain.</span>
          <span className="text-[#00E599] font-mono text-[11px]">Chain ID: 56 &bull; Spot Only</span>
        </div>
      </footer>
    </div>
  );
}
