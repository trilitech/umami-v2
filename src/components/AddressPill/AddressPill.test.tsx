import { contact1 } from "../../mocks/contacts";
import { mockFA1Token, mockImplicitAddress } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import assetsSlice from "../../utils/store/assetsSlice";
import { contactsActions } from "../../utils/store/contactsSlice";
import { store } from "../../utils/store/store";
import AddressPill from "./AddressPill";
const { upsert } = contactsActions;
const { updateTokenBalance } = assetsSlice.actions;

describe("<AddressPill />", () => {
  it("AddressPill displays left icon", () => {
    store.dispatch(upsert(contact1));
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} />);
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
  });

  it("AddressPill displays right icon", () => {
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} />);
    expect(screen.getByTestId("address-pill-right-icon")).toBeInTheDocument();
  });

  it("AddressPill hides icon", () => {
    store.dispatch(upsert(contact1));
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} mode="no_icons" />);
    expect(screen.queryByTestId("address-pill-left-icon")).toBeNull();
  });

  it("AddressPill is removable", () => {
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} mode="removable" />);
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });

  it("AddressPill is removable for two icons", () => {
    const address = mockImplicitAddress(0);
    const fa1 = mockFA1Token(1, address.pkh, 123);
    store.dispatch(updateTokenBalance([fa1]));
    render(
      <AddressPill
        address={parseContractPkh(fa1.token.contract?.address as string)}
        mode="removable"
      />
    );
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });
});
