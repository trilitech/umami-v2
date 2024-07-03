import { type UmamiStore, contactsActions, makeStore, networksActions } from "@umami/state";
import { GHOSTNET, formatPkh, mockImplicitAddress } from "@umami/tezos";

import { AddressPillText } from "./AddressPillText";
import { mockFA2Address } from "../../mocks/addressKind";
import { render, screen } from "../../mocks/testUtils";
const { upsert } = contactsActions;

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AddressPillText />", () => {
  it("shows contact name if match is found in any network", () => {
    store.dispatch(networksActions.setCurrent(GHOSTNET));
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2Address.pkh, network: "mainnet" }));

    render(<AddressPillText addressKind={mockFA2Address} showPkh={false} />, { store });

    expect(screen.getByText("FA2Name")).toBeInTheDocument();
  });

  it("shows the formatted pkh with showPkh=true", () => {
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2Address.pkh, network: "mainnet" }));

    render(<AddressPillText addressKind={mockFA2Address} showPkh={true} />, { store });

    expect(screen.getByText(formatPkh(mockFA2Address.pkh))).toBeInTheDocument();
  });

  it("shows label", () => {
    render(
      <AddressPillText
        addressKind={{
          type: "implicit",
          pkh: mockImplicitAddress(0).pkh,
          label: "Some label",
        }}
        showPkh={false}
      />,
      { store }
    );

    expect(screen.getByText("Some label")).toBeInTheDocument();
  });

  it("shows alias", () => {
    render(<AddressPillText addressKind={mockFA2Address} alias="test alias" showPkh={false} />, {
      store,
    });

    expect(screen.getByText("test alias")).toBeInTheDocument();
  });

  it("fallbacks to formatted pkh without fallback text", () => {
    render(<AddressPillText addressKind={mockFA2Address} showPkh={false} />, { store });

    expect(screen.getByText(formatPkh(mockFA2Address.pkh))).toBeInTheDocument();
  });
});
