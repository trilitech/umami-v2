import { LeftIcon, RightIcon } from "./AddressPillIcon";
import { AddressKindType } from "./types";
import { mockFA2Address } from "../../mocks/addressKind";
import { mockContractAddress } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";

describe("AddressPill Icons", () => {
  it.each(["multisig", "fa1.2", "fa2", "baker", "contact"])("renders %s left icon", type => {
    render(
      <LeftIcon
        addressKind={{
          type: type as AddressKindType,
          pkh: mockContractAddress(0).pkh,
          label: "label" as any,
        }}
      />
    );

    expect(screen.getByTestId(`${type}-icon`)).toBeInTheDocument();
  });

  it("Left icon with unknown/implicit address returns null", () => {
    expect(
      LeftIcon({
        addressKind: { type: "implicit", pkh: mockContractAddress(0).pkh, label: "label" },
      })
    ).toBeNull();

    expect(
      LeftIcon({ addressKind: { type: "unknown", pkh: mockContractAddress(0).pkh, label: null } })
    ).toBeNull();
  });

  it("Right icon renders", () => {
    render(<RightIcon addressKind={mockFA2Address} addressPillMode={{ type: "default" }} />);
    expect(screen.getByTestId("add-contact-icon")).toBeInTheDocument();
  });

  it("Right icon returns x mark icon", () => {
    render(
      <RightIcon
        addressKind={mockFA2Address}
        addressPillMode={{ type: "removable", onRemove: () => {} }}
      />
    );
    expect(screen.getByTestId("xmark-icon-path")).toBeInTheDocument();
  });
});
