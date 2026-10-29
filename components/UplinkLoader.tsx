"use client";

import React, { useEffect, useRef } from "react";
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  X,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface UplinkLoaderProps {
  statusText?: string;
  telemetryLogs?: string[];
  progress?: number;
  isComplete?: boolean;
  onClose?: () => void;
  className?: string;
}

export const UplinkLoader: React.FC<UplinkLoaderProps> = ({
  statusText = "Transaction Pre-Flight Simulation",
  telemetryLogs = [
    "Connecting to BSC Mainnet RPC endpoint (Chain ID: 56)...",
    "Fetching off-hours synthetic pool reserves for PancakeSwap v3...",
    "Validating delta-neutral drift tolerance thresholds...",
    "Calculating simulation gas bounds (Estimate: ~142,000 gas)...",
    "Pre-flight simulation verified. Zero-revert guarantee active.",
  ],
  progress = 42,
  isComplete = false,
  onClose,
  className,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Clamp progress between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const totalTicks = 24;
  const activeTicks = Math.round((normalizedProgress / 100) * totalTicks);

  // Auto-scroll telemetry log to bottom as new entries arrive
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl bg-[#0D121F]/95 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl overflow-hidden text-[#F8FAFC]",
        className
      )}
    >
      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-[#080B11] border border-white/10 shadow-sm">
            <Activity
              className={cn(
                "w-4 h-4 transition-colors",
                isComplete ? "text-[#00E599]" : "text-[#06B6D4] animate-pulse"
              )}
            />
            <span
              className={cn(
                "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full",
                isComplete
                  ? "bg-[#00E599] shadow-[0_0_8px_#00E599]"
                  : "bg-[#06B6D4] shadow-[0_0_8px_#06B6D4]"
              )}
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#F8FAFC] tracking-tight">
                Pre-Flight Transaction Simulation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00E599]/15 text-[#00E599] font-semibold">
                BSC Chain 56
              </span>
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              Binance Web3 Dry-Run Engine &bull; Zero-Revert Guarantee
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#080B11] border border-white/10 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E599]" />
            <span className="text-[#94A3B8]">Latency:</span>
            <span className="text-[#F8FAFC] font-mono font-medium">18ms</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close Uplink"
              className="p-1.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Status Readout */}
      <div className="relative z-10 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2.5">
            <span
              className={cn(
                "inline-block w-2.5 h-2.5 rounded-full",
                isComplete
                  ? "bg-[#00E599] shadow-[0_0_8px_#00E599]"
                  : "bg-[#06B6D4] animate-ping"
              )}
            />
            <h3 className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">
              {statusText}
            </h3>
          </div>

          <span
            className={cn(
              "text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border",
              isComplete
                ? "bg-[#00E599]/15 border-[#00E599]/40 text-[#00E599]"
                : "bg-[#06B6D4]/15 border-[#06B6D4]/40 text-[#06B6D4]"
            )}
          >
            {normalizedProgress}%
          </span>
        </div>

        {/* Stepped Progress Bar with Illuminated Neon Telemetry Ticks */}
        <div className="grid grid-cols-24 gap-1 p-1.5 bg-[#080B11] rounded-xl border border-white/10 shadow-inner">
          {Array.from({ length: totalTicks }).map((_, idx) => {
            const isActive = idx < activeTicks;
            const isLatest = idx === activeTicks - 1;

            return (
              <div
                key={idx}
                className={cn(
                  "h-3 rounded-[3px] transition-all duration-300",
                  isActive
                    ? isComplete
                      ? "bg-[#00E599] shadow-[0_0_6px_rgba(0,229,153,0.8)]"
                      : "bg-[#06B6D4] shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                    : "bg-[#1E293B]/40",
                  isLatest && !isComplete && "animate-pulse"
                )}
              />
            );
          })}
        </div>
      </div>

      {/* Telemetry Trace Log Stream */}
      <div className="relative z-10">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2 px-1">
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            Execution Trace Stream
          </span>
          <span className="text-[11px] text-[#00E599] font-medium flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dry-Run Active</span>
          </span>
        </div>

        <div
          ref={logContainerRef}
          tabIndex={0}
          aria-label="Telemetry Logs"
          className="h-28 overflow-y-auto custom-scrollbar bg-[#080B11] border border-white/10 rounded-2xl p-3 font-mono text-[11px] space-y-1.5 text-[#94A3B8] shadow-inner focus:outline-none focus:ring-1 focus:ring-[#06B6D4]/50"
        >
          {telemetryLogs.map((log, index) => {
            const isSuccess = log.includes("[OK]") || log.includes("verified");
            const isStep = log.includes("[1/3]") || log.includes("[2/3]") || log.includes("[3/3]");

            return (
              <div
                key={index}
                className={cn(
                  "flex items-start space-x-2",
                  isSuccess
                    ? "text-[#00E599]"
                    : isStep
                    ? "text-[#06B6D4]"
                    : "text-[#94A3B8]"
                )}
              >
                <span className="text-[#94A3B8]/50 select-none">›</span>
                <span className="break-all">{log}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Footer */}
      <div className="relative z-10 flex items-center justify-between mt-4 pt-3 border-t border-white/10 text-xs text-[#94A3B8]">
        <div className="flex items-center space-x-2">
          {isComplete ? (
            <span className="flex items-center space-x-1.5 text-[#00E599] font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulation Passed &bull; Zero Revert Risk</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 text-[#06B6D4]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-ping" />
              <span>Simulating PancakeSwap v3 Call...</span>
            </span>
          )}
        </div>

        <div className="text-[11px] text-[#94A3B8]">
          Gas Limit: <span className="font-mono text-[#F8FAFC]">142,000</span>
        </div>
      </div>
    </div>
  );
};

export default UplinkLoader;
