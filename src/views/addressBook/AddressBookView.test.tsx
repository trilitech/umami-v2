import { AddressBookView } from "./AddressBookView";
import { contact1, contact2, contact3, contacts } from "../../mocks/contacts";
import { render, screen } from "../../mocks/testUtils";
import { store } from "../../utils/redux/store";
import { checkAccountsAndUpsertContact } from "../../utils/redux/thunks/checkAccountsAndUpsertContact";

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
        store.dispatch(checkAccountsAndUpsertContact(contact));
      });
    });

    it("hides empty state message", () => {
      render(fixture());

      expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
    });

    it("displays sorted contacts", () => {
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
  });
});
