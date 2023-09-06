import { createSlice } from "@reduxjs/toolkit";
import { DelegationOperation } from "@tzkt/sdk-api";
import { compact, findIndex, groupBy, mapValues } from "lodash";
import accountsSlice from "./accountsSlice";
import { TezTransfer, TokenTransfer } from "../../../types/Transfer";
import { TzktAccount } from "../../tezos";
import { fromRaw, RawTokenBalance, TokenBalance } from "../../../types/TokenBalance";
import { Delegate } from "../../../types/Delegate";
import { AccountOperations } from "../../../components/sendForm/types";
import { RawPkh } from "../../../types/Address";

type State = {
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
  batches: AccountOperations[];
  refetchTrigger: number;
  isLoading: boolean;
  lastTimeUpdated: string | null;
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

const initialState: State = {
  blockLevel: null,
  balances: {
    mutez: {},
    tokens: {},
  },
  transfers: { tez: {}, tokens: {} },
  delegations: {},
  bakers: [],
  conversionRate: null,
  batches: [],
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
        return compact(rawTokenBalances.map(fromRaw)).map(({ balance, contract, tokenId }) => ({
          balance,
          contract,
          tokenId,
        }));
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
    // Don't use this action directly. Use thunk estimateAndUpdateBatch
    addToBatch: (state, { payload: operations }: { payload: AccountOperations }) => {
      const existing = state.batches.find(
        batch => batch.sender.address.pkh === operations.sender.address.pkh
      );
      if (existing) {
        (existing as AccountOperations).operations.push(...operations.operations);
        return;
      }
      state.batches.push(operations);
    },
    clearBatch: (state, { payload: { pkh } }: { type: string; payload: { pkh: RawPkh } }) => {
      const index = findIndex(state.batches, batch => batch.sender.address.pkh === pkh);
      if (index === -1) {
        return;
      }
      state.batches.splice(index, 1);
    },
    removeBatchItem: (
      state,
      { payload: { pkh, index } }: { payload: { pkh: RawPkh; index: number } }
    ) => {
      const batchIndex = findIndex(state.batches, batch => batch.sender.address.pkh === pkh);
      if (batchIndex === -1) {
        return;
      }
      const existingBatch = state.batches[batchIndex];
      if (index < existingBatch.operations.length) {
        existingBatch.operations.splice(index, 1);
      }
      if (existingBatch.operations.length === 0) {
        state.batches.splice(batchIndex, 1);
      }
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
