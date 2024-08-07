import { mockContractContact, mockImplicitContact } from "@umami/core";

import { contactsActions } from "./contacts";
import { type UmamiStore, makeStore } from "../store";
const { remove } = contactsActions;

const contact1 = mockContractContact(2, "mainnet", "Mainnet Contact");
const contact2 = mockImplicitContact(3, "Mainnet Contact 2");

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("Contacts reducer", () => {
  it("is initialized with empty state", () => {
    expect(store.getState().contacts).toEqual({});
  });

  it("adds new implicit contacts", () => {
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(contactsActions.upsert(contact2));

    expect(store.getState().contacts).toEqual({
      [contact1["pkh"]]: {
        name: contact1["name"],
        pkh: contact1["pkh"],
        network: "mainnet",
      },
      [contact2["pkh"]]: {
        name: contact2["name"],
        pkh: contact2["pkh"],
        network: undefined,
      },
    });
  });

  it("adds new contract contacts", () => {
    const contact1 = mockContractContact(1, "ghostnet");
    const contact2 = mockContractContact(2, "mainnet");

    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(contactsActions.upsert(contact2));

    expect(store.getState().contacts).toEqual({
      [contact1["pkh"]]: {
        name: contact1["name"],
        pkh: contact1["pkh"],
        network: "ghostnet",
      },
      [contact2["pkh"]]: {
        name: contact2["name"],
        pkh: contact2["pkh"],
        network: "mainnet",
      },
    });
  });

  test("should not add the same contact twice", () => {
    store.dispatch(contactsActions.upsert(contact1));

    store.dispatch(contactsActions.upsert(contact1));

    expect(Object.keys(store.getState().contacts).length).toEqual(1);
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
        network: undefined,
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
