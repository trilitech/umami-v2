import { contact1 } from "../../mocks/contacts";
import { render, screen } from "../../mocks/testUtils";
import { parseImplicitPkh } from "../../types/Address";
import { contactsActions } from "../../utils/store/contactsSlice";
import { store } from "../../utils/store/store";
import AddressPill from "./AddressPill";
const { reset, upsert } = contactsActions;
beforeEach(() => {
  store.dispatch(reset());
});

beforeEach(() => {
  store.dispatch(reset());
});

describe("<AddressPill />", () => {
  test("AddressPill displays left icon", () => {
    store.dispatch(upsert(contact1));
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} />);
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
  });

  test("AddressPill displays right icon", () => {
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} />);
    expect(screen.getByTestId("address-pill-right-icon")).toBeInTheDocument();
  });

  test("AddressPill hides icon", () => {
    store.dispatch(upsert(contact1));
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} mode="no_icons" />);
    expect(screen.queryByTestId("address-pill-left-icon")).toBeNull();
  });

  test("AddressPill is removable", () => {
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} mode="removable" />);
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });
});
