import { useAddressKind } from "./useAddressKind";
import {
  mockBaker,
  mockContractAddress,
  mockImplicitAddress,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { multisigs } from "../../mocks/multisig";
import { renderHook } from "../../mocks/testUtils";
import { parseImplicitPkh, parsePkh } from "../../types/Address";
import { MAINNET } from "../../types/Network";
import { assetsSlice } from "../../utils/redux/slices/assetsSlice";
import { contactsSlice } from "../../utils/redux/slices/contactsSlice";
import { multisigsSlice } from "../../utils/redux/slices/multisigsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";

describe("useAddressKind", () => {
  it("returns mnemonic account", () => {
    const account = mockMnemonicAccount(0);
    addAccount(account);

    const { result: addressKindRef } = renderHook(() => useAddressKind(account.address));

    expect(addressKindRef.current).toEqual({
      type: "mnemonic",
      pkh: account.address.pkh,
      label: "Account",
    });
  });

  it("returns social account", () => {
    const account = mockSocialAccount(0);
    addAccount(account);

    const { result: addressKindRef } = renderHook(() => useAddressKind(account.address));

    expect(addressKindRef.current).toEqual({
      type: "social",
      pkh: account.address.pkh,
      label: "Account",
    });
  });

  it("returns ledger account", () => {
    const account = mockLedgerAccount(0);
    addAccount(account);

    const { result: addressKindRef } = renderHook(() => useAddressKind(account.address));

    expect(addressKindRef.current).toEqual({
      type: "ledger",
      pkh: account.address.pkh,
      label: "Account",
    });
  });

  it("returns owned multisig account", () => {
    store.dispatch(multisigsSlice.actions.setMultisigs(multisigs));

    const { result: addressKindRef } = renderHook(() => useAddressKind(multisigs[0].address));

    expect(addressKindRef.current).toEqual({
      type: "multisig",
      pkh: multisigs[0].address.pkh,
      label: "Multisig Account 0",
    });
  });

  it("returns implicit contact", () => {
    const contact1 = { name: "name1", pkh: mockImplicitAddress(3).pkh, network: undefined };
    store.dispatch(contactsSlice.actions.upsert(contact1));

    const { result: addressKindRef } = renderHook(() => useAddressKind(parsePkh(contact1.pkh)));

    expect(addressKindRef.current).toEqual({
      type: "contact",
      pkh: contact1.pkh,
      label: contact1.name,
    });
  });

  it("returns contract contact if found in any network", () => {
    store.dispatch(networksActions.setCurrent(MAINNET));
    const contact1 = { name: "name1", pkh: mockContractAddress(0).pkh, network: "ghostnet" };
    store.dispatch(contactsSlice.actions.upsert(contact1));

    const { result: addressKindRef } = renderHook(() => useAddressKind(parsePkh(contact1.pkh)));

    expect(addressKindRef.current).toEqual({
      type: "contact",
      pkh: contact1.pkh,
      label: contact1.name,
    });
  });

  it("returns baker", () => {
    const baker = mockBaker(2);
    store.dispatch(assetsSlice.actions.updateBakers([baker]));

    const { result: addressKindRef } = renderHook(() =>
      useAddressKind(parseImplicitPkh(baker.address))
    );

    expect(addressKindRef.current).toEqual({
      type: "baker",
      pkh: baker.address,
      label: "label2",
    });
  });

  it("returns unknown", () => {
    const unknown = mockImplicitAddress(3);

    const { result: addressKindRef } = renderHook(() => useAddressKind(unknown));

    expect(addressKindRef.current).toEqual({
      type: "unknown",
      pkh: unknown.pkh,
      label: null,
    });
  });
});
