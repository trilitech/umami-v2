import { type UmamiStore, contactsActions, makeStore, networksActions } from "@umami/state";
import { GHOSTNET, formatPkh, mockImplicitAddress } from "@umami/tezos";

import { AddressPillText } from "./AddressPillText";
import { mockFA2AddressKind } from "./testUtils";
import { render, screen } from "../testUtils";
const { upsert } = contactsActions;

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AddressPillText />", () => {
  it("shows contact name if match is found in any network", () => {
    store.dispatch(networksActions.setCurrent(GHOSTNET));
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2AddressKind().pkh, network: "mainnet" }));

    render(<AddressPillText addressKind={mockFA2AddressKind()} showPkh={false} />, { store });

    expect(screen.getByText("FA2Name")).toBeVisible();
  });

  it("shows the formatted pkh with showPkh=true", () => {
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2AddressKind().pkh, network: "mainnet" }));

    render(<AddressPillText addressKind={mockFA2AddressKind()} showPkh={true} />, { store });

    expect(screen.getByText(formatPkh(mockFA2AddressKind().pkh))).toBeVisible();
  });

  it("shows label", () => {
    render(
      <AddressPillText
        addressKind={{
          type: "secret_key",
          pkh: mockImplicitAddress(0).pkh,
          label: "Some label",
        }}
        showPkh={false}
      />,
      { store }
    );

    expect(screen.getByText("Some label")).toBeVisible();
  });

  it("shows alias", () => {
    render(
      <AddressPillText addressKind={mockFA2AddressKind()} alias="test alias" showPkh={false} />,
      {
        store,
      }
    );

    expect(screen.getByText("test alias")).toBeVisible();
  });

  it("fallbacks to formatted pkh without fallback text", () => {
    render(<AddressPillText addressKind={mockFA2AddressKind()} showPkh={false} />, { store });

    expect(screen.getByText(formatPkh(mockFA2AddressKind().pkh))).toBeVisible();
  });
});
