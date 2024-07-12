import { type UmamiStore, assetsActions, makeStore } from "@umami/state";

import { useOperationStatus } from "./useOperationStatus";
import { renderHook } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("useOperationStatus", () => {
  it("returns 'applied' if the operation is applied and the block is finalised", () => {
    store.dispatch(assetsActions.updateBlock({ level: 2, cycle: 2 }));
    const {
      result: { current: status },
    } = renderHook(() => useOperationStatus(0, "applied"), { store });

    expect(status).toBe("applied");
  });

  it('returns "applied" if the operation\'s status is unknown and the block is finalised', () => {
    store.dispatch(assetsActions.updateBlock({ level: 2, cycle: 2 }));
    const {
      result: { current: status },
    } = renderHook(() => useOperationStatus(0, undefined), { store });

    expect(status).toBe("applied");
  });

  it("returns 'pending' if the operation is applied but the block has not been finalised yet", () => {
    store.dispatch(assetsActions.updateBlock({ level: 0, cycle: 2 }));
    const {
      result: { current: status },
    } = renderHook(() => useOperationStatus(0, "applied"), { store });

    expect(status).toBe("pending");
  });

  it.each(["failed", "backtracked", "skipped"] as const)(
    "renders a crossed circle if the operation has status: %s",
    opStatus => {
      store.dispatch(assetsActions.updateBlock({ level: 0, cycle: 2 }));
      const {
        result: { current: status },
      } = renderHook(() => useOperationStatus(2, opStatus), { store });

      expect(status).toBe("failed");
    }
  );
});
