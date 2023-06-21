import { TezosNetwork } from "@airgap/tezos";
import { createSlice } from "@reduxjs/toolkit";
import { DelegationOperation } from "@tzkt/sdk-api";
import { compact } from "lodash";

import { OperationValue } from "../../components/sendForm/types";
import { Asset, fromToken } from "../../types/Asset";
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
    mutez: Record<string, string | undefined>;
    tokens: Record<string, Asset[] | undefined>;
  };
  transfers: {
    tez: Record<string, TezTransfer[] | undefined>;
    tokens: Record<string, TokenTransfer[] | undefined>;
  };
  delegations: Record<string, DelegationOperation | undefined>;
  bakers: Baker[];
  conversionRate: number | null; // XTZ/USD conversion rate
  batches: Record<string, Batch | undefined>;
};

export type TezBalancePayload = { pkh: string; tez: string };
export type TokenBalancePayload = { pkh: string; tokens: Token[] };
export type TezTransfersPayload = {
  pkh: string;
  transfers: TezTransfer[];
};
export type TokenTransfersPayload = {
  pkh: string;
  transfers: TokenTransfer[];
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
    mutez: {},
    tokens: {},
  },
  transfers: { tez: {}, tokens: {} },
  delegations: {},
  bakers: [],
  conversionRate: null,
  batches: {},
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  // Reset assets state if accounts are reset
  extraReducers: builder =>
    // This throw error: TS2589: Type instantiation is excessively deep and possibly infinite.
    // Because of use of Taquito TransferParams["parameter"] in OperationValue that is too complex
    // What can this be fixed?

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    builder.addCase(accountsSlice.actions.reset, () => initialState),
  reducers: {
    reset: () => initialState,
    updateNetwork: (_, { payload }: { type: string; payload: TezosNetwork }) => {
      return { ...initialState, network: payload };
    },
    updateBlockLevel: (state, { payload }: { payload: number }) => {
      state.blockLevel = payload;
    },
    updateTezTransfers: (state, { payload }: { type: string; payload: TezTransfersPayload[] }) => {
      const tezOperationsPayload = payload;
      const newTezTransfers = { ...state.transfers.tez };

      tezOperationsPayload.forEach(op => {
        const { pkh, transfers } = op;
        newTezTransfers[pkh] = transfers;
      });
      state.transfers.tez = newTezTransfers;
    },
    // TODO refactor duplication
    updateTokenTransfers: (
      state,
      { payload }: { type: string; payload: TokenTransfersPayload[] }
    ) => {
      const tezOperationsPayload = payload;
      const newTezTransfers = { ...state.transfers.tokens };

      tezOperationsPayload.forEach(op => {
        const { pkh, transfers } = op;
        newTezTransfers[pkh] = transfers;
      });

      state.transfers.tokens = newTezTransfers;
    },

    updateTezBalance: (state, { payload }: { type: string; payload: TezBalancePayload[] }) => {
      const newTezBalances: Record<string, string | undefined> = {};

      payload.forEach(tezBalance => {
        newTezBalances[tezBalance.pkh] = tezBalance.tez;
      });

      state.balances.mutez = newTezBalances;
    },

    updateTokenBalance: (state, { payload }: { type: string; payload: TokenBalancePayload[] }) => {
      const newTokenBalances: Record<string, Asset[] | undefined> = {};

      payload.forEach(tokenBalance => {
        newTokenBalances[tokenBalance.pkh] = compact(tokenBalance.tokens.map(fromToken));
      });

      state.balances.tokens = newTokenBalances;
    },

    updateDelegations: (state, { payload }: { type: string; payload: DelegationPayload[] }) => {
      //TODO: store a list of delegations for the operation views
      payload.forEach(p => {
        state.delegations[p.pkh] = p.delegation;
      });
    },
    updateBakers: (state, { payload }: { type: string; payload: Baker[] }) => {
      const sortedBakers = [...payload].sort((a, b) => (a.name > b.name ? 1 : -1));
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
      { payload: { pkh, items: transfers } }: { type: string; payload: BatchPayload }
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
    clearBatch: (state, { payload: { pkh } }: { type: string; payload: { pkh: string } }) => {
      if (state.batches[pkh]?.isSimulating) {
        return;
      }

      delete state.batches[pkh];
    },
  },
});

export const assetsActions = assetsSlice.actions;

export default assetsSlice;
