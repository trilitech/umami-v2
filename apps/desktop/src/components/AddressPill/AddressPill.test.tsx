import { mockFA1TokenRaw, mockImplicitContact } from "@umami/core";
import {
  type UmamiStore,
  contactsActions,
  makeStore,
  networksActions,
  tokensActions,
} from "@umami/state";
import { MAINNET, mockImplicitAddress, parseContractPkh, parseImplicitPkh } from "@umami/tezos";

import { AddressPill } from "./AddressPill";
import { render, screen } from "../../mocks/testUtils";

const contact = mockImplicitContact(1);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AddressPill />", () => {
  it("displays left icon", () => {
    store.dispatch(contactsActions.upsert(contact));
    render(<AddressPill address={parseImplicitPkh(contact.pkh)} />, { store });
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
  });

  it("displays right icon", () => {
    render(<AddressPill address={parseImplicitPkh(contact.pkh)} />, { store });
    expect(screen.getByTestId("address-pill-right-icon")).toBeInTheDocument();
  });

  it("hides icon", () => {
    store.dispatch(contactsActions.upsert(contact));
    render(<AddressPill address={parseImplicitPkh(contact.pkh)} mode="no_icons" />, {
      store,
    });
    expect(screen.queryByTestId("address-pill-left-icon")).not.toBeInTheDocument();
  });

  it("is removable", () => {
    render(<AddressPill address={parseImplicitPkh(contact.pkh)} onRemove={jest.fn()} />, { store });
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });

  it("is removable for two icons", () => {
    const address = mockImplicitAddress(0);
    const fa1 = mockFA1TokenRaw(1, address.pkh, 123);
    store.dispatch(networksActions.setCurrent(MAINNET));
    store.dispatch(tokensActions.addTokens({ network: MAINNET, tokens: [fa1.token] }));
    render(
      <AddressPill address={parseContractPkh(fa1.token.contract.address)} onRemove={jest.fn()} />,
      { store }
    );
    expect(screen.getByTestId("address-pill-left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });
});
