import { contactsActions } from "./contactsSlice";
import { contact1, contact2 } from "../../../mocks/contacts";
import { store } from "../store";
const { remove } = contactsActions;

describe("Contacts reducer", () => {
  test("store should initialize with empty state", () => {
    expect(store.getState().contacts).toEqual({});
  });

  test("should add new contacts", () => {
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(contactsActions.upsert(contact2));
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
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(contactsActions.upsert(contact1));
    expect(Object.keys(store.getState().contacts).length).toEqual(1);
  });

  test("should not add the same name", () => {
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(
      contactsActions.upsert({
        name: contact1["name"],
        pkh: contact2["pkh"],
      })
    );
    expect(store.getState().contacts).toEqual({ [contact1["pkh"]]: contact1 });
  });

  test("should delete addresses", () => {
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(remove(contact1.pkh));
    expect(store.getState().contacts).toEqual({});
  });

  test("should edit the name of the contact", () => {
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(
      contactsActions.upsert({
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
});
