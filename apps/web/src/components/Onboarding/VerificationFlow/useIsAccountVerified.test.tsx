import { mockLedgerAccount, mockMnemonicAccount, mockSocialAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";

import { useIsAccountVerified } from "./useIsAccountVerified";
import { renderHook } from "../../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("useIsAccountVerified", () => {
  it.each([
    // verified status, account type, account
    [true, "social", mockSocialAccount(0)],
    [true, "ledger", mockLedgerAccount(0)],
    [true, "verified mnemonic", mockMnemonicAccount(0)],
    [false, "unverified mnemonic", mockMnemonicAccount(0, { isVerified: false })],
  ])("returns %s for %s account", (isVerified, _, account) => {
    addTestAccount(store, account);
    const { result } = renderHook(() => useIsAccountVerified(), { store });

    expect(result.current).toBe(isVerified);
  });
});
