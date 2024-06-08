import { createSlice } from "@reduxjs/toolkit";
import { compact, groupBy, omit, sortBy } from "lodash";

import { accountsSlice } from "./accountsSlice/accountsSlice";
import { RawPkh, TzktAlias } from "../../../types/Address";
import { Delegate } from "../../../types/Delegate";
import { RawTokenBalance, TokenBalance, fromRaw } from "../../../types/TokenBalance";
import { TokenTransfer } from "../../../types/Transfer";
import { TzktAccount } from "../../tezos";
import { RawTzktUnstakeRequest } from "../../tzkt/types";

type TransactionId = number;

type AccountState = {
  delegate: TzktAlias | null;
  balance: number;
  stakedBalance: number;
  unstakedBalance: number;
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
    tokens: Record<TransactionId, TokenTransfer | undefined>;
  };
  bakers: Delegate[];
  conversionRate: number | undefined; // XTZ/USD conversion rate
  refetchTrigger: number;
  isLoading: boolean;
  lastTimeUpdated: string | null;
};

export const initialState: State = {
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
  initialState,
  // Reset assets state if accounts are reset
  extraReducers: builder => builder.addCase(accountsSlice.actions.reset, () => initialState),
  reducers: {
    reset: () => initialState,
    updateBlock: (state, { payload }: { payload: { level: number; cycle: number } }) => {
      state.block = payload;
    },
    updateTokenTransfers: (state, { payload: transfers }: { payload: TokenTransfer[] }) => {
      transfers.forEach(transfer => {
        // these token transfers are fetched by transaction id and it's definitely present
        state.transfers.tokens[transfer.transactionId!] = transfer;
      });
    },
    updateAccountStates: (state, { payload }: { payload: TzktAccount[] }) => {
      payload.forEach(accountInfo => {
        state.accountStates[accountInfo.address] = {
          ...state.accountStates[accountInfo.address],
          ...omit(accountInfo, "address"),
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
    updateTokenBalance: (state, { payload }: { payload: RawTokenBalance[] }) => {
      const groupedByPkh = groupBy(payload, tokenBalance => tokenBalance.account.address);

      for (const accountState of Object.values(state.accountStates)) {
        accountState!.tokens = [];
      }

      for (const [pkh, rawTokenBalances] of Object.entries(groupedByPkh)) {
        const accountTokenBalances = compact(rawTokenBalances.map(fromRaw)).map(
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
