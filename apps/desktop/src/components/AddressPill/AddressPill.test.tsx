import { mockFA1TokenRaw, mockImplicitContact } from "@umami/core";
import { contactsActions, networksActions, store, tokensSlice } from "@umami/state";
import { MAINNET, mockImplicitAddress, parseContractPkh, parseImplicitPkh } from "@umami/tezos";

import { AddressPill } from "./AddressPill";
import { render, screen } from "../../mocks/testUtils";
const { upsert } = contactsActions;

const contact = mockImplicitContact(1);

describe("<AddressPill />", () => {
  it("displays left icon", () => {
    store.dispatch(upsert(contact));
    render(<AddressPill address={parseImplicitPkh(contact.pkh)} />);
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
  });

  it("displays right icon", () => {
    render(<AddressPill address={parseImplicitPkh(contact.pkh)} />);
    expect(screen.getByTestId("address-pill-right-icon")).toBeInTheDocument();
  });

  it("hides icon", () => {
    store.dispatch(upsert(contact));
    render(<AddressPill address={parseImplicitPkh(contact.pkh)} mode={{ type: "no_icons" }} />);
    expect(screen.queryByTestId("address-pill-left-icon")).not.toBeInTheDocument();
  });

  it("is removable", () => {
    render(
      <AddressPill
        address={parseImplicitPkh(contact.pkh)}
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
