import { render, screen } from "@testing-library/react";
import { contact1 } from "../mocks/contacts";
import { mockImplicitAccount } from "../mocks/factories";
import { ReduxStore } from "../providers/ReduxStore";
import { formatPkh, truncate } from "../utils/format";
import accountsSlice from "../utils/store/accountsSlice";
import { store } from "../utils/store/store";
import checkAccountsAndUpsertContact from "../utils/store/thunks/checkAccountsAndUpsertContact";
import AccountOrContactTile, { ContactTile } from "./AccountOrContactTile";
const { add, reset } = accountsSlice.actions;

const contactTileFixture = (pkh: string, contactName: string | null) => {
  return (
    <ReduxStore>
      <ContactTile pkh={pkh} contactName={contactName} />
    </ReduxStore>
  );
};
const AccountOrContactTileFixture = (pkh: string) => {
  return (
    <ReduxStore>
      <AccountOrContactTile pkh={pkh} />
    </ReduxStore>
  );
};

describe("ContactTile", () => {
  it("displays the address if it is not in the contacts", () => {
    render(contactTileFixture(contact1["pkh"], null));
    expect(screen.queryByTestId("contact-tile")).toHaveTextContent(formatPkh(contact1["pkh"]));
  });
  it("displays the name if it is in the contacts", () => {
    render(contactTileFixture(contact1["pkh"], contact1["name"]));
    expect(screen.queryByTestId("contact-tile")).toHaveTextContent(truncate(contact1["name"], 20));
  });
});

describe("AccountOrContactTile", () => {
  it("displays account label if the address is in accounts", () => {
    const account = mockImplicitAccount(0);
    const pkh = account.address.pkh;
    store.dispatch(add(account));
    render(AccountOrContactTileFixture(pkh));
    expect(screen.queryByTestId("account-or-contact-tile")).toHaveTextContent(account.label);
  });

  it("displays Contact tile if in contact", () => {
    store.dispatch(reset());
    store.dispatch(checkAccountsAndUpsertContact(contact1));
    render(AccountOrContactTileFixture(contact1.pkh));
    expect(screen.queryByTestId("contact-tile")).toHaveTextContent(truncate(contact1["name"], 20));
  });
});
