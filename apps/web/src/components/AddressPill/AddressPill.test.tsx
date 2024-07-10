import { mockImplicitContact } from "@umami/core";
import { type UmamiStore, contactsActions, makeStore } from "@umami/state";
import { parseImplicitPkh } from "@umami/tezos";

import { AddressPill } from "./AddressPill";
import { act, render, screen, userEvent } from "../../testUtils";

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

  it("can hide icons", () => {
    store.dispatch(contactsActions.upsert(contact));

    render(<AddressPill address={parseImplicitPkh(contact.pkh)} mode="no_icons" />, {
      store,
    });

    expect(screen.queryByTestId("address-pill-left-icon")).not.toBeInTheDocument();
  });

  it("copies text on click", async () => {
    const user = userEvent.setup();
    jest.spyOn(navigator.clipboard, "writeText");

    render(<AddressPill address={parseImplicitPkh(contact.pkh)} />, { store });

    await act(() => user.click(screen.getByTestId("address-pill-copy-button")));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(contact.pkh);
  });
});
