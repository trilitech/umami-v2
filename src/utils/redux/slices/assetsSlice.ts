import { createSlice } from "@reduxjs/toolkit";
import { DelegationOperation } from "@tzkt/sdk-api";
import { compact, groupBy, mapValues } from "lodash";
import accountsSlice from "./accountsSlice";
import { TezTransfer, TokenTransfer } from "../../../types/Transfer";
import { TzktAccount } from "../../tezos";
import { fromRaw, RawTokenBalance, TokenBalance } from "../../../types/TokenBalance";
import { Delegate } from "../../../types/Delegate";
import { RawPkh } from "../../../types/Address";

type TransactionId = number;

type State = {
  blockLevel: number | null;
  balances: {
    mutez: Record<string, string | undefined>;
    tokens: Record<string, TokenBalance[] | undefined>;
  };
  // TODO: This is a crutch, has to be merged with balances.mutez into an account state
  delegationLevels: Record<string, number | undefined>;
  transfers: {
    tez: Record<string, TezTransfer[] | undefined>;
    tokens: Record<TransactionId, TokenTransfer | undefined>;
  };
  bakers: Delegate[];
  conversionRate: number | null; // XTZ/USD conversion rate
  refetchTrigger: number;
  isLoading: boolean;
  lastTimeUpdated: string | null;
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
  delegationLevels: {},
  bakers: [],
  conversionRate: null,
  refetchTrigger: 0,
  isLoading: false,
  lastTimeUpdated: null,
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  // Reset assets state if accounts are reset
  extraReducers: builder =>
    // @ts-ignore: TS2589 Type instantiation is excessively deep and possibly infinite
    builder.addCase(accountsSlice.actions.reset, () => initialState),
  reducers: {
    reset: () => initialState,
    updateBlockLevel: (state, { payload }: { payload: number }) => {
      state.blockLevel = payload;
    },
    updateTokenTransfers: (state, { payload: transfers }: { payload: TokenTransfer[] }) => {
      transfers.forEach(transfer => {
        state.transfers.tokens[transfer.transactionId] = transfer;
      });
    },

    updateTezBalance: (state, { payload }: { payload: TzktAccount[] }) => {
      state.balances.mutez = payload.reduce((acc, accountInfo) => {
        return { ...acc, [accountInfo.address]: String(accountInfo.balance) };
      }, {});
      state.delegationLevels = payload.reduce((acc, accountInfo) => {
        return { ...acc, [accountInfo.address]: accountInfo.delegationLevel };
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

    updateBakers: (state, { payload }: { payload: Delegate[] }) => {
      state.bakers = payload;
    },
    updateConversionRate: (
      state,
      { payload: { rate } }: { type: string; payload: ConversionRatePayload }
    ) => {
      state.conversionRate = rate;
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
