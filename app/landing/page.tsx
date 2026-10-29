"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GlassNavbar from "@/components/GlassNavbar";
import LandingPage from "@/components/LandingPage";
import SimulationModal from "@/components/SimulationModal";
import { SEED_RWA_TOKENS } from "@/lib/binanceWeb3";

export default function DedicatedLandingPage() {
  const router = useRouter();
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#080B11] text-[#F8FAFC] selection:bg-[#06B6D4] selection:text-[#080B11]">
      <GlassNavbar
        activeTab="landing"
        onTabChange={(tab) => {
          if (tab === "terminal") router.push("/terminal");
        }}
        walletBalanceUSDT={1448.0}
      />
      <LandingPage
        onEnterTerminal={() => router.push("/terminal")}
        onOpenSimulation={() => setIsSimModalOpen(true)}
      />
      <SimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        token={SEED_RWA_TOKENS[0]}
        swapAmountUSD={2.0}
      />
    </div>
  );
}
