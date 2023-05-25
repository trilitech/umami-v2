import { TezosNetwork } from "@airgap/tezos";
import { createSlice } from "@reduxjs/toolkit";
import { DelegationOperation } from "@tzkt/sdk-api";

import { OperationValue } from "../../components/sendForm/types";
import { Baker } from "../../types/Baker";
import { TezTransfer, TokenTransfer } from "../../types/Operation";
import { Token } from "../../types/Token";
import accountsSlice from "./accountsSlice";

export type BatchItem = { operation: OperationValue; fee: string };
export type Batch = {
  isSimulating: boolean;
  items: Array<BatchItem>;
};

const emptyBatch: Batch = {
  isSimulating: false,
  items: [],
};

type State = {
  network: TezosNetwork;
  blockLevel: number | null;
  balances: {
    tez: Record<string, string | null>;
    tokens: Record<string, Token[]>;
  };
  operations: {
    tez: Record<string, TezTransfer[] | undefined>;
    tokens: Record<string, TokenTransfer[]>;
  };
  delegations: Record<string, DelegationOperation>;
  bakers: Baker[];
  conversionRate: number | null; // XTZ/USD conversion rate
  batches: Record<string, Batch | undefined>;
};

export type TezBalancePayload = { pkh: string; tez: string };
export type TokenBalancePayload = { pkh: string; tokens: Token[] };
export type TezTransfersPayload = {
  pkh: string;
  operations: TezTransfer[];
};
export type TokenTransfersPayload = {
  pkh: string;
  operations: TokenTransfer[];
};

export type DelegationPayload = {
  pkh: string;
  delegation: DelegationOperation;
};

export type ConversionRatePayload = { rate: State["conversionRate"] };

export type BatchPayload = {
  pkh: string;
  items: Array<BatchItem>;
};

const initialState: State = {
  network: TezosNetwork.MAINNET,
  blockLevel: null,
  balances: {
    tez: {},
    tokens: {},
  },
  operations: { tez: {}, tokens: {} },
  delegations: {},
  bakers: [],
  conversionRate: null,
  batches: {},
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  // Reset assets state if accounts are reset
  extraReducers: (builder) =>
    // This throw error: TS2589: Type instantiation is excessively deep and possibly infinite.
    // Because of use of Taquito TransferParams["parameter"] in OperationValue that is too complex
    // What can this be fixed?

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    builder.addCase(accountsSlice.actions.reset, () => initialState),
  reducers: {
    reset: () => initialState,
    updateNetwork: (
      _,
      { payload }: { type: string; payload: TezosNetwork }
    ) => {
      return { ...initialState, network: payload };
    },
    updateBlockLevel: (state, { payload }: { payload: number }) => {
      state.blockLevel = payload;
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

      tezBalancePayloads.forEach((payload) => {
        if ("tez" in payload) {
          const existing = state.balances.tez;
          const newTezBalances = { ...existing, [payload.pkh]: payload.tez };
          state.balances.tez = newTezBalances;
          return;
        }

        const existing = state.balances.tokens;
        const newTokens = { ...existing, [payload.pkh]: payload.tokens };
        state.balances.tokens = newTokens;
      });
    },
    updateDelegations: (
      state,
      { payload }: { type: string; payload: DelegationPayload[] }
    ) => {
      payload.forEach((p) => {
        state.delegations[p.pkh] = p.delegation;
      });
    },
    updateBakers: (state, { payload }: { type: string; payload: Baker[] }) => {
      const sortedBakers = [...payload].sort((a, b) =>
        a.name > b.name ? 1 : -1
      );
      state.bakers = sortedBakers;
    },
    updateConversionRate: (
      state,
      { payload: { rate } }: { type: string; payload: ConversionRatePayload }
    ) => {
      state.conversionRate = rate;
    },
    // Don't use this action directly. Use thunk simulateAndUpdateBatch
    updateBatch: (
      state,
      {
        payload: { pkh, items: transfers },
      }: { type: string; payload: BatchPayload }
    ) => {
      const existing = (state.batches[pkh] || emptyBatch) as Batch;
      const newBatch: Batch = {
        ...existing,
        items: [...existing.items, ...transfers],
      };
      state.batches[pkh] = newBatch;
    },
    batchSimulationStart: (
      state,
      { payload: { pkh } }: { type: string; payload: { pkh: string } }
    ) => {
      const existing = state.batches[pkh] || emptyBatch;

      if (existing) {
        state.batches[pkh] = { ...existing, isSimulating: true };
      }
    },
    batchSimulationEnd: (
      state,
      { payload: { pkh } }: { type: string; payload: { pkh: string } }
    ) => {
      const existing = state.batches[pkh];

      if (existing) {
        state.batches[pkh] = { ...existing, isSimulating: false };
      }
    },
    clearBatch: (
      state,
      { payload: { pkh } }: { type: string; payload: { pkh: string } }
    ) => {
      if (state.batches[pkh]?.isSimulating) {
        return;
      }

      delete state.batches[pkh];
    },
  },
});

export const assetsActions = assetsSlice.actions;

export default assetsSlice;
