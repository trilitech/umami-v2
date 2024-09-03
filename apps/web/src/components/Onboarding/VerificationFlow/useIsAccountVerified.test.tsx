import { mockMnemonicAccount, mockSocialAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";

import { useIsAccountVerified } from "./useIsAccountVerified";
import { renderHook } from "../../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("useIsAccountVerified", () => {
  it("returns true if the account is not mnemonic", () => {
    addTestAccount(store, mockSocialAccount(0));
    const { result } = renderHook(() => useIsAccountVerified(), { store });

    expect(result.current).toBe(true);
  });

  it("returns true if the account is mnemonic and verified", () => {
    addTestAccount(store, mockMnemonicAccount(0));
    const { result } = renderHook(() => useIsAccountVerified(), { store });

    expect(result.current).toBe(true);
  });

  it("returns false if the account is mnemonic and not verified", () => {
    addTestAccount(store, mockMnemonicAccount(0, { isVerified: false }));
    const { result } = renderHook(() => useIsAccountVerified(), { store });

    expect(result.current).toBe(false);
  });
});
