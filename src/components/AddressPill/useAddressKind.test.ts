import { TezosNetwork } from "@airgap/tezos";
import { renderHook } from "@testing-library/react";
import { cloneDeep } from "lodash";
import { hedgehoge } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { mockBaker, mockImplicitAccount, mockImplicitAddress } from "../../mocks/factories";
import { multisigs } from "../../mocks/multisig";
import { getWrapper } from "../../mocks/store";
import { ReduxStore } from "../../providers/ReduxStore";
import { parseContractPkh, parseImplicitPkh, parsePkh } from "../../types/Address";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import contactsSlice from "../../utils/store/contactsSlice";
import multisigsSlice from "../../utils/store/multisigsSlice";
import { store } from "../../utils/store/store";
import tokensSlice from "../../utils/store/tokensSlice";
import useAddressKind from "./useAddressKind";

beforeEach(() => {
  store.dispatch(assetsSlice.actions.updateNetwork(TezosNetwork.MAINNET));
});

describe("useAddressKind", () => {
  test("owned implicit account", () => {
    const implicitAccount0 = mockImplicitAccount(0);
    store.dispatch(accountsSlice.actions.add([mockImplicitAccount(0)]));
    const { result: addressKindRef } = renderHook(() => useAddressKind(implicitAccount0.address), {
      wrapper: ReduxStore,
    });
    expect(addressKindRef.current).toEqual({
      type: "ownedImplicit",
      pkh: implicitAccount0.address.pkh,
      label: "Account 0",
    });
  });

  test("owned multisig account", () => {
    store.dispatch(multisigsSlice.actions.setMultisigs(multisigs));
    const { result: addressKindRef } = renderHook(() => useAddressKind(multisigs[0].address), {
      wrapper: ReduxStore,
    });
    expect(addressKindRef.current).toEqual({
      type: "ownedMultisig",
      pkh: multisigs[0].address.pkh,
      label: "Multisig Account 0",
    });
  });

  [
    { type: "fa1.2", tokenBalance: hedgehoge(mockImplicitAddress(0)) },
    { type: "fa2", tokenBalance: uUSD(mockImplicitAddress(0)) },
  ].forEach(({ type, tokenBalance }) => {
    describe(`${type} token`, () => {
      const tokenContractAddress = parseContractPkh(tokenBalance.token.contract?.address as string);

      it("returns empty label if name is not present", () => {
        const withoutName = cloneDeep(tokenBalance);
        delete withoutName.token.metadata?.name;
        store.dispatch(
          tokensSlice.actions.addTokens({
            network: TezosNetwork.MAINNET,
            tokens: [withoutName.token],
          })
        );

        const { result: addressKindRef } = renderHook(() => useAddressKind(tokenContractAddress), {
          wrapper: getWrapper(store),
        });
        expect(addressKindRef.current).toEqual({
          type: type,
          pkh: tokenContractAddress.pkh,
          label: null,
        });
      });

      it("returns label", () => {
        store.dispatch(
          tokensSlice.actions.addTokens({
            network: TezosNetwork.MAINNET,
            tokens: [tokenBalance.token],
          })
        );

        const { result: addressKindRef } = renderHook(() => useAddressKind(tokenContractAddress), {
          wrapper: getWrapper(store),
        });

        expect(addressKindRef.current).toEqual({
          type: type,
          pkh: tokenContractAddress.pkh,
          label: null,
        });
      });
    });
  });

  test("baker", () => {
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

  describe("contacts", () => {
    it("returns contact if it exists", () => {
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

    [
      { type: "ownedImplicit", address: mockImplicitAccount(0).address.pkh },
      { type: "ownedMultisig", address: multisigs[0].address.pkh },
      {
        type: "fa1.2",
        address: hedgehoge(mockImplicitAddress(0)).token.contract?.address as string,
      },
      { type: "fa2", address: uUSD(mockImplicitAddress(0)).token.contract?.address as string },
      { type: "baker", address: mockBaker(1).address },
    ].forEach(({ type, address }) => {
      it(`prioritises ${type} over the contact`, () => {
        store.dispatch(multisigsSlice.actions.setMultisigs(multisigs));
        store.dispatch(accountsSlice.actions.add([mockImplicitAccount(0)]));
        store.dispatch(
          tokensSlice.actions.addTokens({
            network: TezosNetwork.MAINNET,
            tokens: [hedgehoge(mockImplicitAddress(0)).token, uUSD(mockImplicitAddress(0)).token],
          })
        );
        store.dispatch(assetsSlice.actions.updateBakers([mockBaker(1)]));

        store.dispatch(contactsSlice.actions.upsert({ name: "name1", pkh: address }));

        const { result: addressKindRef } = renderHook(() => useAddressKind(parsePkh(address)), {
          wrapper: getWrapper(store),
        });
        expect(addressKindRef.current.type).toEqual(type);
      });
    });
  });

  it("returns unknown if nothing matched", () => {
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
