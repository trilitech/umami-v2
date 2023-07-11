import { TezosNetwork } from "@airgap/tezos";
import { createSlice } from "@reduxjs/toolkit";
import { DelegationOperation } from "@tzkt/sdk-api";
import { compact, groupBy, mapValues } from "lodash";
import { TokenBalance, fromRaw, eraseToken } from "../../types/TokenBalance";
import { Baker } from "../../types/Baker";
import { TezTransfer, TokenTransfer } from "../../types/Transfer";
import { RawTokenBalance } from "../../types/TokenBalance";
import { TzktAccount } from "../tezos";
import accountsSlice from "./accountsSlice";
import { Operation } from "../../types/Operation";
import { RawPkh } from "../../types/Address";

export type BatchItem = { operation: Operation; fee: string };
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
    mutez: Record<RawPkh, string | undefined>;
    tokens: Record<RawPkh, TokenBalance[] | undefined>;
  };
  transfers: {
    tez: Record<RawPkh, TezTransfer[] | undefined>;
    tokens: Record<RawPkh, TokenTransfer[] | undefined>; // TODO: make it not store token info because it's stored already in the tokensSlice
  };
  delegations: Record<RawPkh, DelegationOperation | undefined>;
  bakers: Baker[];
  conversionRate: number | null; // XTZ/USD conversion rate
  batches: Record<RawPkh, Batch | undefined>;
};

export type TezTransfersPayload = {
  pkh: RawPkh;
  transfers: TezTransfer[];
};
export type TokenTransfersPayload = {
  pkh: RawPkh;
  transfers: TokenTransfer[];
};

export type DelegationPayload = {
  pkh: RawPkh;
  delegation: DelegationOperation;
};

export type ConversionRatePayload = { rate: State["conversionRate"] };

export type BatchPayload = {
  pkh: RawPkh;
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
    // Because of use of Taquito TransferParams["parameter"] in Operation that is too complex
    // What can this be fixed?

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    builder.addCase(accountsSlice.actions.reset, () => initialState),
  reducers: {
    reset: () => initialState,
    updateNetwork: (_, { payload }: { payload: TezosNetwork }) => {
      return { ...initialState, network: payload };
    },
    updateBlockLevel: (state, { payload }: { payload: number }) => {
      state.blockLevel = payload;
    },
    updateTezTransfers: (state, { payload }: { payload: TezTransfersPayload[] }) => {
      const tezOperationsPayload = payload;
      const newTezTransfers = { ...state.transfers.tez };

      tezOperationsPayload.forEach(op => {
        const { pkh, transfers } = op;
        newTezTransfers[pkh] = transfers;
      });
      state.transfers.tez = newTezTransfers;
    },
    // TODO refactor duplication
    updateTokenTransfers: (state, { payload }: { payload: TokenTransfersPayload[] }) => {
      const tezOperationsPayload = payload;
      const newTezTransfers = { ...state.transfers.tokens };

      tezOperationsPayload.forEach(op => {
        const { pkh, transfers } = op;
        newTezTransfers[pkh] = transfers;
      });

      state.transfers.tokens = newTezTransfers;
    },

    updateTezBalance: (state, { payload }: { payload: TzktAccount[] }) => {
      state.balances.mutez = payload.reduce((acc, accountInfo) => {
        return { ...acc, [accountInfo.address]: String(accountInfo.balance) };
      }, {});
    },

    updateTokenBalance: (state, { payload }: { payload: RawTokenBalance[] }) => {
      const groupedByPkh = groupBy(payload, tokenBalance => {
        return tokenBalance.account.address;
      });
      state.balances.tokens = mapValues(groupedByPkh, rawTokenBalances => {
        return compact(rawTokenBalances.map(fromRaw)).map(eraseToken);
      });
    },

    updateDelegations: (state, { payload }: { payload: DelegationPayload[] }) => {
      //TODO: store a list of delegations for the operation views
      payload.forEach(p => {
        state.delegations[p.pkh] = p.delegation;
      });
    },
    updateBakers: (state, { payload }: { payload: Baker[] }) => {
      const sortedBakers = [...payload].sort((a, b) => (a.name > b.name ? 1 : -1));
      state.bakers = sortedBakers;
    },
    updateConversionRate: (state, { payload: { rate } }: { payload: ConversionRatePayload }) => {
      state.conversionRate = rate;
    },
    // Don't use this action directly. Use thunk simulateAndUpdateBatch
    updateBatch: (state, { payload: { pkh, items: transfers } }: { payload: BatchPayload }) => {
      const existing = (state.batches[pkh] || emptyBatch) as Batch;
      const newBatch: Batch = {
        ...existing,
        items: [...existing.items, ...transfers],
      };
      state.batches[pkh] = newBatch;
    },
    batchSimulationStart: (state, { payload: { pkh } }: { payload: { pkh: RawPkh } }) => {
      const existing = state.batches[pkh] || emptyBatch;

      if (existing) {
        state.batches[pkh] = { ...existing, isSimulating: true };
      }
    },
    batchSimulationEnd: (state, { payload: { pkh } }: { payload: { pkh: RawPkh } }) => {
      const existing = state.batches[pkh];

      if (existing) {
        state.batches[pkh] = { ...existing, isSimulating: false };
      }
    },
    clearBatch: (state, { payload: { pkh } }: { payload: { pkh: RawPkh } }) => {
      if (state.batches[pkh]?.isSimulating) {
        return;
      }

      delete state.batches[pkh];
    },
  },
});

export const assetsActions = assetsSlice.actions;

export default assetsSlice;
