import { usePollBakers } from "./usePollBakers";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getBakers } from "../tezos";

jest.mock("../tezos");

describe("usePollBakers", () => {
  it("fetches baker data and updates the state", async () => {
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

    renderHook(() => usePollBakers());

    await waitFor(() => expect(getBakers).toHaveBeenCalled());
    expect(store.getState().assets.bakers).toEqual(mockBakers);
  });
});
