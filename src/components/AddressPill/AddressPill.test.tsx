import { contact1 } from "../../mocks/contacts";
import { mockFA1TokenRaw, mockImplicitAddress } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import assetsSlice from "../../utils/redux/slices/assetsSlice";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";
import store from "../../utils/redux/store";
import tokensSlice from "../../utils/redux/slices/tokensSlice";
import AddressPill from "./AddressPill";
const { upsert } = contactsActions;
const { updateNetwork } = assetsSlice.actions;

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
    expect(screen.queryByTestId("address-pill-left-icon")).toBeNull();
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
    store.dispatch(updateNetwork("mainnet"));
    store.dispatch(tokensSlice.actions.addTokens({ network: "mainnet", tokens: [fa1.token] }));
    render(
      <AddressPill
        address={parseContractPkh(fa1.token.contract.address as string)}
        mode={{ type: "removable", onRemove: () => {} }}
      />
    );
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });
});
