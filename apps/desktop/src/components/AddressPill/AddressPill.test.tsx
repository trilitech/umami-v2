import { AddressPill } from "./AddressPill";
import { contact1 } from "../../mocks/contacts";
import { mockFA1TokenRaw, mockImplicitAddress } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import { MAINNET } from "../../types/Network";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { tokensSlice } from "../../utils/redux/slices/tokensSlice";
import { store } from "../../utils/redux/store";
const { upsert } = contactsActions;

describe("<AddressPill />", () => {
  it("displays left icon", () => {
    store.dispatch(upsert(contact1));
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} />);
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
  });

  it("displays right icon", () => {
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} />);
    expect(screen.getByTestId("address-pill-right-icon")).toBeInTheDocument();
  });

  it("hides icon", () => {
    store.dispatch(upsert(contact1));
    render(<AddressPill address={parseImplicitPkh(contact1.pkh)} mode={{ type: "no_icons" }} />);
    expect(screen.queryByTestId("address-pill-left-icon")).not.toBeInTheDocument();
  });

  it("is removable", () => {
    render(
      <AddressPill
        address={parseImplicitPkh(contact1.pkh)}
        mode={{ type: "removable", onRemove: () => {} }}
      />
    );
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });

  it("is removable for two icons", () => {
    const address = mockImplicitAddress(0);
    const fa1 = mockFA1TokenRaw(1, address.pkh, 123);
    store.dispatch(networksActions.setCurrent(MAINNET));
    store.dispatch(tokensSlice.actions.addTokens({ network: MAINNET, tokens: [fa1.token] }));
    render(
      <AddressPill
        address={parseContractPkh(fa1.token.contract.address)}
        mode={{ type: "removable", onRemove: () => {} }}
      />
    );
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });
});
