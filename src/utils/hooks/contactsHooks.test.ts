import {
  useAddressExistsInContacts,
  useAllSortedContacts,
  useContacts,
  useGetContactName,
  useValidatePkh,
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
import { renderHook } from "../../mocks/testUtils";
import { accountsSlice } from "../redux/slices/accountsSlice";
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

  describe("useValidatePkh", () => {
    it("returns true for a valid address", () => {
      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidatePkh());

      expect(validatePkh(mockImplicitAddress(5).pkh)).toEqual(true);
    });

    it("fails for invalid address", () => {
      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidatePkh());

      expect(validatePkh("invalid_pkh")).toEqual("Invalid address");
    });

    it("fails for address already registered in contacts", () => {
      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidatePkh());

      expect(validatePkh(contact2.pkh)).toEqual("Address already registered");
    });

    it("fails for address already saved as account", () => {
      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidatePkh());

      expect(validatePkh(contact2.pkh)).toEqual("Address already registered");
    });

    it.each([
      { type: "ledger", pkh: mockLedgerAccount(0).address.pkh },
      { type: "social", pkh: mockSocialAccount(1).address.pkh },
      { type: "secret_key", pkh: mockSecretKeyAccount(2).address.pkh },
      { type: "mnemonic", pkh: mockMnemonicAccount(3).address.pkh },
      { type: "multisig", pkh: mockMultisigAccount(0).address.pkh },
    ])("fails for address used for $type account", ({ pkh }) => {
      store.dispatch(contactsActions.reset());
      store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
      store.dispatch(accountsSlice.actions.addAccount(mockSocialAccount(1)));
      store.dispatch(accountsSlice.actions.addAccount(mockSecretKeyAccount(2)));
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(3)]));
      store.dispatch(multisigsSlice.actions.setMultisigs([mockMultisigAccount(0)]));

      const {
        result: { current: validatePkh },
      } = renderHook(() => useValidatePkh());

      expect(validatePkh(pkh)).toEqual("Address already used in accounts");
    });
  });
});
