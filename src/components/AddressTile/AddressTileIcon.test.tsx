import { AddressTileIcon } from "./AddressTileIcon";
import { AddressKind } from "./types";
import { render, screen } from "../../mocks/testUtils";

const fixture = (addressKind: AddressKind) => <AddressTileIcon addressKind={addressKind} />;

describe("<AddressTileIcon />", () => {
  it("displays the mnemonic icon", () => {
    render(fixture({ type: "mnemonic", pkh: "tz1", label: "label" }));
    expect(screen.getByTestId("identicon")).toBeInTheDocument();
  });

  it("displays the social icon", () => {
    render(fixture({ type: "social", pkh: "tz1", label: "label" }));
    expect(screen.getByTestId("social-icon")).toBeInTheDocument();
  });

  it("displays the ledger icon", () => {
    render(fixture({ type: "ledger", pkh: "tz1", label: "label" }));
    expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();
  });

  it("displays the multisig icon", () => {
    render(fixture({ type: "multisig", pkh: "tz1", label: "label" }));
    expect(screen.getByTestId("key-icon")).toBeInTheDocument();
  });

  it("displays the baker icon", () => {
    render(fixture({ type: "baker", pkh: "tz1", label: "label" }));
    expect(screen.getByTestId("baker-icon")).toBeInTheDocument();
  });

  it("displays the contact icon", () => {
    render(fixture({ type: "contact", pkh: "tz1", label: "label" }));
    expect(screen.getByTestId("contact-icon")).toBeInTheDocument();
  });
  it("displays the unknown icon", () => {
    render(fixture({ type: "unknown", pkh: "tz1", label: null }));
    expect(screen.getByTestId("unknown-contact-icon")).toBeInTheDocument();
  });
});
