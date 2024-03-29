import { createSlice } from "@reduxjs/toolkit";
import { compact, fromPairs, setWith } from "lodash";

import { RawPkh } from "../../../types/Address";
import { DefaultNetworks, Network, NetworkName } from "../../../types/Network";
import { RawTokenInfo, Token, TokenId, fromRaw } from "../../../types/Token";

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
