import { createSlice } from "@reduxjs/toolkit";
import { compact, fromPairs, setWith } from "lodash";
import { RawPkh } from "../../../types/Address";
import { DefaultNetworks, Network } from "../../../types/Network";
import { fromRaw, RawTokenInfo, Token, TokenId } from "../../../types/Token";

type State = Record<Network, Record<RawPkh, Record<TokenId, Token>> | undefined>;

const initialState: State = fromPairs(DefaultNetworks.map(network => [network, {}]));

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    reset: () => initialState,
    addTokens: (
      state: State,
      { payload: { network, tokens } }: { payload: { network: Network; tokens: RawTokenInfo[] } }
    ) => {
      compact(tokens.map(fromRaw)).forEach(token => {
        setWith(state, [network, token.contract, token.tokenId], token, Object);
      });
    },
  },
});

export const tokensActions = tokensSlice.actions;
export default tokensSlice;
