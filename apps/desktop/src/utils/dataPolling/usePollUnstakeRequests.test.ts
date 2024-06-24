import { mockImplicitAddress } from "@umami/test-utils";
import { getPendingUnstakeRequests } from "@umami/tzkt";

import { usePollUnstakeRequests } from "./usePollUnstakeRequests";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";

jest.mock("@umami/tzkt");

describe("usePollUnstakeRequests", () => {
  it("fetches the latest unstake requests for all accounts and updates the state", async () => {
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

    renderHook(() => usePollUnstakeRequests());

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
