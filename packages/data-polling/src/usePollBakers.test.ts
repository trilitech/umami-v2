import { makeStore } from "@umami/state";
import { getBakers } from "@umami/tzkt";

import { renderHook, waitFor } from "./testUtils";
import { usePollBakers } from "./usePollBakers";

jest.mock("@umami/tzkt");

describe("usePollBakers", () => {
  it("fetches baker data and updates the state", async () => {
    const store = makeStore();
    const mockBakers = [
      {
        address: "tz1KkkHxdHByHRB7x1qMUthmU38fUmCrwnZW",
        name: "Unknown baker",
        stakingBalance: 7699672384,
      },
      {
        address: "tz1brWSr91ZygR4gi5o19yo8QMff926y2B5e",
        name: "AgeaenesBakery",
        stakingBalance: 6502794063,
      },
      {
        address: "tz1cvmzqGMyNpr2TSfk7g9DxSns2A5eM2fo5",
        name: "Unknown baker",
        stakingBalance: 1,
      },
    ];
    jest.mocked(getBakers).mockResolvedValue(mockBakers);

    renderHook(() => usePollBakers(), { store });

    await waitFor(() => expect(getBakers).toHaveBeenCalled());
    expect(store.getState().assets.bakers).toEqual(mockBakers);
  });
});
