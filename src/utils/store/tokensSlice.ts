import { TezosNetwork } from "@airgap/tezos";
import { createSlice } from "@reduxjs/toolkit";
import { compact, setWith } from "lodash";
import { RawPkh } from "../../types/Address";
import { fromRaw, RawTokenInfo, Token, TokenId } from "../../types/Token";

type State = Record<TezosNetwork, Record<RawPkh, Record<TokenId, Token>>>;

const initialState: State = {
  [TezosNetwork.MAINNET]: {},
  [TezosNetwork.GHOSTNET]: {},
};

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    reset: () => initialState,
    addTokens: (
      state: State,
      {
        payload: { network, tokens },
      }: { payload: { network: TezosNetwork; tokens: RawTokenInfo[] } }
    ) => {
      compact(tokens.map(fromRaw)).forEach(token => {
        setWith(state, [network, token.contract, token.tokenId], token, Object);
      });
    },
  },
});

export const tokensActions = tokensSlice.actions;
export default tokensSlice;
