import { mockLedgerAccount } from "@umami/core";
import { addTestAccount } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { useGetOperationDestination } from "./useGetOperationDestination";
import { renderHook } from "../../mocks/testUtils";

describe("useGetOperationDestination", () => {
  const account = mockLedgerAccount(0);

  it.each([account.address.pkh, null, undefined])(
    "returns 'unrelated' if neither sender nor receiver is owned (for %s)",
    address => {
      const {
        result: { current: result },
      } = renderHook(() => useGetOperationDestination(address, address));

      expect(result).toBe("unrelated");
    }
  );

  it.each([mockImplicitAddress(2).pkh, null, undefined])(
    "returns 'outgoing' if the sender is owned (receiver is %s)",
    receiver => {
      addTestAccount(account);

      const {
        result: { current: result },
      } = renderHook(() => useGetOperationDestination(account.address.pkh, receiver));

      expect(result).toBe("outgoing");
    }
  );

  it.each([mockImplicitAddress(2).pkh, null, undefined])(
    "returns 'incoming' if the receiver is owned (sender is %s)",
    sender => {
      addTestAccount(account);

      const {
        result: { current: result },
      } = renderHook(() => useGetOperationDestination(sender, account.address.pkh));

      expect(result).toBe("incoming");
    }
  );

  it("returns 'outgoing' if both the sender and the receiver are owned", () => {
    addTestAccount(account);

    const {
      result: { current: result },
    } = renderHook(() => useGetOperationDestination(account.address.pkh, account.address.pkh));

    expect(result).toBe("outgoing");
  });
});
