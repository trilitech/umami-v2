import { createSlice } from "@reduxjs/toolkit";
import { compact, fromPairs, setWith } from "lodash";

import { type RawPkh } from "../../../types/Address";
import { DefaultNetworks, type Network, type NetworkName } from "../../../types/Network";
import { type RawTokenInfo, type Token, type TokenId, fromRaw } from "../../../types/Token";

type State = Record<NetworkName, Record<RawPkh, Record<TokenId, Token>> | undefined>;

export const initialState: State = fromPairs(DefaultNetworks.map(network => [network.name, {}]));

export const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    reset: () => initialState,
    addTokens: (
      state: State,
      { payload: { network, tokens } }: { payload: { network: Network; tokens: RawTokenInfo[] } }
    ) => {
      compact(tokens.map(fromRaw)).forEach(token => {
        setWith(state, [network.name, token.contract, token.tokenId], token, Object);
      });
    },
  },
});

export const tokensActions = tokensSlice.actions;
