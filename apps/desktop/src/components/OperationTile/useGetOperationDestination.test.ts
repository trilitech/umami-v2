import { mockLedgerAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { useGetOperationDestination } from "./useGetOperationDestination";
import { renderHook } from "../../mocks/testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("useGetOperationDestination", () => {
  const account = mockLedgerAccount(0);

  it.each([account.address.pkh, null, undefined])(
    "returns 'unrelated' if neither sender nor receiver is owned (for %s)",
    address => {
      const {
        result: { current: result },
      } = renderHook(() => useGetOperationDestination(address, address), { store });

      expect(result).toBe("unrelated");
    }
  );

  it.each([mockImplicitAddress(2).pkh, null, undefined])(
    "returns 'outgoing' if the sender is owned (receiver is %s)",
    receiver => {
      addTestAccount(store, account);

      const {
        result: { current: result },
      } = renderHook(() => useGetOperationDestination(account.address.pkh, receiver), { store });

      expect(result).toBe("outgoing");
    }
  );

  it.each([mockImplicitAddress(2).pkh, null, undefined])(
    "returns 'incoming' if the receiver is owned (sender is %s)",
    sender => {
      addTestAccount(store, account);

      const {
        result: { current: result },
      } = renderHook(() => useGetOperationDestination(sender, account.address.pkh), { store });

      expect(result).toBe("incoming");
    }
  );

  it("returns 'outgoing' if both the sender and the receiver are owned", () => {
    addTestAccount(store, account);

    const {
      result: { current: result },
    } = renderHook(() => useGetOperationDestination(account.address.pkh, account.address.pkh), {
      store,
    });

    expect(result).toBe("outgoing");
  });
});
