export interface SimulationRequest {
  fromToken: string;
  toToken: string;
  amount: string;
  userAddress: string;
  ticker?: string;
  issuer?: string;
}

export interface BalanceDeltaItem {
  symbol: string;
  before: string;
  after: string;
  delta: string;
}

export interface SimulationResult {
  success: boolean;
  gasEstimatedBNB: string;
  gasEstimatedUSD: string;
  revertRisk: boolean;
  simulatedRoute: string;
  slippagePct: number;
  balanceDelta: {
    fromToken: BalanceDeltaItem;
    toToken: BalanceDeltaItem;
  };
  calldata: {
    to: string;
    data: string;
    value: string;
    gasLimit: string;
  };
  mevProtected: boolean;
  timestamp: number;
}

export interface VenusYieldState {
  isParked: boolean;
  marketAddress: string;
  vTokenSymbol: string;
  underlyingSymbol: string;
  supplyApy: number;
  parkedAmountUSD: number;
  unsignedCalldata: {
    target: string;
    method: string;
    functionSignature: string;
    calldataHex: string;
    amountWei: string;
  };
}

