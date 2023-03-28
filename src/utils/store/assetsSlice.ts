import { TezosNetwork } from "@airgap/tezos";
import { createSlice } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { TezTransfer, TokenTransfer } from "../../types/Operation";
import { Token } from "../../types/Token";
import accountsSlice from "./accountsSlice";

export type balance = {
  tez: BigNumber | null;
  tokens: Token[];
};

// Use Record and not Map because Redux state has to be serializable
type State = {
  network: TezosNetwork;
  balances: Record<string, balance>;
  operations: {
    tez: Record<string, TezTransfer[]>;
    tokens: Record<string, TokenTransfer[]>;
  };
  conversionRate: number | null; // XTZ/USD conversion rate
};

export type TezBalancePayload = { pkh: string; tez: BigNumber };
export type TokenBalancePayload = { pkh: string; tokens: Token[] };
export type TezTransfersPayload = {
  pkh: string;
  operations: TezTransfer[];
};
export type TokenTransfersPayload = {
  pkh: string;
  operations: TokenTransfer[];
};
export type ConversionRatePayload = { rate: State["conversionRate"] };

const initialBalance: balance = {
  tez: null,
  tokens: [],
};

const initialState: State = {
  network: TezosNetwork.MAINNET,
  balances: {},
  operations: { tez: {}, tokens: {} },
  conversionRate: null,
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  // Reset assets state if accounts are reset
  extraReducers: (builder) =>
    builder.addCase(accountsSlice.actions.reset, () => initialState),
  reducers: {
    reset: () => initialState,
    updateNetwork: (
      _,
      { payload }: { type: string; payload: TezosNetwork }
    ) => {
      return { ...initialState, network: payload };
    },
    updateTezOperations: (
      state,
      { payload }: { type: string; payload: TezTransfersPayload[] }
    ) => {
      const tezOperationsPayload = payload;
      const newTezTransfers = { ...state.operations.tez };

      tezOperationsPayload.forEach((op) => {
        const { pkh, operations } = op;
        newTezTransfers[pkh] = operations;
      });
      state.operations.tez = newTezTransfers;
    },
    // TODO refactor duplication
    updateTokenOperations: (
      state,
      { payload }: { type: string; payload: TokenTransfersPayload[] }
    ) => {
      const tezOperationsPayload = payload;
      const newTezTransfers = { ...state.operations.tokens };

      tezOperationsPayload.forEach((op) => {
        const { pkh, operations } = op;
        newTezTransfers[pkh] = operations;
      });

      state.operations.tokens = newTezTransfers;
    },
    updateAssets: (
      state,
      {
        payload,
      }: { type: string; payload: TezBalancePayload[] | TokenBalancePayload[] }
    ) => {
      const tezBalancePayloads = payload;
      const newBalances = { ...state.balances };

      tezBalancePayloads.forEach((payload) => {
        const pkh = payload.pkh;
        const existing = newBalances[pkh] || initialBalance;

        if ("tez" in payload) {
          newBalances[pkh] = { ...existing, tez: payload.tez };
        } else {
          newBalances[pkh] = { ...existing, tokens: payload.tokens };
        }
      });

      state.balances = newBalances;
    },
    updateConversionRate: (
      state,
      { payload: { rate } }: { type: string; payload: ConversionRatePayload }
    ) => {
      state.conversionRate = rate;
    },
  },
});

export default assetsSlice;
