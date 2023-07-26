import { render, screen } from "@testing-library/react";
import { contact1, contact2, contact3, contacts } from "../../mocks/contacts";
import { ReduxStore } from "../../providers/ReduxStore";
import { formatPkh } from "../../utils/format";
import store from "../../utils/redux/store";
import checkAccountsAndUpsertContact from "../../utils/redux/thunks/checkAccountsAndUpsertContact";
import AddressBookViewBase from "./AddressBookView";

const fixture = () => (
  <ReduxStore>
    <AddressBookViewBase />
  </ReduxStore>
);

describe("AddressBookView", () => {
  it("displays no contacts by default", () => {
    render(fixture());
    expect(screen.queryByTestId("contact-row")).toBeNull();
  });

  it("displays sorted contacts", () => {
    Object.values(contacts()).forEach(contact => {
      store.dispatch(checkAccountsAndUpsertContact(contact));
    });

    render(fixture());

    expect(screen.getAllByTestId("contact-row")).toHaveLength(3);
    const names = screen.getAllByTestId("contact-row-name");
    const pkhs = screen.getAllByTestId("address-pill-text");

    expect(names[0]).toHaveTextContent(contact3["name"]);
    expect(pkhs[0]).toHaveTextContent(formatPkh(contact3["pkh"]));
    expect(names[1]).toHaveTextContent(contact2["name"]);
    expect(pkhs[1]).toHaveTextContent(formatPkh(contact2["pkh"]));
    expect(names[2]).toHaveTextContent(contact1["name"]);
    expect(pkhs[2]).toHaveTextContent(formatPkh(contact1["pkh"]));
  });
});
