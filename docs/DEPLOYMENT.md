# NyxEquities // Production Deployment & Hosting Guide

**Deployment Target**: [Vercel](https://vercel.com/) / Edge Serverless  
**Build Engine**: Next.js 16 (Turbopack) // Node.js 20+  
**Target Blockchain**: Binance Smart Chain (BSC Mainnet // Chain ID: 56)  
**Estimated Deployment Time**: < 2 minutes

---

## 1. Quick-Start Deployment (Under 2 Minutes)

Deploy NyxEquities to Vercel with zero configuration requirements. The application includes native mock fallbacks for all RWA endpoints and Web3 transactions, ensuring immediate 100% uptime without external API dependency.

### Method A: One-Click Vercel Dashboard Deployment (Recommended)

1. **Push Changes to GitHub**:
   ```bash
   git add .
   git commit -m "feat: production release ready for Vercel deployment"
   git push origin master
   ```

2. **Import Repository to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository: `MansiGole/NyxEquities`.
   - **Framework Preset**: `Next.js` (automatically detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build` (Turbopack).
   - **Output Directory**: `.next` (default).

3. **Configure Environment Variables** (Optional):
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NEXT_PUBLIC_DEFAULT_CHAIN_ID` | `56` | Sets default chain to BSC Mainnet |
   | `NEXT_PUBLIC_APP_NAME` | `NyxEquities` | Application title display |
   | `BINANCE_WEB3_API_KEY` | *(Optional)* | Live Binance Web3 RWA API key (uses resilient fallback if empty) |

4. **Deploy**:
   - Click **Deploy**. The build will complete in ~35-45 seconds.

---

### Method B: Vercel CLI Deployment

Deploy directly from your terminal using the Vercel CLI:

```bash
# 1. Install Vercel CLI globally (if not already installed)
npm install -g vercel

# 2. Authenticate with Vercel
vercel login

# 3. Deploy directly to Production
vercel --prod
```

Follow the interactive prompts (accepting default options for Next.js).

---

## 2. Pre-Flight Security & Configuration Verification

Before public broadcast, verify local environment hygiene:

```bash
# Verify sensitive files are NOT tracked by Git:
git status --ignored
# Confirms: .env, .env.local, .env.production, and .vercel are ignored

# Verify Turbopack build succeeds with zero TypeScript or SSR errors:
npm run build
```

---

## 3. Post-Deployment Verification Checklist

Once deployed to your production Vercel URL (e.g., `https://nyxequities.vercel.app`), verify the core institutional features:

- [ ] **Landing Page (`/`)**: Confirms 24/7 off-hours hero, live RWA spread preview, 3-step pipeline, and market clock ribbon.
- [ ] **Execution Terminal (`/terminal`)**: Confirms real-time multi-issuer matrix (`bStocks`, `Ondo`, `xStocks`), Venus weekend yield toggle, and b402 micro-oracle stream.
- [ ] **Wallet Connection**: Test connecting MetaMask, Rabby, or Trust Wallet. Confirms BSC Mainnet (Chain ID 56) detection with automatic chain switching.
- [ ] **Pre-Flight Simulation**: Click **"Simulate Spot Swap (NVDA)"** -> Confirm modal displays zero-revert guarantee, 0.04% slippage, and $0.25 (0.00042 BNB) gas estimate.
- [ ] **HTTP 402 Micro-Oracle**: Click **"Test b402 Handshake"** -> Verify step-by-step transition from `402 Payment Required` challenge to `200 OK` authenticated fair-value telemetry signal.
- [ ] **Edge API Endpoints**:
  ```bash
  # Check RWA Data Proxy
  curl -i https://YOUR-VERCEL-DOMAIN/api/rwa

  # Check b402 HTTP-402 Challenge
  curl -i https://YOUR-VERCEL-DOMAIN/api/b402/signal?ticker=NVDA&platform=bstock
  ```

---

## 4. Production Security Headers

The application automatically injects the following institutional headers via `next.config.ts`:

- `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing vulnerabilities.
- `X-Frame-Options: DENY`: Protects against clickjacking attacks.
- `X-XSS-Protection: 1; mode=block`: Enforces legacy browser XSS filtering.
- `Referrer-Policy: strict-origin-when-cross-origin`: Restricts referrer data leakage across third-party protocols.

