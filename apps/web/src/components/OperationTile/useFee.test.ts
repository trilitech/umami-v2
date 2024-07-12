import { mockImplicitAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { type TransactionOperation } from "@umami/tzkt";

import { useFee } from "./useFee";
import { renderHook } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

const operation = {
  sender: { address: mockImplicitAccount(0).address.pkh },
  bakerFee: 100,
  storageFee: 20,
  allocationFee: 3,
} as TransactionOperation;

describe("useFee", () => {
  it("returns null if fee is 0", () => {
    const {
      result: { current: fee },
    } = renderHook(() => useFee({ ...operation, bakerFee: 0, storageFee: 0, allocationFee: 0 }), {
      store,
    });

    expect(fee).toBeNull();
  });

  it("returns null if operation is absent", () => {
    const {
      result: { current: fee },
    } = renderHook(() => useFee(undefined), { store });

    expect(fee).toBeNull();
  });

  it("returns null if the operation is not outgoing", () => {
    const {
      result: { current: fee },
    } = renderHook(() => useFee(operation), { store });

    expect(fee).toBeNull();
  });

  it("returns the total fee", () => {
    addTestAccount(store, mockImplicitAccount(0));

    const {
      result: { current: fee },
    } = renderHook(() => useFee(operation), { store });

    expect(fee).toBe("123");
  });
});
