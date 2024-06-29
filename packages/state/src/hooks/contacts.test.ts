import {
  mockContractContact,
  mockImplicitContact,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "@umami/core";
import { GHOSTNET, MAINNET, mockImplicitAddress } from "@umami/tezos";

import {
  useAddressExistsInContacts,
  useAllContacts,
  useContactsForSelectedNetwork,
  useGetContactName,
  useSortedContacts,
  useValidateNewContactPkh,
} from "./contacts";
import { contactsActions, multisigsActions, networksActions } from "../slices";
import { type UmamiStore, makeStore } from "../store";
import { addTestAccount, renderHook } from "../testUtils";

const ghostnetContact = mockContractContact(1, "ghostnet", "Ghostnet Contact");
const mainnetContact = mockContractContact(2, "mainnet", "Mainnet Contact");

const contact1 = mockImplicitContact(1);
const contact2 = mockImplicitContact(2);
const contact3 = mockImplicitContact(3);

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("contactsHooks", () => {
  beforeEach(() => {
    store.dispatch(contactsActions.upsert(contact3));
    store.dispatch(contactsActions.upsert(contact2));
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(contactsActions.upsert(ghostnetContact));
    store.dispatch(contactsActions.upsert(mainnetContact));
  });

  describe("useAllContacts", () => {
    it("returns the all stored contacts", () => {
      const {
        result: { current: contacts },
      } = renderHook(() => useAllContacts(), { store });

      expect(contacts).toEqual({
        [contact3.pkh]: contact3,
        [contact2.pkh]: contact2,
        [contact1.pkh]: contact1,
        [ghostnetContact.pkh]: ghostnetContact,
        [mainnetContact.pkh]: mainnetContact,
      });
    });
  });

  describe("useContactsForSelectedNetwork", () => {
    it("returns contacts for current network", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current: contacts },
      } = renderHook(() => useContactsForSelectedNetwork(), { store });

      // All implicit contacts + contract contacts for current network are expected.
      expect(contacts).toEqual([contact3, contact2, contact1, ghostnetContact]);
    });
  });

  describe("useAllSortedContacts", () => {
    it("returns stored contacts sorted by name for current network", () => {
      const alphabeticallyFirstContact = mockContractContact(3, "mainnet", "AAA");
      store.dispatch(contactsActions.upsert(alphabeticallyFirstContact));
      store.dispatch(networksActions.setCurrent(MAINNET));

      const {
        result: { current: contacts },
      } = renderHook(() => useSortedContacts(), { store });

      expect(contacts).toEqual([
        alphabeticallyFirstContact,
        contact1,
        contact2,
        contact3,
        mainnetContact,
      ]);
    });
  });

  describe("useAddressExistsInContacts", () => {
    it("returns true if the address exists in the contacts", () => {
      const {
        result: { current: addressExistsInContacts },
      } = renderHook(() => useAddressExistsInContacts(), { store });

      expect(addressExistsInContacts(contact2.pkh)).toEqual(true);
    });

    it("returns false if the address exists in the contacts", () => {
      const {
        result: { current: addressExistsInContacts },
      } = renderHook(() => useAddressExistsInContacts(), { store });

      expect(addressExistsInContacts("new_pkh")).toEqual(false);
    });

    it("returns result independently to current network", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current: addressExistsInContacts },
      } = renderHook(() => useAddressExistsInContacts(), { store });

      expect(addressExistsInContacts(mainnetContact.pkh)).toEqual(true);
    });
  });

  describe("useGetContactName", () => {
    it("returns undefined if the contact does not exist", () => {
      const {
        result: { current: getContactName },
      } = renderHook(() => useGetContactName(), { store });

      expect(getContactName("new_pkh")).toEqual(undefined);
    });

    it("returns the name of the contact", () => {
      const {
        result: { current: getContactName },
      } = renderHook(() => useGetContactName(), { store });

      expect(getContactName(contact2.pkh)).toEqual(contact2.name);
    });

    it("returns result independently to current network", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current: getContactName },
      } = renderHook(() => useGetContactName(), { store });

      expect(getContactName(mainnetContact.pkh)).toEqual(mainnetContact.name);
    });
  });

  describe("useValidateNewContactPkh", () => {
    it("returns true for a valid address", () => {
      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidateNewContactPkh(), { store });

      expect(validatePkh(mockImplicitAddress(5).pkh)).toEqual(true);
    });

    it("fails for invalid address", () => {
      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidateNewContactPkh(), { store });

      expect(validatePkh("invalid_pkh")).toEqual("Invalid address");
    });

    it("fails for address already registered in contacts", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidateNewContactPkh(), { store });

      expect(validatePkh(contact2.pkh)).toEqual("Address is already registered");
    });

    it.each([
      mockLedgerAccount(0),
      mockSocialAccount(1),
      mockSecretKeyAccount(2),
      mockMnemonicAccount(3),
      mockMultisigAccount(0),
    ])("fails for address used for $type account", account => {
      store.dispatch(contactsActions.reset());
      if (account.type !== "multisig") {
        addTestAccount(store, account);
      } else {
        store.dispatch(multisigsActions.setMultisigs([account]));
      }

      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidateNewContactPkh(), { store });

      expect(validatePkh(account.address.pkh)).toEqual("Address is already used in accounts");
    });
  });
});
