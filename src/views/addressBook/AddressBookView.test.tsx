import { AddressBookView } from "./AddressBookView";
import { contact1, contact2, contact3, contacts } from "../../mocks/contacts";
import { render, screen } from "../../mocks/testUtils";
import { GHOSTNET } from "../../types/Network";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";

const fixture = () => <AddressBookView />;

describe("AddressBookView", () => {
  describe("without contacts", () => {
    it("displays no contact rows", () => {
      render(fixture());

      expect(screen.queryByTestId("contact-row")).not.toBeInTheDocument();
    });

    it("displays empty state message", () => {
      render(fixture());

      expect(screen.getByTestId("empty-state-message")).toBeInTheDocument();
      expect(screen.getByText("Your address book is empty")).toBeVisible();
      expect(screen.getByText("Your contacts will appear here...")).toBeVisible();
    });
  });

  describe("with contacts", () => {
    beforeEach(() => {
      Object.values(contacts()).forEach(contact => {
        store.dispatch(contactsActions.upsert(contact));
      });
    });

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
