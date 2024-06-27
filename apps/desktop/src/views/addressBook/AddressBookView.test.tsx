import { type StoredContactInfo, mockImplicitContact } from "@umami/core";
import { contactsActions, networksActions, store } from "@umami/state";
import { GHOSTNET } from "@umami/tezos";

import { AddressBookView } from "./AddressBookView";
import { render, screen } from "../../mocks/testUtils";

const contact1 = mockImplicitContact(1);
const contact2 = mockImplicitContact(2);
const contact3 = mockImplicitContact(3);

const contacts: Record<string, StoredContactInfo> = {
  [contact3["pkh"]]: contact3,
  [contact2["pkh"]]: contact2,
  [contact1["pkh"]]: contact1,
};

const fixture = () => <AddressBookView />;

describe("AddressBookView", () => {
  describe("with contacts", () => {
    beforeEach(() =>
      Object.values(contacts).forEach(contact => store.dispatch(contactsActions.upsert(contact)))
    );

    it("hides empty state message", () => {
      render(fixture());

      expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
    });

    it("displays all sorted implicit contacts", () => {
      render(fixture());

      expect(screen.getAllByTestId("contact-row")).toHaveLength(3);
      const names = screen.getAllByTestId("contact-row-name");
      const pkhs = screen.getAllByTestId("contact-row-pkh");
      expect(names[0]).toHaveTextContent(contact1["name"]);
      expect(pkhs[0]).toHaveTextContent(contact1["pkh"]);
      expect(names[1]).toHaveTextContent(contact2["name"]);
      expect(pkhs[1]).toHaveTextContent(contact2["pkh"]);
      expect(names[2]).toHaveTextContent(contact3["name"]);
      expect(pkhs[2]).toHaveTextContent(contact3["pkh"]);
    });

    it("displays sorted contract contacts for current network only", () => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));
      store.dispatch(contactsActions.reset());
      store.dispatch(contactsActions.upsert({ name: "Label 2", pkh: "pkh2", network: "ghostnet" }));
      store.dispatch(contactsActions.upsert({ name: "Label 1", pkh: "pkh1", network: "mainnet" }));
      store.dispatch(contactsActions.upsert({ name: "Label 0", pkh: "pkh5", network: "ghostnet" }));

      render(fixture());

      expect(screen.getAllByTestId("contact-row")).toHaveLength(2);
      const names = screen.getAllByTestId("contact-row-name");
      const pkhs = screen.getAllByTestId("contact-row-pkh");

      expect(names[0]).toHaveTextContent("Label 0");
      expect(pkhs[0]).toHaveTextContent("pkh5");
      expect(names[1]).toHaveTextContent("Label 2");
      expect(pkhs[1]).toHaveTextContent("pkh2");
    });
  });
});
