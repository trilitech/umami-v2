import { waitFor } from "@testing-library/react";

import { usePollTokenBalances } from "./usePollTokenBalances";
import { mockImplicitAddress, mockNFTToken } from "../../mocks/factories";
import { renderHook } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getTokenBalances } from "../tezos";

jest.mock("../tezos");

describe("usePollTokenBalances", () => {
  it("fetches token balances and updates the state", async () => {
    jest
      .mocked(getTokenBalances)
      .mockResolvedValue([
        mockNFTToken(0, mockImplicitAddress(0).pkh),
        mockNFTToken(1, mockImplicitAddress(0).pkh, 5),
        { ...mockNFTToken(0, mockImplicitAddress(1).pkh), lastLevel: 5 },
      ]);

    renderHook(() => usePollTokenBalances());

    await waitFor(() => expect(getTokenBalances).toHaveBeenCalledTimes(1));

    // const tokens = tokenBalances.map(({ token, lastLevel }) => ({ ...token, lastLevel }));
    // dispatch(tokensActions.addTokens({ network, tokens }));
    // dispatch(assetsActions.updateTokenBalance(tokenBalances));

    expect(store.getState().assets.balances.tokens).toEqual({
      [mockImplicitAddress(0).pkh]: [
        {
          balance: "1",
          contract: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
          lastLevel: undefined,
          tokenId: "0",
        },
        {
          balance: "5",
          contract: "KT1CSKPf2jeLpMmrgKquN2bCjBTkAcAdRVDy",
          lastLevel: undefined,
          tokenId: "1",
        },
      ],
      [mockImplicitAddress(1).pkh]: [
        {
          balance: "1",
          contract: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
          lastLevel: 5,
          tokenId: "0",
        },
      ],
    });
  });
});
