import { mockImplicitAddress, rawAccountFixture } from "@umami/test-utils";
import { getAccounts } from "@umami/tzkt";

import { usePollAccountStates } from "./usePollAccountStates";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";

jest.mock("@umami/tzkt");

describe("usePollAccountStates", () => {
  it("fetches tez balances and updates the state", async () => {
    jest.mocked(getAccounts).mockResolvedValue([
      rawAccountFixture({
        address: mockImplicitAddress(0).pkh,
        balance: 1230,
        stakedBalance: 123,
        unstakedBalance: 321,
        delegate: null,
      }),
      rawAccountFixture({
        address: mockImplicitAddress(1).pkh,
        balance: 6455,
        stakedBalance: 1234,
        unstakedBalance: 3214,
        delegate: { address: mockImplicitAddress(0).pkh },
      }),
      rawAccountFixture({
        address: mockImplicitAddress(2).pkh,
        balance: 8760,
        stakedBalance: 1234,
        unstakedBalance: 3214,
        delegate: { address: mockImplicitAddress(0).pkh, alias: "Some baker" },
      }),
    ]);

    renderHook(() => usePollAccountStates());

    await waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1));

    expect(store.getState().assets.accountStates).toEqual({
      [mockImplicitAddress(0).pkh]: {
        balance: 786,
        stakedBalance: 123,
        delegate: null,
      },
      [mockImplicitAddress(1).pkh]: {
        balance: 2007,
        stakedBalance: 1234,
        delegate: { address: mockImplicitAddress(0).pkh },
      },
      [mockImplicitAddress(2).pkh]: {
        balance: 4312,
        stakedBalance: 1234,
        delegate: { address: mockImplicitAddress(0).pkh, alias: "Some baker" },
      },
    });
  });
});
