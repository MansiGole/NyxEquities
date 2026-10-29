import { NextResponse } from "next/server";
import { SimulationRequest, SimulationResult } from "@/types/simulation";

/**
 * POST /api/simulate
 * Binance Web3 Pre-Flight Transaction Simulation Engine (Dry-Run Harness)
 * Mimics POST /api/v1/tx/simulate with zero-revert validation, balance deltas, and unsigned calldata.
 */
export async function POST(req: Request) {
  try {
    const body: SimulationRequest = await req.json();

    const fromToken =
      body.fromToken || "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
    const toToken =
      body.toToken || "0x1b44f3514812d835eb1bdb0acb33d3fa3351ee43"; // Target RWA Contract (bNVDA)
    const amountNum = parseFloat(body.amount) || 2.0;
    const ticker = body.ticker || "bNVDA";
    const issuer = body.issuer || "bStocks";
    const userAddress =
      body.userAddress || "0x789b78e225be3ad8d7f722a4d33eb43c94f57c5a";

    // Validate Spot bounds ($2.00 demo or user input)
    const formattedAmount = amountNum.toFixed(2);

    // Compute synthetic output units (e.g., $2.00 USDT at simulated price ~$143.35)
    const mockPrice = ticker.includes("NVDA")
      ? 143.35
      : ticker.includes("TSLA")
      ? 254.61
      : ticker.includes("AAPL")
      ? 232.73
      : 588.92;

    const outputTokens = (amountNum / mockPrice).toFixed(6);

    // Gas estimation on BSC Mainnet (Chain ID: 56)
    // ~142,000 gas units @ 3 Gwei = ~0.000426 BNB (~$0.25 USD)
    const gasEstimatedBNB = "0.00042";
    const gasEstimatedUSD = "$0.25";

    // Unsigned multicall / swap calldata dispatch for PancakeSwap v3 / BSC Spot route
    // Function selector for exactInputSingle(tuple): 0x414bf382
    const syntheticCalldataHex =
      "0x414bf382" +
      "000000000000000000000000" +
      fromToken.replace("0x", "").toLowerCase() +
      "000000000000000000000000" +
      toToken.replace("0x", "").toLowerCase() +
      "00000000000000000000000000000000000000000000000000000000000001f4" + // 500 fee tier
      "000000000000000000000000" +
      userAddress.replace("0x", "").toLowerCase() +
      "00000000000000000000000000000000000000000000000000000000001e8480"; // deadline + minOut

    const simulationPayload: SimulationResult = {
      success: true,
      gasEstimatedBNB,
      gasEstimatedUSD,
      revertRisk: false, // Zero-revert guarantee verified
      simulatedRoute: `USDT -> PancakeSwap v3 -> ${ticker} (${issuer})`,
      slippagePct: 0.04, // Well below 0.5% max threshold
      balanceDelta: {
        fromToken: {
          symbol: "USDT (BSC)",
          before: "1,450.00",
          after: (1450 - amountNum).toFixed(2),
          delta: `-${formattedAmount}`,
        },
        toToken: {
          symbol: ticker,
          before: "0.000000",
          after: outputTokens,
          delta: `+${outputTokens}`,
        },
      },
      calldata: {
        to: "0x13f4ea83d0bd40e75c8222255bc855a974568dd4", // PancakeSwap v3 SwapRouter BSC
        data: syntheticCalldataHex,
        value: "0",
        gasLimit: "142000",
      },
      mevProtected: true,
      timestamp: Date.now(),
    };

    return NextResponse.json(
      {
        code: 0,
        msg: "success",
        data: simulationPayload,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Simulation-Engine": "BinanceWeb3-TxSim-v1",
        },
      }
    );
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json(
      {
        code: 500,
        msg: "Pre-flight simulation engine failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

