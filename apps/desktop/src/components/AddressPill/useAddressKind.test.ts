import { mockBaker, mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import { multisigsFixture } from "@umami/multisig";
import {
  addTestAccount,
  assetsSlice,
  contactsSlice,
  multisigsSlice,
  networksActions,
  store,
  tokensSlice,
} from "@umami/state";
import { hedgehoge, uUSD } from "@umami/test-utils";
import {
  MAINNET,
  mockContractAddress,
  mockImplicitAddress,
  parseContractPkh,
  parseImplicitPkh,
  parsePkh,
} from "@umami/tezos";
import { cloneDeep } from "lodash";

import { useAddressKind } from "./useAddressKind";
import { renderHook } from "../../mocks/testUtils";

beforeEach(() => {
  store.dispatch(networksActions.setCurrent(MAINNET));
});

describe("useAddressKind", () => {
  it("returns owned implicit account", () => {
    const mnemonicAccount = mockMnemonicAccount(0);
    addTestAccount(mockMnemonicAccount(0));

    const { result: addressKindRef } = renderHook(() => useAddressKind(mnemonicAccount.address));

    expect(addressKindRef.current).toEqual({
      type: "implicit",
      pkh: mnemonicAccount.address.pkh,
      label: "Account",
    });
  });

  it("returns owned multisig account", () => {
    store.dispatch(multisigsSlice.actions.setMultisigs(multisigsFixture));

    const { result: addressKindRef } = renderHook(() =>
      useAddressKind(multisigsFixture[0].address)
    );

    expect(addressKindRef.current).toEqual({
      type: "multisig",
      pkh: multisigsFixture[0].address.pkh,
      label: "Multisig Account 0",
    });
  });

  describe.each([
    { type: "fa1.2", tokenBalance: hedgehoge(mockImplicitAddress(0)) },
    { type: "fa2", tokenBalance: uUSD(mockImplicitAddress(0)) },
  ])("for $type token", ({ type, tokenBalance }) => {
    const tokenContractAddress = parseContractPkh(tokenBalance.token.contract.address);

    it("returns empty label if name is not present", () => {
      const withoutName = cloneDeep(tokenBalance);
      delete (withoutName.token.metadata as any).name;
      store.dispatch(
        tokensSlice.actions.addTokens({
          network: MAINNET,
          tokens: [withoutName.token],
        })
      );

      const { result: addressKindRef } = renderHook(() => useAddressKind(tokenContractAddress));

      expect(addressKindRef.current).toEqual({
        type: type,
        pkh: tokenContractAddress.pkh,
        label: null,
      });
    });

    it("returns label if name is present", () => {
      store.dispatch(
        tokensSlice.actions.addTokens({
          network: MAINNET,
          tokens: [tokenBalance.token],
        })
      );

      const { result: addressKindRef } = renderHook(() => useAddressKind(tokenContractAddress));

      expect(addressKindRef.current).toEqual({
        type: type,
        pkh: tokenContractAddress.pkh,
        label: null,
      });
    });
  });

  test("returns baker account", () => {
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

  describe("for contacts", () => {
    it("returns implicit contact if it exists", () => {
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

    it.each([
      { type: "implicit", address: mockImplicitAccount(0).address.pkh },
      { type: "multisig", address: multisigsFixture[0].address.pkh },
      {
        type: "fa1.2",
        address: hedgehoge(mockImplicitAddress(0)).token.contract.address,
      },
      { type: "fa2", address: uUSD(mockImplicitAddress(0)).token.contract.address },
      { type: "baker", address: mockBaker(1).address },
    ])("prioritizes $type over the contact", ({ type, address }) => {
      addTestAccount(mockMnemonicAccount(0));
      store.dispatch(multisigsSlice.actions.setMultisigs(multisigsFixture));
      store.dispatch(
        tokensSlice.actions.addTokens({
          network: MAINNET,
          tokens: [hedgehoge(mockImplicitAddress(0)).token, uUSD(mockImplicitAddress(0)).token],
        })
      );
      store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1)]));
      store.dispatch(
        contactsSlice.actions.upsert({
          name: "name1",
          pkh: address,
          network: undefined,
        })
      );

      const { result: addressKindRef } = renderHook(() => useAddressKind(parsePkh(address)));

      expect(addressKindRef.current.type).toEqual(type);
    });
  });

  it("returns unknown if nothing matched", () => {
    const unknown = mockImplicitAddress(3);

    const { result: addressKindRef } = renderHook(() => useAddressKind(unknown));

    expect(addressKindRef.current).toEqual({
      type: "unknown",
      pkh: unknown.pkh,
      label: null,
    });
  });
});
