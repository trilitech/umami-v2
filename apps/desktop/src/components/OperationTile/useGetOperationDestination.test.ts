import { useGetOperationDestination } from "./useGetOperationDestination";
import { mockImplicitAddress, mockLedgerAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
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
      addAccount(account);

      const {
        result: { current: result },
      } = renderHook(() => useGetOperationDestination(account.address.pkh, receiver));

      expect(result).toBe("outgoing");
    }
  );

  it.each([mockImplicitAddress(2).pkh, null, undefined])(
    "returns 'incoming' if the receiver is owned (sender is %s)",
    sender => {
      addAccount(account);

      const {
        result: { current: result },
      } = renderHook(() => useGetOperationDestination(sender, account.address.pkh));

      expect(result).toBe("incoming");
    }
  );

  it("returns 'outgoing' if both the sender and the receiver are owned", () => {
    addAccount(account);

    const {
      result: { current: result },
    } = renderHook(() => useGetOperationDestination(account.address.pkh, account.address.pkh));

    expect(result).toBe("outgoing");
  });
});
