import { usePollTezBalances } from "./usePollTezBalances";
import { mockImplicitAddress } from "../../mocks/factories";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getAccounts } from "../tezos";

jest.mock("../tezos");

describe("usePollTezBalances", () => {
  it("fetches tez balances and updates the state", async () => {
    jest.mocked(getAccounts).mockResolvedValue([
      { address: mockImplicitAddress(0).pkh, balance: 123, delegationLevel: 1 },
      { address: mockImplicitAddress(1).pkh, balance: 345, delegationLevel: 2 },
      { address: mockImplicitAddress(2).pkh, balance: 876 },
    ]);

    renderHook(() => usePollTezBalances());

    await waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1));

    expect(store.getState().assets.balances.mutez).toEqual({
      [mockImplicitAddress(0).pkh]: "123",
      [mockImplicitAddress(1).pkh]: "345",
      [mockImplicitAddress(2).pkh]: "876",
    });

    expect(store.getState().assets.delegationLevels).toEqual({
      [mockImplicitAddress(0).pkh]: 1,
      [mockImplicitAddress(1).pkh]: 2,
    });
  });
});
