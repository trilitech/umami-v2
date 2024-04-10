import { contactsActions } from "./contactsSlice";
import { contact1, contact2 } from "../../../mocks/contacts";
import { mockContractContact } from "../../../mocks/factories";
import { store } from "../store";
const { remove } = contactsActions;

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
        network: undefined,
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
