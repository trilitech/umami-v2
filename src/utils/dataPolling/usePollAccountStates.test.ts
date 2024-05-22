import { usePollAccountStates } from "./usePollAccountStates";
import { mockImplicitAddress } from "../../mocks/factories";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getAccounts } from "../tezos";

jest.mock("../tezos");

describe("usePollAccountStates", () => {
  it("fetches tez balances and updates the state", async () => {
    jest.mocked(getAccounts).mockResolvedValue([
      {
        address: mockImplicitAddress(0).pkh,
        balance: 123,
        stakedBalance: 123,
        unstakedBalance: 321,
        delegate: null,
      },
      {
        address: mockImplicitAddress(1).pkh,
        balance: 3455,
        stakedBalance: 1234,
        unstakedBalance: 3214,
        delegate: { address: mockImplicitAddress(0).pkh },
      },
      {
        address: mockImplicitAddress(2).pkh,
        balance: 876,
        stakedBalance: 1234,
        unstakedBalance: 3214,
        delegate: { address: mockImplicitAddress(0).pkh, alias: "Some baker" },
      },
    ]);

    renderHook(() => usePollAccountStates());

    await waitFor(() => expect(getAccounts).toHaveBeenCalledTimes(1));

    expect(store.getState().assets.accountStates).toEqual({
      [mockImplicitAddress(0).pkh]: {
        balance: 123,
        stakedBalance: 123,
        unstakedBalance: 321,
        delegate: null,
      },
      [mockImplicitAddress(1).pkh]: {
        balance: 3455,
        stakedBalance: 1234,
        unstakedBalance: 3214,
        delegate: { address: mockImplicitAddress(0).pkh },
      },
      [mockImplicitAddress(2).pkh]: {
        balance: 876,
        stakedBalance: 1234,
        unstakedBalance: 3214,
        delegate: { address: mockImplicitAddress(0).pkh, alias: "Some baker" },
      },
    });
  });
});
