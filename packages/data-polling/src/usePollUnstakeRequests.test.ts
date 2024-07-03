import { mockImplicitAccount } from "@umami/core";
import { addTestAccount, makeStore } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";
import { getPendingUnstakeRequests } from "@umami/tzkt";

import { renderHook, waitFor } from "./testUtils";
import { usePollUnstakeRequests } from "./usePollUnstakeRequests";

jest.mock("@umami/tzkt");

describe("usePollUnstakeRequests", () => {
  it("fetches the latest unstake requests for all accounts and updates the state", async () => {
    const store = makeStore();
    addTestAccount(store, mockImplicitAccount(0));
    jest.mocked(getPendingUnstakeRequests).mockResolvedValue([
      {
        staker: { address: mockImplicitAddress(0).pkh },
        amount: 123,
        cycle: 1,
        status: "finalizable",
      },
      {
        staker: { address: mockImplicitAddress(1).pkh },
        amount: 321,
        cycle: 1,
        status: "finalizable",
      },
      {
        staker: { address: mockImplicitAddress(1).pkh },
        amount: 3214,
        cycle: 3,
        status: "finalizable",
      },
    ]);

    renderHook(() => usePollUnstakeRequests(), { store });

    await waitFor(() => expect(getPendingUnstakeRequests).toHaveBeenCalled());
    expect(store.getState().assets.accountStates).toEqual({
      [mockImplicitAddress(0).pkh]: {
        unstakeRequests: [{ amount: 123, cycle: 1, status: "finalizable" }],
      },
      [mockImplicitAddress(1).pkh]: {
        unstakeRequests: [
          { amount: 321, cycle: 1, status: "finalizable" },
          { amount: 3214, cycle: 3, status: "finalizable" },
        ],
      },
    });
  });
});
