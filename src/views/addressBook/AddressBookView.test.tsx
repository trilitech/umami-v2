import { render, screen } from "@testing-library/react";
import { contacts } from "../../mocks/contacts";
import { ReduxStore } from "../../providers/ReduxStore";
import { contactsActions } from "../../utils/store/contactsSlice";
import { store } from "../../utils/store/store";
import AddressBookViewBase from "./AddressBookView";

const { upsert } = contactsActions;

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
    Object.values(contacts()).forEach((contact) => {
      store.dispatch(upsert(contact));
    });

    render(fixture());

    expect(screen.getAllByTestId("contact-row")).toHaveLength(3);
    const names = screen.getAllByTestId("contact-row-name");
    const pkhs = screen.getAllByTestId("contact-row-pkh");

    expect(names[0]).toHaveTextContent("Abhishek Jain");
    expect(pkhs[0]).toHaveTextContent("tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D");
    expect(names[1]).toHaveTextContent("Lev Kowalski");
    expect(pkhs[1]).toHaveTextContent("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3");
    expect(names[2]).toHaveTextContent("Lewis Hatfull");
    expect(pkhs[2]).toHaveTextContent("tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS");
  });
});
