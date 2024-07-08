import { KNOWN_ADDRESS_TYPES, mockFA2AddressKind } from "@umami/components";

import { RightIcon } from "./RightIcon";
import { render, screen } from "../../mocks/testUtils";

describe("<RightIcon />", () => {
  it.each(KNOWN_ADDRESS_TYPES)("renders nothing for %s address type", type => {
    render(<RightIcon addressKind={{ type: type as any, pkh: "pkh", label: "label" }} />);

    expect(screen.queryByTestId("add-contact-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("xmark-icon-path")).not.toBeInTheDocument();
  });

  it("renders an add contact icon by default", () => {
    render(<RightIcon addressKind={mockFA2AddressKind()} />);
    expect(screen.getByTestId("add-contact-icon")).toBeVisible();
    expect(screen.queryByTestId("xmark-icon-path")).not.toBeInTheDocument();
  });

  it("returns x mark icon", () => {
    render(<RightIcon addressKind={mockFA2AddressKind()} onRemove={jest.fn()} />);
    expect(screen.queryByTestId("add-contact-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("xmark-icon-path")).toBeVisible();
  });
});
