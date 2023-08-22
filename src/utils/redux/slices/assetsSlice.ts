import { createSlice } from "@reduxjs/toolkit";
import { DelegationOperation } from "@tzkt/sdk-api";
import { compact, groupBy, mapValues } from "lodash";
import accountsSlice from "./accountsSlice";
import { TezosNetwork } from "../../../types/TezosNetwork";
import { TezTransfer, TokenTransfer } from "../../../types/Transfer";
import { TzktAccount } from "../../tezos";
import { eraseToken, fromRaw, RawTokenBalance, TokenBalance } from "../../../types/TokenBalance";
import { Delegate } from "../../../types/Delegate";
import { FormOperations } from "../../../components/sendForm/types";

type State = {
  network: TezosNetwork;
  blockLevel: number | null;
  balances: {
    mutez: Record<string, string | undefined>;
    tokens: Record<string, TokenBalance[] | undefined>;
  };
  transfers: {
    tez: Record<string, TezTransfer[] | undefined>;
    tokens: Record<string, TokenTransfer[] | undefined>;
  };
  delegations: Record<string, DelegationOperation | undefined>;
  bakers: Delegate[];
  conversionRate: number | null; // XTZ/USD conversion rate
  batches: Record<string, FormOperations | undefined>;
  refetchTrigger: number;
  isLoading: boolean;
  lastTimeUpdated: string | null;
};

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
  operations: FormOperations;
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
  refetchTrigger: 0,
  isLoading: false,
  lastTimeUpdated: null,
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

    updateTezBalance: (state, { payload }: { payload: TzktAccount[] }) => {
      state.balances.mutez = payload.reduce((acc, accountInfo) => {
        return { ...acc, [accountInfo.address]: String(accountInfo.balance) };
      }, {});
    },

    updateTokenBalance: (state, { payload }: { payload: RawTokenBalance[] }) => {
      const groupedByPkh = groupBy(payload, tokenBalance => tokenBalance.account.address);
      state.balances.tokens = mapValues(groupedByPkh, rawTokenBalances => {
        return compact(rawTokenBalances.map(fromRaw)).map(eraseToken);
      });
    },

    updateDelegations: (state, { payload }: { type: string; payload: DelegationPayload[] }) => {
      //TODO: store a list of delegations for the operation views
      payload.forEach(p => {
        state.delegations[p.pkh] = p.delegation;
      });
    },
    updateBakers: (state, { payload }: { payload: Delegate[] }) => {
      state.bakers = payload;
    },
    updateConversionRate: (
      state,
      { payload: { rate } }: { type: string; payload: ConversionRatePayload }
    ) => {
      state.conversionRate = rate;
    },
    // Don't use this action directly. Use thunk simulateAndUpdateBatch
    addToBatch: (state, { payload: { pkh, operations } }: { payload: BatchPayload }) => {
      const existing = state.batches[pkh] as FormOperations | undefined;
      if (existing) {
        existing.content.push(...operations.content);
        return;
      }
      state.batches[pkh] = operations;
    },
    clearBatch: (state, { payload: { pkh } }: { type: string; payload: { pkh: string } }) => {
      delete state.batches[pkh];
    },
    refetch: state => {
      state.refetchTrigger += 1;
    },
    setIsLoading: (state, { payload: isLoading }: { payload: boolean }) => {
      state.isLoading = isLoading;
    },
    setLastTimeUpdated: (state, { payload: lastTimeUpdated }: { payload: string }) => {
      state.lastTimeUpdated = lastTimeUpdated;
    },
  },
});

export const assetsActions = assetsSlice.actions;

export default assetsSlice;
