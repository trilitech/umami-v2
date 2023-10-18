import { contact1, contact2 } from "../../../mocks/contacts";
import { mockImplicitAddress, mockMnemonicAccount } from "../../../mocks/factories";

import store from "../store";
import checkAccountsAndUpsertContact from "../thunks/checkAccountsAndUpsertContact";
import accountsSlice from "./accountsSlice";
import { contactsActions } from "./contactsSlice";
const { remove } = contactsActions;

describe("Contacts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().contacts).toEqual({});
  });

  test("should add new contacts", () => {
    store.dispatch(checkAccountsAndUpsertContact(contact1));
    store.dispatch(checkAccountsAndUpsertContact(contact2));
    expect(store.getState().contacts).toEqual({
      [contact1["pkh"]]: {
        name: contact1["name"],
        pkh: contact1["pkh"],
      },

      [contact2["pkh"]]: {
        name: contact2["name"],
        pkh: contact2["pkh"],
      },
    });
  });

  test("should not add the same address", () => {
    store.dispatch(checkAccountsAndUpsertContact(contact1));
    store.dispatch(checkAccountsAndUpsertContact(contact1));
    expect(Object.keys(store.getState().contacts).length).toEqual(1);
  });

  test("should not add the same name", () => {
    store.dispatch(checkAccountsAndUpsertContact(contact1));
    store.dispatch(
      checkAccountsAndUpsertContact({
        name: contact1["name"],
        pkh: contact2["pkh"],
      })
    );
    expect(store.getState().contacts).toEqual({ [contact1["pkh"]]: contact1 });
  });

  test("should delete addresses", () => {
    store.dispatch(checkAccountsAndUpsertContact(contact1));
    store.dispatch(remove(contact1.pkh));
    expect(store.getState().contacts).toEqual({});
  });

  test("should edit the name of the contact", () => {
    store.dispatch(checkAccountsAndUpsertContact(contact1));
    store.dispatch(
      checkAccountsAndUpsertContact({
        name: contact2["name"],
        pkh: contact1["pkh"],
      })
    );
    expect(store.getState().contacts).toEqual({
      [contact1["pkh"]]: {
        name: contact2["name"],
        pkh: contact1["pkh"],
      },
    });
  });

  test("should not add contact containing Account info", () => {
    const account = mockMnemonicAccount(0);
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));
    store.dispatch(
      checkAccountsAndUpsertContact({ name: account.label, pkh: account.address.pkh })
    );
    store.dispatch(
      checkAccountsAndUpsertContact({
        name: account.label,
        pkh: mockImplicitAddress(4).pkh,
      })
    );
    store.dispatch(
      checkAccountsAndUpsertContact({
        name: "mockName",
        pkh: account.address.pkh,
      })
    );
    expect(store.getState().contacts).toEqual({});
  });
});
