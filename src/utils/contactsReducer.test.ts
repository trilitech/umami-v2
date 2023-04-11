import { contact1, contact2, contact3 } from "../mocks/contacts";
import { ContactsActions } from "./store/contactsSlice";

import { store } from "./store/store";
const { edit, reset, add, remove } = ContactsActions;

afterEach(() => {
  store.dispatch(reset());
});

describe("Contacts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().contacts).toEqual({
      contacts: {},
    });
  });

  test("should handle adding accounts", () => {
    store.dispatch(add(contact1));
    store.dispatch(add(contact2));
    expect(store.getState().contacts).toEqual({
      contacts: {
        tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS: {
          name: "Lewis Hatfull",
          pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        },

        tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3: {
          name: "Lev Kowalski",
          pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        },
      },
    });
  });

  test("should not add the same address", () => {
    store.dispatch(add(contact1));
    store.dispatch(add(contact1));
    expect(Object.keys(store.getState().contacts.contacts).length).toEqual(1);
  });

  test("should delete addresses", () => {
    store.dispatch(add(contact1));
    store.dispatch(remove(contact1.pkh));
    expect(store.getState().contacts).toEqual({
      contacts: {},
    });

    expect(Object.values(store.getState().contacts.contacts).length).toEqual(0);
  });

  test("should edit addresses", () => {
    store.dispatch(add(contact1));
    store.dispatch(
      edit({ addressToEdit: contact1["pkh"], newContact: contact2 })
    );
    expect(Object.values(store.getState().contacts.contacts).length).toEqual(1);
    expect(store.getState().contacts).toEqual({
      contacts: {
        tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3: {
          name: "Lev Kowalski",
          pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        },
      },
    });
  });

  test("should not edit non existent address", () => {
    store.dispatch(add(contact1));
    store.dispatch(add(contact2));
    store.dispatch(
      edit({ addressToEdit: contact3["pkh"], newContact: contact3 })
    );
    expect(Object.values(store.getState().contacts.contacts).length).toEqual(2);
    expect(store.getState().contacts).toEqual({
      contacts: {
        tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3: {
          name: "Lev Kowalski",
          pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        },

        tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS: {
          name: "Lewis Hatfull",
          pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        },
      },
    });
  });

  test("should not edit to an address that already exists", () => {
    store.dispatch(add(contact1));
    store.dispatch(add(contact2));
    store.dispatch(
      edit({ addressToEdit: contact1["pkh"], newContact: contact2 })
    );
    expect(store.getState().contacts).toEqual({
      contacts: {
        tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3: {
          name: "Lev Kowalski",
          pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
        },

        tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS: {
          name: "Lewis Hatfull",
          pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
        },
      },
    });
  });
});
