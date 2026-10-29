"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Clock,
  CircleDot,
  Server,
  Zap,
  Moon,
  Layout,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopStatusRibbonProps {
  activeTab?: "landing" | "terminal";
  onTabChange?: (tab: "landing" | "terminal") => void;
}

export const TopStatusRibbon: React.FC<TopStatusRibbonProps> = ({
  activeTab,
  onTabChange,
}) => {
  const [nyseTime, setNyseTime] = useState<string>("");
  const [isNyseClosed, setIsNyseClosed] = useState<boolean>(true);

  // Update simulated NYSE clock
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const nyTimeStr = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now);

        const dayOfWeek = now.getUTCDay();
        const nyHour = parseInt(nyTimeStr.split(":")[0], 10);
        const nyMinute = parseInt(nyTimeStr.split(":")[1], 10);
        const totalMinutes = nyHour * 60 + nyMinute;

        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
        const isRegularHours = isWeekday && totalMinutes >= 570 && totalMinutes < 960;

        setIsNyseClosed(!isRegularHours);
        setNyseTime(`${nyTimeStr} ET`);
      } catch {
        setNyseTime("20:00:00 ET");
        setIsNyseClosed(true);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-20 w-full border-b border-[#1E293B] bg-[#0D121F]/90 backdrop-blur-md">
      {/* Prototype Advisory Bar */}
      <div className="bg-[#080B11] border-b border-[#1E293B]/70 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>
            <strong className="text-[#F8FAFC]">PROTOTYPE ENVIRONMENT:</strong>{" "}
            Simulated off-hours tokenized equities telemetry & drift execution UI.
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[10px]">
          <span className="text-[#94A3B8]">RPC: BSC_SIM_GATEWAY</span>
          <span className="text-[#06B6D4]">SESSION: SECURE_EPHEMERAL</span>
        </div>
      </div>

      {/* Main Terminal Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Terminal Branding */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded bg-[#080B11] border border-[#1E293B] shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <div className="w-4 h-4 border border-[#06B6D4] rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#00E599]" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#00E599] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold font-mono tracking-wider text-[#F8FAFC]">
                NYX<span className="text-[#00E599]">EQUITIES</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4]">
                v1.0-PROTO
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#94A3B8] hidden sm:block">
              OFF-HOURS TOKENIZED EQUITIES TERMINAL
            </div>
          </div>
        </div>

        {/* View Switcher Tabs (Landing vs Terminal) */}
        {onTabChange && (
          <div className="flex items-center p-1 rounded-lg bg-[#080B11] border border-[#1E293B] font-mono text-xs">
            <button
              onClick={() => onTabChange("landing")}
              className={cn(
                "px-3 py-1 rounded transition-all flex items-center space-x-1.5",
                activeTab === "landing"
                  ? "bg-[#06B6D4]/20 text-[#06B6D4] font-bold shadow-sm"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              )}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Landing</span>
            </button>
            <button
              onClick={() => onTabChange("terminal")}
              className={cn(
                "px-3 py-1 rounded transition-all flex items-center space-x-1.5",
                activeTab === "terminal"
                  ? "bg-[#00E599]/20 text-[#00E599] font-bold shadow-sm"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              )}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </button>
          </div>
        )}

        {/* Real-time Status Badges */}
        <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
          {/* BSC Network Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#080B11] border border-[#1E293B] font-mono text-xs">
            <Server className="w-3.5 h-3.5 text-[#06B6D4]" />
            <div className="flex items-center space-x-1.5">
              <span className="text-[#94A3B8]">CHAIN:</span>
              <span className="text-[#F8FAFC] font-semibold">BSC 56</span>
              <CircleDot className="w-3 h-3 text-[#00E599] animate-pulse" />
            </div>
          </div>

          {/* NYSE Market Clock & Drift Engine Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#080B11] border border-[#1E293B] font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
            <div className="flex items-center space-x-1.5">
              <span className="text-[#94A3B8]">NYSE:</span>
              {isNyseClosed ? (
                <span className="flex items-center space-x-1 text-[#00E599]">
                  <Moon className="w-3 h-3" />
                  <span className="font-semibold">CLOSED</span>
                </span>
              ) : (
                <span className="text-[#06B6D4] font-semibold">OPEN (REGULAR)</span>
              )}
              {nyseTime && (
                <span className="hidden md:inline text-[#94A3B8] text-[11px] pl-1 border-l border-[#1E293B]">
                  {nyseTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopStatusRibbon;
