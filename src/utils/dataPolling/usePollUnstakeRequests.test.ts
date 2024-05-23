import { usePollUnstakeRequests } from "./usePollUnstakeRequests";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getPendingUnstakeRequests } from "../tezos";

jest.mock("../tezos");

describe("usePollUnstakeRequests", () => {
  it("fetches the latest unstake requests for all accounts and updates the state", async () => {
    jest.mocked(getPendingUnstakeRequests).mockResolvedValue([
      { staker: "foo", requestedAmount: 123, timestamp: "2024-05-23T00:14:37Z", cycle: 1 },
      { staker: "bar", requestedAmount: 321, timestamp: "2024-05-23T00:14:37Z", cycle: 1 },
    ]);

    renderHook(() => usePollUnstakeRequests());

    await waitFor(() => expect(getPendingUnstakeRequests).toHaveBeenCalled());
    expect(store.getState().assets.accountStates).toEqual({
      foo: {
        unstakeRequests: [{ requestedAmount: 123, timestamp: "2024-05-23T00:14:37Z", cycle: 1 }],
      },
      bar: {
        unstakeRequests: [{ requestedAmount: 321, timestamp: "2024-05-23T00:14:37Z", cycle: 1 }],
      },
    });
  });
});
