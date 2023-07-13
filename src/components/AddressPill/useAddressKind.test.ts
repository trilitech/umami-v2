import { renderHook } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { mockBaker, mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { multisigs } from "../../mocks/multisig";
import { getWrapper } from "../../mocks/store";
import { AccountType, ImplicitAccount } from "../../types/Account";
import { parseImplicitPkh } from "../../types/Address";
import { Baker } from "../../types/Baker";
import { Contact } from "../../types/Contact";
import { TokenBalance } from "../../types/TokenBalance";
import { Multisig } from "../../utils/multisig/types";
import useAddressKind from "./useAddressKind";

type MockStoreState = {
  accounts: {
    items: ImplicitAccount[];
  };
  assets: {
    balances: { tokens: Record<string, TokenBalance[] | undefined> };
    bakers: Baker[];
  };
  contacts: Record<string, Contact>;
  multisigs: {
    items: Multisig[];
  };
};

describe("useAddressKind", () => {
  const implicit0 = mockImplicitAddress(0);
  const implicit1 = mockImplicitAddress(1);
  const implicit2 = mockImplicitAddress(4);
  const unknown = mockImplicitAddress(3);
  const contract0 = mockContractAddress(0);
  const contract1 = mockContractAddress(1);
  const baker = mockBaker(2);

  const initialState: MockStoreState = {
    accounts: {
      items: [
        {
          label: "label0",
          curve: "ed25519",
          derivationPath: "derivationPath",
          type: AccountType.MNEMONIC,
          seedFingerPrint: "seedFingerPrint",
          address: implicit0,
          pk: "pk",
        },
        {
          label: "label1",
          curve: "ed25519",
          derivationPath: "derivationPath",
          type: AccountType.MNEMONIC,
          seedFingerPrint: "seedFingerPrint",
          address: implicit1,
          pk: "pk",
        },
      ],
    },
    assets: {
      balances: {
        tokens: {
          pkh0: [
            { type: "fa1.2", contract: contract0.pkh, balance: "0" },
            {
              type: "fa2",
              contract: contract1.pkh,
              balance: "0",
              tokenId: "0",
              metadata: { name: "fa2Token" },
            },
          ],
        },
      },
      bakers: [baker],
    },
    contacts: {
      [implicit1.pkh]: { name: "name1", pkh: implicit1.pkh },
      [implicit2.pkh]: { name: "name2", pkh: implicit2.pkh },
    },
    multisigs: {
      items: multisigs,
    },
  };

  const mockStore = configureStore();
  const store = mockStore(initialState);

  it("returns owned implicit account addressKind", () => {
    const { result: addressKindRef } = renderHook(() => useAddressKind(implicit0), {
      wrapper: getWrapper(store),
    });
    expect(addressKindRef.current).toEqual({
      type: "ownedImplicit",
      pkh: implicit0.pkh,
      label: "label0",
    });
  });

  it("returns owned multisig account addressKind", () => {
    const { result: addressKindRef } = renderHook(() => useAddressKind(multisigs[0].address), {
      wrapper: getWrapper(store),
    });
    expect(addressKindRef.current).toEqual({
      type: "ownedMultisig",
      pkh: multisigs[0].address.pkh,
      label: "Multisig Account 0",
    });
  });

  it("returns fa1.2 addressKind", () => {
    const { result: addressKindRef } = renderHook(() => useAddressKind(contract0), {
      wrapper: getWrapper(store),
    });
    expect(addressKindRef.current).toEqual({
      type: "fa1.2",
      pkh: contract0.pkh,
      label: null,
    });
  });

  it("returns fa2 addressKind", () => {
    const { result: addressKindRef } = renderHook(() => useAddressKind(contract1), {
      wrapper: getWrapper(store),
    });
    expect(addressKindRef.current).toEqual({
      type: "fa2",
      pkh: contract1.pkh,
      label: "fa2Token",
    });
  });

  it("returns baker addressKind", () => {
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

  it("returns contact addressKind", () => {
    const { result: addressKindRef } = renderHook(() => useAddressKind(implicit2), {
      wrapper: getWrapper(store),
    });
    expect(addressKindRef.current).toEqual({
      type: "contact",
      pkh: implicit2.pkh,
      label: "name2",
    });
  });

  it("returns unknown addressKind", () => {
    const { result: addressKindRef } = renderHook(() => useAddressKind(unknown), {
      wrapper: getWrapper(store),
    });
    expect(addressKindRef.current).toEqual({
      type: "unknown",
      pkh: unknown.pkh,
      label: null,
    });
  });

  it("contact AddressKind has less priority", () => {
    const { result: addressKindRef } = renderHook(() => useAddressKind(implicit1), {
      wrapper: getWrapper(store),
    });
    expect(addressKindRef.current).toEqual({
      type: "ownedImplicit",
      pkh: implicit1.pkh,
      label: "label1",
    });
  });
});
