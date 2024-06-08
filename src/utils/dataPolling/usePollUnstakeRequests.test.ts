import { usePollUnstakeRequests } from "./usePollUnstakeRequests";
import { mockImplicitAddress } from "../../mocks/factories";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getPendingUnstakeRequests } from "../tezos";

jest.mock("../tezos");

describe("usePollUnstakeRequests", () => {
  it("fetches the latest unstake requests for all accounts and updates the state", async () => {
    jest.mocked(getPendingUnstakeRequests).mockResolvedValue([
      {
        staker: { address: mockImplicitAddress(0).pkh },
        finalizableAmount: 123,
        cycle: 1,
      },
      {
        staker: { address: mockImplicitAddress(1).pkh },
        finalizableAmount: 321,
        cycle: 1,
      },
      {
        staker: { address: mockImplicitAddress(1).pkh },
        finalizableAmount: 3214,
        cycle: 3,
      },
    ]);

    renderHook(() => usePollUnstakeRequests());

    await waitFor(() => expect(getPendingUnstakeRequests).toHaveBeenCalled());
    expect(store.getState().assets.accountStates).toEqual({
      [mockImplicitAddress(0).pkh]: {
        unstakeRequests: [{ finalizableAmount: 123, cycle: 1 }],
      },
      [mockImplicitAddress(1).pkh]: {
        unstakeRequests: [
          { finalizableAmount: 321, cycle: 1 },
          { finalizableAmount: 3214, cycle: 3 },
        ],
      },
    });
  });
});
