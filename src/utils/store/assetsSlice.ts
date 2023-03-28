import { TezosNetwork } from "@airgap/tezos";
import { createSlice } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { TezTransfer, TokenTransfer } from "../../types/Operation";
import { Token } from "../../types/Token";
import accountsSlice from "./accountsSlice";

// Use Record and not Map because Redux state has to be serializable
type State = {
  network: TezosNetwork;
  balances: {
    tez: Record<string, BigNumber | null>;
    tokens: Record<string, Token[]>;
  };
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

const initialState: State = {
  network: TezosNetwork.MAINNET,
  balances: {
    tez: {},
    tokens: {},
  },
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
        if ("tez" in payload) {
          const existing = state.balances.tez;
          state.balances.tez = { ...existing, [payload.pkh]: payload.tez };
          return;
        }
        const existing = state.balances.tokens;
        state.balances.tokens = {
          ...existing,
          [payload.pkh]: payload.tokens,
        };
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
