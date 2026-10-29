# nyxequities. // Nocturnal Tokenized Yield & Drift Terminal

[![Live App](https://img.shields.io/badge/Live%20Terminal-Render%20Online-00E599?style=flat&logo=render)](https://nyxequities.onrender.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-blueviolet?style=flat)](https://turbo.build/pack)
[![Wagmi & Viem](https://img.shields.io/badge/Wagmi-3.7.9-blue?style=flat&logo=ethereum)](https://wagmi.sh/)
[![BSC Mainnet](https://img.shields.io/badge/BSC%20Mainnet-Chain%2056-F0B90B?style=flat&logo=binance)](https://bscscan.com/)
[![HTTP-402 Standard](https://img.shields.io/badge/Micro--Oracle-HTTP%20402-00E599?style=flat)](https://github.com/MansiGole/NyxEquities)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

> **NyxEquities** is an institutional DeFi workstation engineered on **Binance Smart Chain (BSC Mainnet // Chain ID 56)**. It systematically resolves the 128.5-hour weekly TradFi liquidity blackout by aggregating tokenized stocks (bStocks, Ondo, xStocks), simulating zero-revert cross-issuer drift arbitrage, auto-parking idle weekend capital into Venus Protocol (~6.82% APY), and streaming pay-per-signal telemetry to autonomous AI agents via the native HTTP-402 protocol.
>
> 🌐 **Live Production Deployment**: [https://nyxequities.onrender.com](https://nyxequities.onrender.com)

---

## 1. Executive Summary & The Off-Hours Problem

```
Traditional Finance Active Window:
Mon 09:30 - Fri 16:00 ET (39.5 Hours / 23.5% of the week)
███████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

NyxEquities 24/7 Execution Window:
Continuous 168 Hours / Week (100.0% Coverage)
████████████████████████████████████████████████████████████████████
```

### The TradFi Blackout (128.5 Hours of Friction)
The New York Stock Exchange (NYSE) and NASDAQ shut down at 16:00 ET every Friday and remain closed until 09:30 ET Monday morning. Factoring in weekday overnight closures, traditional equity markets are **inaccessible for 128.5 hours every week** — over 76.5% of total calendar time. During this downtime:

1. **Unhedged Macro Risk**: Geopolitical developments, international trade developments, and weekend breaking news cannot be hedged in real time.
2. **Fragmented RWA Liquidity Silos**: Tokenized Real-World Assets (RWAs) continue trading on-chain across multiple decentralized issuers (e.g., bStocks on PancakeSwap, Ondo Global Markets, xStocks), creating pricing spreads and delta drift relative to Friday's 16:00 NYSE closing benchmark.
3. **Idle Stablecoin Drag**: Billions of dollars in unallocated liquidity sit idle in spot exchange wallets over the weekend instead of compounding risk-free decentralized yield.

**NyxEquities** bridges this structural inefficiency by transforming fragmented tokenized equity markets into a single, high-throughput execution workstation.

---

## 2. System Architecture Pipeline

```
                                  USER INTERFACE LAYER
               ┌─────────────────────────────────────────────────────────┐
               │    Next.js 16 (App Router) + Tailwind CSS v4 Engine     │
               │  [ Web3 Wagmi / Viem ]     [ Wall Street Hours Engine ] │
               └────────────────────────────┬────────────────────────────┘
                                            │
                                            ▼
                                  EDGE APPLICATION API
               ┌─────────────────────────────────────────────────────────┐
               │      Serverless Edge API Routes (Prerendered / SSR)     │
               │  ├── /api/rwa: Multi-Issuer Benchmark & Spread Matrix   │
               │  ├── /api/simulate: Zero-Revert Pre-Flight EVM Engine   │
               │  └── /api/b402/signal: HTTP-402 AI Agent Micro-Oracle   │
               └─────────────┬─────────────────────────────┬─────────────┘
                             │                             │
                             ▼                             ▼
                  INFRASTRUCTURE SERVICES         BSC MAINNET (CHAIN ID 56)
               ┌──────────────────────────┐    ┌──────────────────────────┐
               │    Binance Web3 APIs     │    │  Smart Contract Layer    │
               │  ├── Multi-Issuer Pools  │    │  ├── PancakeSwap v3      │
               │  ├── Dry-Run Simulation  │    │  ├── Venus Protocol      │
               │  └── Liquidity Telemetry │    │  └── BEP-20 RWA Tokens   │
               └──────────────────────────┘    └──────────────────────────┘
```

---

## 3. Core Technical Innovations

### 1. Multi-Issuer Spread & Drift Engine
* Ingests real-time prices for benchmark equities (**NVDA**, **TSLA**, **AAPL**, **SPY**) across three independent RWA issuers: **bStocks**, **Ondo Finance**, and **xStocks**.
* Computes real-time **Drift Spreads** against the official Friday 16:00 ET TradFi benchmark.
* Algorithmic route optimizer scores pool liquidity depth against spread penalties to identify the single most cost-effective execution path.

### 2. Zero-Revert Pre-Flight Simulation
* Simulates transactions against live BSC Mainnet state using EVM dry-runs before dispatching to the mempool.
* Validates atomic balance deltas, exact gas consumption (`0.00042 BNB` / ~$0.25), and maximum slippage bounds (`< 0.5%`), guaranteeing zero failed transactions or wasted gas fees.
* Delivers complete unsigned EVM calldata payloads (`SwapRouter.exactInputSingle`) ready for immediate execution via Wagmi.

### 3. Automated Capital Efficiency Sweeps (Venus Protocol)
* Detects idle stablecoin balances (`USDT`) and generates calldata payloads for the **Venus Protocol vUSDT market** (`0xfD5840Cd36d94D7229439859C0112a4185BC0255`).
* Auto-allocates cash during the 65.5-hour weekend window at **~6.82% supply APY**, compounded block-by-block on BSC (~3.0-second block time).

### 4. Machine-to-Machine Micro-Oracle (HTTP-402 Standard)
* First-class implementation of the native web payment standard: `HTTP 402 Payment Required`.
* Autonomous AI trading agents query real-time nocturnal fair-value signals by completing a cryptographic micro-payment challenge (`0.005 USDT` per query).
* Verified on-chain via EIP-191 signatures with zero account registration or credit card requirements.

---

## 4. BSC Mainnet Smart Contract Registry

All contracts interact natively with verified deployments on **Binance Smart Chain (Chain ID 56)**:

| Protocol / Asset | Contract Address | Chain | Decimals | Functionality |
| :--- | :--- | :--- | :--- | :--- |
| **PancakeSwap v3 SwapRouter** | [`0x1b81D678ffb0C8c62c2f74116c478a5e3A4c9524`](https://bscscan.com/address/0x1b81D678ffb0C8c62c2f74116c478a5e3A4c9524) | BSC 56 | N/A | Multi-Hop DEX Spot Execution Router (`exactInputSingle`) |
| **Venus Protocol vUSDT Market** | [`0xfD5840Cd36d94D7229439859C0112a4185BC0255`](https://bscscan.com/address/0xfD5840Cd36d94D7229439859C0112a4185BC0255) | BSC 56 | 8 | vUSDT Money Market (`mint(uint256)`) |
| **Tether USD (USDT BEP-20)** | [`0x55d398326f99059fF775485246999027B3197955`](https://bscscan.com/address/0x55d398326f99059fF775485246999027B3197955) | BSC 56 | 18 | Base Stablecoin Settlement Token |
| **Ondo US Dollar Yield (USDY)** | [`0x5b341f237f8f6e076694317f226b998cf79a32c2`](https://bscscan.com/address/0x5b341f237f8f6e076694317f226b998cf79a32c2) | BSC 56 | 18 | Institutional US Treasury Yield Token |
| **bStocks NVDA Token (bNVDA)** | [`0x1b44f3514812d835eb1bdb0acb33d3fa3351ee43`](https://bscscan.com/address/0x1b44f3514812d835eb1bdb0acb33d3fa3351ee43) | BSC 56 | 18 | Tokenized NVIDIA Corporation Equity (bStocks) |
| **b402 Protocol Treasury** | [`0x5821c97a8A7145e69e4695F77C57E88a7B31b402`](https://bscscan.com/address/0x5821c97a8A7145e69e4695F77C57E88a7B31b402) | BSC 56 | N/A | Micro-Oracle Query Settlement Vault |

---

## 5. Technology Stack

* **Framework**: Next.js 16.4.3 (Turbopack, App Router, React 19)
* **Web3 Tooling**: Wagmi 3.7.9, Viem 2.57.13, TanStack React Query 5.105.0
* **Styling & Design System**: Tailwind CSS v4, Lucide React Icons
* **Notifications**: Sonner (Modern dark-mode rich toasts)
* **Financial Engine**: Dynamic Wall Street Market Hours Tracker (`lib/marketHours.ts`)
* **Hosting**: Render / Vercel Edge Serverless Deployment

---

## 6. Local Development & Setup

### Prerequisites
* Node.js 20.x or higher
* npm, pnpm, or yarn
* An EVM browser wallet (MetaMask, Rabby, Trust Wallet) configured for **BNB Smart Chain**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MansiGole/NyxEquities.git
cd NyxEquities

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for local RPC override)
cp .env.example .env.local

# 4. Start the Turbopack development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to access the application locally.

### Production Build

```bash
# Verify TypeScript, linting, and compile static routes
npm run build

# Start production server
npm run start
```

---

## 7. Architecture & Developer Docs

* **[Developer Experience (DX) Report](https://github.com/MansiGole/NyxEquities/blob/main/docs/DX_REPORT.md)**: Engineering analysis of Binance Web3 APIs, off-hours liquidity behavior, and protocol resilience.
* **[Architecture Specification](https://github.com/MansiGole/NyxEquities/blob/main/docs/ARCHITECTURE.md)**: Exhaustive breakdown of API contracts, the HTTP-402 challenge flow, and telemetry payload schemas.
* **[Deployment Guide](https://github.com/MansiGole/NyxEquities/blob/main/docs/DEPLOYMENT.md)**: Step-by-step production hosting guide, security headers, and live verification checklist.

---

## 8. License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
