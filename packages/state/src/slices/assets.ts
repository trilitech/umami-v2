import { createSlice } from "@reduxjs/toolkit";
import { type Delegate, type TokenBalance, fromRawTokenBalance } from "@umami/core";
import { type RawPkh } from "@umami/tezos";
import {
  type RawTzktAccount,
  type RawTzktTokenBalance,
  type RawTzktTokenTransfer,
  type RawTzktUnstakeRequest,
  type TzktAlias,
} from "@umami/tzkt";
import { compact, groupBy, omit, sortBy } from "lodash";

import { accountsActions } from "./accounts/accounts";

type TransactionId = number;

type AccountState = {
  delegate: TzktAlias | null;
  balance: number;
  stakedBalance: number;
  tokens: TokenBalance[];
  unstakeRequests: RawTzktUnstakeRequest[];
};

type State = {
  block: {
    level?: number;
    cycle?: number;
  };
  accountStates: Record<RawPkh, AccountState | undefined>;
  transfers: {
    tokens: Record<TransactionId, RawTzktTokenTransfer | undefined>;
  };
  bakers: Delegate[];
  conversionRate: number | undefined; // XTZ/USD conversion rate
  refetchTrigger: number;
  isLoading: boolean;
  lastTimeUpdated: string | null;
};

export const assetsInitialState: State = {
  block: {},
  transfers: { tokens: {} },
  accountStates: {},
  bakers: [],
  conversionRate: undefined,
  refetchTrigger: 0,
  isLoading: false,
  lastTimeUpdated: null,
};

export const assetsSlice = createSlice({
  name: "assets",
  initialState: assetsInitialState,
  // Reset assets state if accounts are reset
  extraReducers: builder => builder.addCase(accountsActions.reset, () => assetsInitialState),
  reducers: {
    reset: () => assetsInitialState,
    updateBlock: (state, { payload }: { payload: { level: number; cycle: number } }) => {
      state.block = payload;
    },
    updateTokenTransfers: (state, { payload: transfers }: { payload: RawTzktTokenTransfer[] }) => {
      transfers.forEach(transfer => {
        // these token transfers are fetched by transaction id and it's definitely present
        state.transfers.tokens[transfer.transactionId!] = transfer;
      });
    },
    updateAccountStates: (state, { payload }: { payload: RawTzktAccount[] }) => {
      payload.forEach(accountInfo => {
        const {
          balance: totalBalance,
          address,
          delegate,
          stakedBalance,
          unstakedBalance,
          rollupBonds,
          smartRollupBonds,
        } = accountInfo;

        const balance =
          totalBalance - stakedBalance - unstakedBalance - rollupBonds - smartRollupBonds;

        state.accountStates[address] = {
          ...state.accountStates[address],
          ...{ delegate, balance, stakedBalance },
        } as AccountState;
      });
    },
    updateUnstakeRequests: (state, { payload }: { payload: RawTzktUnstakeRequest[] }) => {
      const groupedByPkh = groupBy(payload, req => req.staker.address);

      for (const accountState of Object.values(state.accountStates)) {
        accountState!.unstakeRequests = [];
      }

      for (const [pkh, unstakeRequests] of Object.entries(groupedByPkh)) {
        state.accountStates[pkh] = {
          ...state.accountStates[pkh],
          unstakeRequests: sortBy(
            unstakeRequests.map(req => omit(req, "staker")),
            "cycle"
          ),
        } as AccountState;
      }
    },
    // when we change networks current account states become obsolete
    cleanAccountStates: state => {
      state.accountStates = {};
    },
    updateTokenBalance: (state, { payload }: { payload: RawTzktTokenBalance[] }) => {
      const groupedByPkh = groupBy(payload, tokenBalance => tokenBalance.account.address);

      for (const accountState of Object.values(state.accountStates)) {
        accountState!.tokens = [];
      }
      for (const [pkh, rawTokenBalances] of Object.entries(groupedByPkh)) {
        const accountTokenBalances = compact(rawTokenBalances.map(fromRawTokenBalance)).map(
          ({ balance, contract, tokenId, lastLevel }) => ({
            balance,
            contract,
            tokenId,
            lastLevel,
          })
        );
        state.accountStates[pkh] = {
          ...state.accountStates[pkh],
          tokens: accountTokenBalances,
        } as AccountState;
      }
    },
    removeAccountsData: (state, { payload: pkhs }: { payload: RawPkh[] }) => {
      pkhs.forEach(pkh => {
        delete state.accountStates[pkh];
      });
    },
    updateBakers: (state, { payload }: { payload: Delegate[] }) => {
      state.bakers = payload;
    },
    updateConversionRate: (
      state,
      { payload: rate }: { type: string; payload: number | undefined }
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
