import { createSlice } from "@reduxjs/toolkit";
import { compact, groupBy, mapValues } from "lodash";

import { accountsSlice } from "./accountsSlice";
import { RawPkh } from "../../../types/Address";
import { Delegate } from "../../../types/Delegate";
import { RawTokenBalance, TokenBalance, fromRaw } from "../../../types/TokenBalance";
import { TokenTransfer } from "../../../types/Transfer";
import { TzktAccount } from "../../tezos";

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
    tokens: Record<TransactionId, TokenTransfer | undefined>;
  };
  bakers: Delegate[];
  conversionRate: number | null; // XTZ/USD conversion rate
  refetchTrigger: number;
  isLoading: boolean;
  lastTimeUpdated: string | null;
};

export const initialState: State = {
  blockLevel: null,
  balances: {
    mutez: {},
    tokens: {},
  },
  transfers: { tokens: {} },
  delegationLevels: {},
  bakers: [],
  conversionRate: null,
  refetchTrigger: 0,
  isLoading: false,
  lastTimeUpdated: null,
};

export const assetsSlice = createSlice({
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
    // TODO: it might be growing "infinitely" when a user is scrolling through their operations
    // but it doesn't have to be stored in localStorage (check how it works if the app is closed and opened again)
    updateTokenTransfers: (state, { payload: transfers }: { payload: TokenTransfer[] }) => {
      transfers.forEach(transfer => {
        // these token transfers are fetched by transaction id and it's definitely present
        state.transfers.tokens[transfer.transactionId as number] = transfer;
      });
    },

    updateTezBalance: (state, { payload }: { payload: TzktAccount[] }) => {
      state.balances.mutez = payload.reduce(
        (acc, accountInfo) => ({ ...acc, [accountInfo.address]: String(accountInfo.balance) }),
        {}
      );
      state.delegationLevels = payload.reduce(
        (acc, accountInfo) => ({ ...acc, [accountInfo.address]: accountInfo.delegationLevel }),
        {}
      );
    },

    updateTokenBalance: (state, { payload }: { payload: RawTokenBalance[] }) => {
      const groupedByPkh = groupBy(payload, tokenBalance => tokenBalance.account.address);
      state.balances.tokens = mapValues(groupedByPkh, rawTokenBalances =>
        compact(rawTokenBalances.map(fromRaw)).map(({ balance, contract, tokenId, lastLevel }) => ({
          balance,
          contract,
          tokenId,
          lastLevel,
        }))
      );
    },

    removeAccountsData: (state, { payload: pkhs }: { payload: RawPkh[] }) => {
      pkhs.forEach(pkh => {
        delete state.balances.mutez[pkh];
        delete state.balances.tokens[pkh];
        delete state.delegationLevels[pkh];
      });
    },

    updateBakers: (state, { payload }: { payload: Delegate[] }) => {
      state.bakers = payload;
    },
    updateConversionRate: (state, { payload: rate }: { type: string; payload: number | null }) => {
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
