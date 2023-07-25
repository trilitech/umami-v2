import { render, screen } from "@testing-library/react";
import { ReduxStore } from "../providers/ReduxStore";
import ContactSelector from "./ContactSelector";

import { contact1 } from "../mocks/contacts";
import { formatPkh } from "../utils/format";
import { store } from "../utils/redux/store";
import checkAccountsAndUpsertContact from "../utils/redux/thunks/checkAccountsAndUpsertContact";

const fixture = (selected?: string) => (
  <ReduxStore>
    <ContactSelector onSelect={() => {}} selected={selected} />
  </ReduxStore>
);

describe("ContactSelector", () => {
  it("displays no contacts by default", () => {
    render(fixture());
    expect(screen.queryByTestId("contact-selector")).toHaveTextContent("Select a contact");
  });
  it("displays contacts", () => {
    store.dispatch(checkAccountsAndUpsertContact(contact1));
    render(fixture(contact1["pkh"]));
    const contacts = screen.queryAllByTestId("contact-small-tile");

    expect(contacts[0]).toHaveTextContent(contact1.name);
    expect(contacts[0]).toHaveTextContent(formatPkh(contact1.pkh));
  });
});
