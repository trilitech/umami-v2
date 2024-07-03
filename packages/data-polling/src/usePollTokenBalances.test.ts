import { waitFor } from "@testing-library/react";
import { mockNFTToken } from "@umami/core";
import { makeStore } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";
import { getTokenBalances } from "@umami/tzkt";

import { renderHook } from "./testUtils";
import { usePollTokenBalances } from "./usePollTokenBalances";

jest.mock("@umami/tzkt");

describe("usePollTokenBalances", () => {
  it("fetches token balances and updates the state", async () => {
    const store = makeStore();
    jest
      .mocked(getTokenBalances)
      .mockResolvedValue([
        mockNFTToken(0, mockImplicitAddress(0).pkh),
        mockNFTToken(1, mockImplicitAddress(0).pkh, 5),
        { ...mockNFTToken(0, mockImplicitAddress(1).pkh), lastLevel: 5 },
      ]);

    renderHook(() => usePollTokenBalances(), { store });

    await waitFor(() => expect(getTokenBalances).toHaveBeenCalledTimes(1));

    expect(store.getState().assets.accountStates).toEqual({
      [mockImplicitAddress(0).pkh]: {
        tokens: [
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
      },
      [mockImplicitAddress(1).pkh]: {
        tokens: [
          {
            balance: "1",
            contract: "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
            lastLevel: 5,
            tokenId: "0",
          },
        ],
      },
    });
  });
});
