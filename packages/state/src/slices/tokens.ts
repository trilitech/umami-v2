import { createSlice } from "@reduxjs/toolkit";
import { type Token, type TokenId, fromRawToken } from "@umami/core";
import { DefaultNetworks, type Network, type NetworkName, type RawPkh } from "@umami/tezos";
import { type RawTzktTokenInfo } from "@umami/tzkt";
import { compact, fromPairs, setWith } from "lodash";

type State = Record<NetworkName, Record<RawPkh, Record<TokenId, Token>> | undefined>;

export const tokensInitialState: State = fromPairs(
  DefaultNetworks.map(network => [network.name, {}])
);

export const tokensSlice = createSlice({
  name: "tokens",
  initialState: tokensInitialState,
  reducers: {
    reset: () => tokensInitialState,
    addTokens: (
      state: State,
      {
        payload: { network, tokens },
      }: { payload: { network: Network; tokens: RawTzktTokenInfo[] } }
    ) => {
      compact(tokens.map(fromRawToken)).forEach(token => {
        setWith(state, [network.name, token.contract, token.tokenId], token, Object);
      });
    },
  },
});

export const tokensActions = tokensSlice.actions;
