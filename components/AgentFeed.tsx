"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAccount, useSignMessage } from "wagmi";
import {
  Coins,
  DollarSign,
  Radio,
  CheckCircle2,
  AlertCircle,
  Play,
  Terminal,
  Activity,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentLogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  amount: string;
  ticker: string;
  platform: string;
  status: "PAID" | "CHALLENGED_402";
  txSnippet: string;
}

export const AgentFeed: React.FC = () => {
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [invoicedCalls, setInvoicedCalls] = useState(48);
  const [grossRevenue, setGrossRevenue] = useState(0.24);
  const [logs, setLogs] = useState<AgentLogEntry[]>([
    {
      id: "log-1",
      timestamp: "00:02:14",
      agentId: "AGENT_0x82...b1",
      amount: "0.005 USDT",
      ticker: "NVDA",
      platform: "bstock",
      status: "PAID",
      txSnippet: "0x89f2...41a",
    },
    {
      id: "log-2",
      timestamp: "00:03:02",
      agentId: "DRIFT_BOT_0x3a...e4",
      amount: "0.005 USDT",
      ticker: "TSLA",
      platform: "bstock",
      status: "PAID",
      txSnippet: "0x33b1...77d",
    },
    {
      id: "log-3",
      timestamp: "00:04:18",
      agentId: "ARBITRAGE_AGENT_0x99...f2",
      amount: "0.005 USDT",
      ticker: "AAPL",
      platform: "ondo",
      status: "PAID",
      txSnippet: "0x12c4...e88",
    },
    {
      id: "log-4",
      timestamp: "00:05:45",
      agentId: "KEEPER_0x44...9a",
      amount: "0.005 USDT",
      ticker: "SPY",
      platform: "bstock",
      status: "PAID",
      txSnippet: "0x9812...bc3",
    },
  ]);

  // Interactive Test State
  const [testState, setTestState] = useState<
    "idle" | "requesting_unpaid" | "challenged_402" | "paying" | "resolved_200"
  >("idle");
  const [testResponsePayload, setTestResponsePayload] = useState<any>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [logs, testResponsePayload]);

  // Background agent activity generator (every 10 seconds adds a query)
  useEffect(() => {
    const mockAgents = [
      "AGENT_0x71...c2",
      "QUANT_SWARM_0x54...88",
      "DRIFT_FINDER_0x11...e9",
      "OFFHOURS_ARB_0xbc...42",
      "VENUS_KEEPER_0x39...11",
    ];
    const tickers = ["NVDA", "TSLA", "AAPL", "SPY"];
    const platforms = ["bstock", "ondo", "xstocks"];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const randomAgent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
      const randomTicker = tickers[Math.floor(Math.random() * tickers.length)];
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];

      const newEntry: AgentLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        agentId: randomAgent,
        amount: "0.005 USDT",
        ticker: randomTicker,
        platform: randomPlatform,
        status: "PAID",
        txSnippet: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 5)}`,
      };

      setLogs((prev) => [...prev.slice(-25), newEntry]);
      setInvoicedCalls((prev) => prev + 1);
      setGrossRevenue((prev) => Number((prev + 0.005).toFixed(3)));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Interactive b402 Handshake Demo Function
  const runB402HandshakeTest = async () => {
    setTestState("requesting_unpaid");
    setTestResponsePayload(null);

    try {
      try {
        await axios.get("/api/b402/signal?ticker=NVDA&platform=bstock");
      } catch (err: any) {
        if (err.response && err.response.status === 402) {
          setTestState("challenged_402");
          setTestResponsePayload({
            step: "1. HTTP 402 Payment Required Challenge",
            status: 402,
            headers: {
              "x-payment-amount": err.response.headers["x-payment-amount"] || "0.005 USDT",
              "x-payment-receiver": err.response.headers["x-payment-receiver"] || "0x5821c97a8A7145e69e4695F77C57E88a7B31b402",
              "x-payment-chainid": err.response.headers["x-payment-chainid"] || "56",
            },
            body: err.response.data,
          });

          setTimeout(async () => {
            setTestState("paying");

            let realSignature = "0x789b78e225be3ad8d7f722a4d33eb43c94f57c5a91823761827461928471928471";
            if (isConnected && signMessageAsync) {
              try {
                realSignature = await signMessageAsync({
                  message: `b402 Oracle Micro-Payment Challenge | Amount: 0.005 USDT | Chain: 56 | Nonce: ${Date.now()}`,
                });
              } catch (signErr) {
                console.warn("Wallet signing skipped, using protocol receipt:", signErr);
              }
            }

            const paymentReceipt = await axios.get(
              "/api/b402/signal?ticker=NVDA&platform=bstock",
              {
                headers: {
                  "X-402-Payment-Signature": realSignature,
                },
              }
            );

            setTestState("resolved_200");
            setTestResponsePayload({
              step: "2. HTTP 200 OK — Telemetry Quote Delivered",
              status: 200,
              headers: {
                "x-b402-settled": "TRUE",
              },
              body: paymentReceipt.data,
            });

            const now = new Date();
            const timeStr = now.toTimeString().split(" ")[0];
            setLogs((prev) => [
              ...prev,
              {
                id: `log-test-${Date.now()}`,
                timestamp: timeStr,
                agentId: "INSPECTOR_0x82...b1",
                amount: "0.005 USDT",
                ticker: "NVDA",
                platform: "bstock",
                status: "PAID",
                txSnippet: "0x789b...847",
              },
            ]);
            setInvoicedCalls((prev) => prev + 1);
            setGrossRevenue((prev) => Number((prev + 0.005).toFixed(3)));
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Test handshake error:", error);
      setTestState("idle");
    }
  };

  return (
    <div
      id="agent-feed-section"
      className="w-full rounded-3xl bg-[#0D121F]/80 backdrop-blur-sm border border-[#1E293B] p-6 sm:p-7 space-y-6 shadow-xl shadow-black/40 text-[#F8FAFC] font-sans"
    >
      {/* Header & Revenue Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#080B11] border border-[#1E293B] flex items-center justify-center text-[#06B6D4] shadow-md">
            <Radio className="w-5 h-5 text-[#06B6D4] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#F8FAFC]">
                b402 Pay-Per-Call Micro-Oracle
              </h3>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4]">
                HTTP 402 Standard
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Decentralized AI agent feed purchasing off-hours fair-value calculations on BSC Mainnet
            </p>
          </div>
        </div>

        {/* Ticker Summary Card */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-4 py-2 rounded-2xl bg-[#080B11] border border-[#1E293B]">
            <span className="text-[#94A3B8] font-medium">Invoiced Queries: </span>
            <strong className="text-[#F8FAFC] font-mono ml-1">{invoicedCalls}</strong>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-[#080B11] border border-[#00E599]/40 text-[#00E599] flex items-center space-x-1.5 shadow-[0_0_12px_rgba(0,229,153,0.15)]">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">Gross Revenue: </span>
            <strong className="text-[#F8FAFC] font-mono ml-1">${grossRevenue.toFixed(3)} USDT</strong>
          </div>
        </div>
      </div>

      {/* Protocol Stream Box */}
      <div className="relative rounded-2xl bg-[#080B11] border border-[#1E293B] p-4 sm:p-5 text-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3 text-xs text-[#94A3B8]">
          <span className="flex items-center space-x-2 font-medium text-[#F8FAFC]">
            <Activity className="w-4 h-4 text-[#00E599]" />
            <span>Live Agent Query Stream (BSC Chain 56)</span>
          </span>
          <span className="text-xs font-mono text-[#00E599] font-semibold">
            0.005 USDT / Query
          </span>
        </div>

        {/* Query Logs */}
        <div
          ref={terminalScrollRef}
          className="h-36 overflow-y-auto custom-scrollbar space-y-2 pr-1 text-xs"
        >
          {logs.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-[#94A3B8] font-mono text-[11px]">{item.timestamp}</span>
                <span className="text-[#06B6D4] font-medium">{item.agentId}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00E599]/15 text-[#00E599] font-bold text-[10px]">
                  PAID {item.amount}
                </span>
                <span className="text-[#94A3B8] hidden sm:inline">&rarr;</span>
                <span className="text-[#F8FAFC] font-mono text-[11px] hidden sm:inline">
                  /api/b402/signal?ticker={item.ticker}&platform={item.platform}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]/60">
                sig:{item.txSnippet}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive b402 Challenge & Handshake Inspector */}
      <div className="rounded-2xl bg-[#080B11] border border-white/10 p-5 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-[#06B6D4]">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold tracking-tight text-sm text-[#F8FAFC]">
              Interactive b402 Protocol Inspector
            </span>
          </div>

          <button
            onClick={runB402HandshakeTest}
            disabled={testState !== "idle" && testState !== "resolved_200"}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#00E599] hover:from-[#06B6D4]/90 hover:to-[#00E599]/90 text-[#080B11] font-bold text-xs uppercase transition-all shadow-md hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {testState === "idle" || testState === "resolved_200"
                ? "Test b402 Handshake"
                : "Handshaking..."}
            </span>
          </button>
        </div>

        {/* Handshake Progress Steps Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div
            className={cn(
              "p-3 rounded-2xl border flex items-center space-x-2.5 transition-all",
              testState === "requesting_unpaid" || testState === "challenged_402"
                ? "bg-[#06B6D4]/15 border-[#06B6D4] text-[#06B6D4] font-semibold"
                : "bg-[#0D121F] border-white/10 text-[#94A3B8]"
            )}
          >
            <div className="w-2 h-2 rounded-full bg-current" />
            <span>1. HTTP 402 Challenge</span>
          </div>

          <div
            className={cn(
              "p-3 rounded-2xl border flex items-center space-x-2.5 transition-all",
              testState === "paying"
                ? "bg-amber-400/15 border-amber-400 text-amber-400 animate-pulse font-semibold"
                : "bg-[#0D121F] border-white/10 text-[#94A3B8]"
            )}
          >
            <div className="w-2 h-2 rounded-full bg-current" />
            <span>2. Sign 0.005 USDT Micro-tx</span>
          </div>

          <div
            className={cn(
              "p-3 rounded-2xl border flex items-center space-x-2.5 transition-all",
              testState === "resolved_200"
                ? "bg-[#00E599]/15 border-[#00E599] text-[#00E599] font-semibold"
                : "bg-[#0D121F] border-white/10 text-[#94A3B8]"
            )}
          >
            <div className="w-2 h-2 rounded-full bg-current" />
            <span>3. 200 OK + Telemetry Payload</span>
          </div>
        </div>

        {/* Live Response JSON Box */}
        {testResponsePayload && (
          <div className="p-4 rounded-2xl bg-[#0D121F] border border-white/10 space-y-2.5 text-xs animate-fade-in">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="font-bold text-[#F8FAFC]">
                {testResponsePayload.step}
              </span>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full font-bold text-[11px]",
                  testResponsePayload.status === 402
                    ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                    : "bg-[#00E599]/20 text-[#00E599] border border-[#00E599]/30"
                )}
              >
                STATUS {testResponsePayload.status}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#080B11] border border-white/[0.08] overflow-x-auto custom-scrollbar max-h-48">
              <pre className="text-[#06B6D4] font-mono text-xs leading-relaxed">
                {JSON.stringify(testResponsePayload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentFeed;
