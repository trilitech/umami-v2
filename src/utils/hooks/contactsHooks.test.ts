import {
  useAddressExistsInContacts,
  useAllSortedContacts,
  useContacts,
  useGetContactName,
  useValidateNewContactPkh,
} from "./contactsHooks";
import { contact1, contact2, contact3 } from "../../mocks/contacts";
import {
  mockImplicitAddress,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockSecretKeyAccount,
  mockSocialAccount,
} from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { renderHook } from "../../mocks/testUtils";
import { contactsActions } from "../redux/slices/contactsSlice";
import { multisigsSlice } from "../redux/slices/multisigsSlice";
import { store } from "../redux/store";

describe("contactsHooks", () => {
  beforeEach(() => {
    store.dispatch(contactsActions.upsert(contact3));
    store.dispatch(contactsActions.upsert(contact2));
    store.dispatch(contactsActions.upsert(contact1));
  });

  describe("useContacts", () => {
    it("returns the all stored contacts", () => {
      const {
        result: { current: contacts },
      } = renderHook(() => useContacts());

      expect(contacts).toEqual({
        [contact3.pkh]: contact3,
        [contact2.pkh]: contact2,
        [contact1.pkh]: contact1,
      });
    });
  });

  describe("useAllSortedContacts", () => {
    it("returns the all stored contacts sorted by name", () => {
      const {
        result: { current: contacts },
      } = renderHook(() => useAllSortedContacts());

      expect(contacts).toEqual([contact1, contact2, contact3]);
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
