import { AddressTileIcon } from "./AddressTileIcon";
import { AddressKind } from "./types";
import { mockContractAddress, mockImplicitAddress } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";

const fixture = (addressKind: AddressKind) => <AddressTileIcon addressKind={addressKind} />;

describe("<AddressTileIcon />", () => {
  it("displays the mnemonic icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "mnemonic", label: "label" }));
    expect(screen.getByTestId("identicon")).toBeInTheDocument();
  });

  it("displays the social icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "social", label: "label" }));
    expect(screen.getByTestId("social-icon")).toBeInTheDocument();
  });

  it("displays the ledger icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "ledger", label: "label" }));
    expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();
  });

  it("displays the multisig icon", () => {
    render(fixture({ ...mockContractAddress(0), type: "multisig", label: "label" }));
    expect(screen.getByTestId("key-icon")).toBeInTheDocument();
  });

  it("displays the baker icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "baker", label: "label" }));
    expect(screen.getByTestId("baker-icon")).toBeInTheDocument();
  });

  it("displays the contact icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "contact", label: "label" }));
    expect(screen.getByTestId("contact-icon")).toBeInTheDocument();
  });

  it("displays the unknown icon", () => {
    render(fixture({ ...mockImplicitAddress(0), type: "unknown", label: null }));
    expect(screen.getByTestId("unknown-contact-icon")).toBeInTheDocument();
  });
});
