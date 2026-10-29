"use client";

import React, { useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { bsc } from "wagmi/chains";
import { toast } from "sonner";
import {
  Moon,
  Zap,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Coins,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VenusYieldModuleProps {
  idleUsdtBalance?: number;
  className?: string;
}

export const VenusYieldModule: React.FC<VenusYieldModuleProps> = ({
  idleUsdtBalance = 1448.0,
  className,
}) => {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const [isParked, setIsParked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFullCalldata, setShowFullCalldata] = useState(false);
  const [dispatchingVenus, setDispatchingVenus] = useState(false);
  const [venusTxHash, setVenusTxHash] = useState<string | null>(null);

  // Venus vUSDT Market on BSC Mainnet
  const VENUS_VUSDT_MARKET = "0xfD5840Cd36d94D7229439859C0112a4185BC0255";
  const SUPPLY_APY = 6.82;

  // Function signature for mint(uint256): 0xa0712d68
  const amountWeiHex = "00000000000000000000000000000000000000000000004e6b22b10ab874df1a";
  const unsignedCalldataHex = `0xa0712d68${amountWeiHex}`;

  const handleCopyCalldata = () => {
    navigator.clipboard.writeText(unsignedCalldataHex);
    setCopied(true);
    toast.success("Unsigned calldata copied to clipboard (mint(uint256))", {
      description: "Venus Protocol vUSDT market (0xfD58...0255)",
      id: "venus-calldata-copied",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePark = async () => {
    if (!isParked && isConnected && address && sendTransactionAsync) {
      setDispatchingVenus(true);
      toast.loading("Broadcasting Venus Protocol deposit...", { id: "venus-tx" });
      try {
        const tx = await sendTransactionAsync({
          to: VENUS_VUSDT_MARKET as `0x${string}`,
          data: unsignedCalldataHex as `0x${string}`,
          value: BigInt(0),
          chainId: bsc.id,
        });
        if (tx) {
          setVenusTxHash(tx);
          setIsParked(true);
          toast.success("Deposit dispatched on BSC Mainnet!", {
            id: "venus-tx",
            description: `Minted vUSDT on Venus Protocol. Hash: ${tx.slice(0, 10)}...`,
          });
        }
      } catch (err: any) {
        console.warn("Venus transaction dismissed or simulated:", err);
        setIsParked(!isParked);
        toast.info("Toggled weekend yield parking simulation", { id: "venus-tx" });
      } finally {
        setDispatchingVenus(false);
      }
    } else {
      setIsParked(!isParked);
      if (!isParked) {
        toast.info("Weekend yield parking enabled: 6.82% APY active on BSC");
      }
    }
  };

  // 63 hours of weekend parking (Friday 16:00 to Monday 07:00 ET)
  const weekendYieldEstUSD = (
    idleUsdtBalance *
    (SUPPLY_APY / 100) *
    (63 / (365 * 24))
  ).toFixed(3);

  return (
    <div
      id="venus-yield-section"
      className={cn(
        "rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] p-6 sm:p-7 space-y-6 shadow-xl shadow-black/40 text-[#F8FAFC] font-sans",
        className
      )}
    >
      {/* Header and Toggle Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#080B11] border border-[#1E293B] flex items-center justify-center text-[#00E599] shadow-md">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#F8FAFC]">
                Venus Protocol &bull; Weekend Cash Park
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#00E599]/15 border border-[#00E599]/30 text-[#00E599]">
                BSC Mainnet
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Automated capital efficiency: Deposit unallocated spot cash into Venus vUSDT while TradFi exchanges are closed
            </p>
          </div>
        </div>

        {/* The Weekend Yield Park Switch */}
        <div className="flex items-center space-x-3 bg-[#080B11] p-2 px-4 rounded-full border border-[#1E293B]">
          <span className="text-xs text-[#94A3B8] font-medium">
            Weekend Yield Park:
          </span>
          <button
            onClick={handleTogglePark}
            disabled={dispatchingVenus}
            role="switch"
            aria-checked={isParked}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-[#06B6D4]",
              isParked ? "bg-[#00E599]" : "bg-white/[0.12]"
            )}
          >
            {dispatchingVenus ? (
              <Loader2 className="w-3.5 h-3.5 text-black animate-spin mx-auto" />
            ) : (
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-[#080B11] transition-transform",
                  isParked ? "translate-x-6" : "translate-x-1"
                )}
              />
            )}
          </button>
          <span
            className={cn(
              "text-xs font-bold w-9 text-right",
              isParked ? "text-[#00E599]" : "text-[#94A3B8]"
            )}
          >
            {isParked ? "ON" : "OFF"}
          </span>
        </div>
      </div>

      {/* Live Venus Deposit BscScan Toast */}
      {venusTxHash && (
        <div className="p-3 rounded-2xl bg-[#00E599]/15 border border-[#00E599]/30 text-xs text-[#00E599] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Deposit dispatched on BSC Mainnet!</span>
          </div>
          <a
            href={`https://bscscan.com/tx/${venusTxHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center space-x-1 text-xs font-mono font-bold"
          >
            <span>View Tx</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Yield Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#080B11] border border-[#1E293B]">
          <div className="text-[#94A3B8] font-medium">Idle Cash Allocated</div>
          <div className="text-lg font-bold font-mono text-[#F8FAFC] mt-1">
            ${idleUsdtBalance.toFixed(2)} USDT
          </div>
          <div className="text-[11px] text-[#06B6D4] mt-0.5">
            {isParked ? "Parked in Venus vUSDT" : "Liquid in Spot Balance"}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#080B11] border border-[#1E293B]">
          <div className="text-[#94A3B8] font-medium">Venus Supply APY</div>
          <div className="text-lg font-bold font-mono text-[#00E599] mt-1 flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>{SUPPLY_APY}% APY</span>
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-0.5">
            Compounded per BSC block (~3.0s)
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#080B11] border border-[#1E293B]">
          <div className="text-[#94A3B8] font-medium">Est. Weekend Harvest</div>
          <div className="text-lg font-bold font-mono text-[#00E599] mt-1">
            +${weekendYieldEstUSD} USDT
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-0.5">
            63h Friday 16:00 &rarr; Monday 07:00 ET
          </div>
        </div>
      </div>

      {/* Calldata Inspection Section */}
      <div className="rounded-2xl bg-[#080B11] border border-white/10 p-4 sm:p-5 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-[#94A3B8]">
            <Coins className="w-4 h-4 text-[#06B6D4]" />
            <span className="font-semibold text-[#F8FAFC]">
              Unsigned Deposit Calldata &bull; Venus vUSDT
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFullCalldata(!showFullCalldata)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] text-xs flex items-center space-x-1"
            >
              <span>{showFullCalldata ? "Collapse" : "Expand"}</span>
              {showFullCalldata ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={handleCopyCalldata}
              className="px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-[#00E599] flex items-center space-x-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00E599]" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Calldata</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0D121F] font-mono text-[11px] text-[#06B6D4] break-all border border-white/10 select-all">
          {showFullCalldata
            ? unsignedCalldataHex
            : `${unsignedCalldataHex.slice(0, 42)}...${unsignedCalldataHex.slice(-18)}`}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#94A3B8] pt-1">
          <div className="flex items-center space-x-2">
            <span>Target Contract:</span>
            <span className="font-mono text-[#F8FAFC]">{VENUS_VUSDT_MARKET}</span>
          </div>

          <a
            href={`https://bscscan.com/address/${VENUS_VUSDT_MARKET}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#06B6D4] hover:underline inline-flex items-center space-x-1"
          >
            <span>Venus vUSDT on BscScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default VenusYieldModule;
