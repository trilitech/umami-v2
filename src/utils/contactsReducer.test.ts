import { contact1, contact2 } from "../mocks/contacts";
import { contactsActions } from "./store/contactsSlice";

import { store } from "./store/store";
const { upsert, reset, remove } = contactsActions;

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
    store.dispatch(upsert(contact1));
    store.dispatch(upsert(contact1));
    expect(Object.keys(store.getState().contacts).length).toEqual(1);
  });

  test("should not add the same name", () => {
    store.dispatch(upsert(contact1));
    store.dispatch(upsert({ name: contact1["name"], pkh: contact2["pkh"] }));
    expect(store.getState().contacts).toEqual({ [contact1["pkh"]]: contact1 });
  });

  test("should delete addresses", () => {
    store.dispatch(upsert(contact1));
    store.dispatch(remove(contact1.pkh));
    expect(store.getState().contacts).toEqual({});
  });

  test("should edit the name of the contact", () => {
    store.dispatch(upsert(contact1));
    store.dispatch(upsert({ name: contact2["name"], pkh: contact1["pkh"] }));
    expect(store.getState().contacts).toEqual({
      [contact1["pkh"]]: {
        name: contact2["name"],
        pkh: contact1["pkh"],
      },
    });
  });
});
