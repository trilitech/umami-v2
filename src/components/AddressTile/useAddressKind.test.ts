import { useAddressKind } from "./useAddressKind";
import {
  mockBaker,
  mockImplicitAddress,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { multisigs } from "../../mocks/multisig";
import { getWrapper } from "../../mocks/store";
import { renderHook } from "../../mocks/testUtils";
import { ReduxStore } from "../../providers/ReduxStore";
import { parseImplicitPkh, parsePkh } from "../../types/Address";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { assetsSlice } from "../../utils/redux/slices/assetsSlice";
import { contactsSlice } from "../../utils/redux/slices/contactsSlice";
import { multisigsSlice } from "../../utils/redux/slices/multisigsSlice";
import { store } from "../../utils/redux/store";

describe("useAddressKind", () => {
  it("returns mnemonic account", () => {
    const account = mockMnemonicAccount(0);
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));

    const { result: addressKindRef } = renderHook(() => useAddressKind(account.address), {
      wrapper: ReduxStore,
    });

    expect(addressKindRef.current).toEqual({
      type: "mnemonic",
      pkh: account.address.pkh,
      label: "Account",
    });
  });

  it("returns social account", () => {
    const account = mockSocialAccount(0);
    store.dispatch(accountsSlice.actions.addAccount(account));

    const { result: addressKindRef } = renderHook(() => useAddressKind(account.address), {
      wrapper: ReduxStore,
    });

    expect(addressKindRef.current).toEqual({
      type: "social",
      pkh: account.address.pkh,
      label: "Account",
    });
  });

  it("returns ledger account", () => {
    const account = mockLedgerAccount(0);
    store.dispatch(accountsSlice.actions.addAccount(account));

    const { result: addressKindRef } = renderHook(() => useAddressKind(account.address), {
      wrapper: ReduxStore,
    });

    expect(addressKindRef.current).toEqual({
      type: "ledger",
      pkh: account.address.pkh,
      label: "Account",
    });
  });

  it("returns owned multisig account", () => {
    store.dispatch(multisigsSlice.actions.setMultisigs(multisigs));

    const { result: addressKindRef } = renderHook(() => useAddressKind(multisigs[0].address), {
      wrapper: ReduxStore,
    });

    expect(addressKindRef.current).toEqual({
      type: "multisig",
      pkh: multisigs[0].address.pkh,
      label: "Multisig Account 0",
    });
  });

  it("returns contact", () => {
    const contact1 = { name: "name1", pkh: mockImplicitAddress(3).pkh };
    store.dispatch(contactsSlice.actions.upsert(contact1));

    const { result: addressKindRef } = renderHook(() => useAddressKind(parsePkh(contact1.pkh)), {
      wrapper: getWrapper(store),
    });

    expect(addressKindRef.current).toEqual({
      type: "contact",
      pkh: contact1.pkh,
      label: contact1.name,
    });
  });

  it("returns baker", () => {
    const baker = mockBaker(2);
    store.dispatch(assetsSlice.actions.updateBakers([baker]));

    const { result: addressKindRef } = renderHook(
      () => useAddressKind(parseImplicitPkh(baker.address)),
      {
        wrapper: getWrapper(store),
      }
    );

    expect(addressKindRef.current).toEqual({
      type: "baker",
      pkh: baker.address,
      label: "label2",
    });
  });

  it("returns unknown", () => {
    const unknown = mockImplicitAddress(3);

    const { result: addressKindRef } = renderHook(() => useAddressKind(unknown), {
      wrapper: getWrapper(store),
    });

    expect(addressKindRef.current).toEqual({
      type: "unknown",
      pkh: unknown.pkh,
      label: null,
    });
  });
});
