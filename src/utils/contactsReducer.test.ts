import { contact1, contact2 } from "../mocks/contacts";
import { ContactsActions } from "./store/contactsSlice";

import { store } from "./store/store";
const { upsert, reset, remove } = ContactsActions;

afterEach(() => {
  store.dispatch(reset());
});

describe("Contacts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().contacts).toEqual({});
  });

  test("should add new contacts", () => {
    store.dispatch(upsert(contact1));
    store.dispatch(upsert(contact2));
    expect(store.getState().contacts).toEqual({
      tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS: {
        name: "Lewis Hatfull",
        pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },

      tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3: {
        name: "Lev Kowalski",
        pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3",
      },
    });
  });

  test("should not add the same address", () => {
    store.dispatch(upsert(contact1));
    store.dispatch(upsert(contact1));
    expect(Object.keys(store.getState().contacts).length).toEqual(1);
  });

  test("should delete addresses", () => {
    store.dispatch(upsert(contact1));
    store.dispatch(remove(contact1.pkh));
    expect(store.getState().contacts).toEqual({});

    expect(Object.values(store.getState().contacts).length).toEqual(0);
  });

  test("should edit the name of the contact", () => {
    store.dispatch(upsert(contact1));
    store.dispatch(upsert({ name: contact2["name"], pkh: contact1["pkh"] }));
    expect(Object.values(store.getState().contacts).length).toEqual(1);
    expect(store.getState().contacts).toEqual({
      tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS: {
        name: "Lev Kowalski",
        pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
      },
    });
  });
});
