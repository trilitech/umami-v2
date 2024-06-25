import { waitFor } from "@testing-library/react";
import { mockImplicitAddress, mockNFTToken } from "@umami/test-utils";
import { getTokenBalances } from "@umami/tzkt";

import { usePollTokenBalances } from "./usePollTokenBalances";
import { renderHook } from "../../mocks/testUtils";
import { store } from "../redux/store";

jest.mock("@umami/tzkt");

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
