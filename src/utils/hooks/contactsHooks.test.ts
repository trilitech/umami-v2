import {
  useAddressExistsInContacts,
  useAllContacts,
  useContactsForSelectedNetwork,
  useGetContactName,
  useSortedContacts,
  useValidateNewContactPkh,
} from "./contactsHooks";
import {
  contact1,
  contact2,
  contact3,
  ghostnetContact,
  mainnetContact,
} from "../../mocks/contacts";
import {
  mockContractContact,
  mockImplicitAddress,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { renderHook } from "../../mocks/testUtils";
import { GHOSTNET, MAINNET } from "../../types/Network";
import { contactsActions } from "../redux/slices/contactsSlice";
import { multisigsSlice } from "../redux/slices/multisigsSlice";
import { networksActions } from "../redux/slices/networks";
import { store } from "../redux/store";

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
      } = renderHook(() => useAllContacts());

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
      } = renderHook(() => useContactsForSelectedNetwork());

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
      } = renderHook(() => useSortedContacts());

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
      } = renderHook(() => useAddressExistsInContacts());

      expect(addressExistsInContacts(contact2.pkh)).toEqual(true);
    });

    it("returns false if the address exists in the contacts", () => {
      const {
        result: { current: addressExistsInContacts },
      } = renderHook(() => useAddressExistsInContacts());

      expect(addressExistsInContacts("new_pkh")).toEqual(false);
    });

    it("returns result independently to current network", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current: addressExistsInContacts },
      } = renderHook(() => useAddressExistsInContacts());

      expect(addressExistsInContacts(mainnetContact.pkh)).toEqual(true);
    });
  });

  describe("useGetContactName", () => {
    it("returns undefined if the contact does not exist", () => {
      const {
        result: { current: getContactName },
      } = renderHook(() => useGetContactName());

      expect(getContactName("new_pkh")).toEqual(undefined);
    });

    it("returns the name of the contact", () => {
      const {
        result: { current: getContactName },
      } = renderHook(() => useGetContactName());

      expect(getContactName(contact2.pkh)).toEqual(contact2.name);
    });

    it("returns result independently to current network", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current: getContactName },
      } = renderHook(() => useGetContactName());

      expect(getContactName(mainnetContact.pkh)).toEqual(mainnetContact.name);
    });
  });

  describe("useValidateNewContactPkh", () => {
    it("returns true for a valid address", () => {
      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidateNewContactPkh());

      expect(validatePkh(mockImplicitAddress(5).pkh)).toEqual(true);
    });

    it("fails for invalid address", () => {
      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidateNewContactPkh());

      expect(validatePkh("invalid_pkh")).toEqual("Invalid address");
    });

    it("fails for address already registered in contacts", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));

      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidateNewContactPkh());

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
        addAccount(account);
      } else {
        store.dispatch(multisigsSlice.actions.setMultisigs([account]));
      }

      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidateNewContactPkh());

      expect(validatePkh(account.address.pkh)).toEqual("Address is already used in accounts");
    });
  });
});
