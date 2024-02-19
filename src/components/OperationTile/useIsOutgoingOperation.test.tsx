import { PropsWithChildren } from "react";

import { OperationTileContext, OperationTileContextType } from "./OperationTileContext";
import { useIsOutgoingOperation } from "./useIsOutgoingOperation";
import { mockImplicitAddress, mockLedgerAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { renderHook } from "../../mocks/testUtils";
import { ReduxStore } from "../../providers/ReduxStore";

const makeWrapper =
  (value: OperationTileContextType) =>
  ({ children }: PropsWithChildren<object>) => (
    <ReduxStore>
      <OperationTileContext.Provider value={value}>{children}</OperationTileContext.Provider>
    </ReduxStore>
  );

describe("useIsOutgoingOperation", () => {
  const account = mockLedgerAccount(0);

  describe("when used on the Operations page", () => {
    it("returns false if sender is a falsy value", () => {
      const {
        result: { current: result },
      } = renderHook(() => useIsOutgoingOperation(""), { wrapper: makeWrapper({ mode: "page" }) });

      expect(result).toBe(false);
    });

    it("returns true if the sender is an owned account", () => {
      addAccount(account);

      const {
        result: { current: result },
      } = renderHook(() => useIsOutgoingOperation(account.address.pkh), {
        wrapper: makeWrapper({ mode: "page" }),
      });
      expect(result).toBe(true);
    });

    it("returns false if the sender is not an owned account", () => {
      const {
        result: { current: result },
      } = renderHook(() => useIsOutgoingOperation(account.address.pkh), {
        wrapper: makeWrapper({ mode: "page" }),
      });
      expect(result).toBe(false);
    });
  });

  describe("when used inside an account drawer", () => {
    it("returns false if sender is a falsy value", () => {
      const {
        result: { current: result },
      } = renderHook(() => useIsOutgoingOperation(""), {
        wrapper: makeWrapper({ mode: "drawer", selectedAddress: mockImplicitAddress(0) }),
      });

      expect(result).toBe(false);
    });

    it("returns true if the sender is the selected account", () => {
      addAccount(account);

      const {
        result: { current: result },
      } = renderHook(() => useIsOutgoingOperation(account.address.pkh), {
        wrapper: makeWrapper({ mode: "drawer", selectedAddress: account.address }),
      });

      expect(result).toBe(true);
    });

    it("returns false if the sender is not the selected account", () => {
      addAccount(account);

      const {
        result: { current: result },
      } = renderHook(() => useIsOutgoingOperation(account.address.pkh), {
        wrapper: makeWrapper({ mode: "drawer", selectedAddress: mockImplicitAddress(1) }),
      });

      expect(result).toBe(false);
    });

    it("returns false if the sender is not the selected account but owned", () => {
      addAccount(account);

      const {
        result: { current: result },
      } = renderHook(() => useIsOutgoingOperation(account.address.pkh), {
        wrapper: makeWrapper({ mode: "drawer", selectedAddress: mockImplicitAddress(1) }),
      });

      expect(result).toBe(false);
    });
  });
});
