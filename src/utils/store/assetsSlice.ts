import { TezosNetwork } from "@airgap/tezos";
import { createSlice } from "@reduxjs/toolkit";

import BigNumber from "bignumber.js";
import { Operation } from "../../types/Operation";
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
  operations: Record<string, Operation>;
};

export type TezBalancePayload = { pkh: string; tez: BigNumber };
export type TokenBalancePayload = { pkh: string; tokens: Token[] };
export type OperationsPayload = { pkh: string; operations: Operation };

const initialBalance: balance = {
  tez: null,
  tokens: [],
};

const initialState: State = {
  network: TezosNetwork.MAINNET,
  balances: {},
  operations: {},
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
    updateOperations: (
      state,
      { payload }: { type: string; payload: OperationsPayload[] }
    ) => {
      const operationsPayloads = payload;
      const newOperations = { ...state.operations };

      operationsPayloads.forEach(({ pkh, operations }) => {
        newOperations[pkh] = operations;
      });

      state.operations = newOperations;
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
  },
});

export default assetsSlice;
