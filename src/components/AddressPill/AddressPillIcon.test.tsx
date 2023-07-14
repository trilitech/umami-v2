import { mockFA2Address } from "../../mocks/addressKind";
import { mockContractAddress } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { contactsActions } from "../../utils/store/contactsSlice";
import { store } from "../../utils/store/store";
import { LeftIcon, RightIcon } from "./AddressPillIcon";
import { AddressKindType } from "./types";
const { reset } = contactsActions;
beforeEach(() => {
  store.dispatch(reset());
});
describe("AddressPill Icons", () => {
  it("Left icon renders", () => {
    const addressKindTypesWithLeftIcon: AddressKindType[] = [
      "ownedMultisig",
      "fa1.2",
      "fa2",
      "baker",
      "contact",
    ];

    addressKindTypesWithLeftIcon.forEach(type => {
      render(
        <LeftIcon addressKind={{ type, pkh: mockContractAddress(0).pkh, label: "label" as any }} />
      );

      expect(screen.getByTestId(`${type}-icon`)).toBeInTheDocument();
    });
  });

  it("Left icon with unknown/ownedImplicit address returns null", () => {
    expect(
      LeftIcon({
        addressKind: { type: "ownedImplicit", pkh: mockContractAddress(0).pkh, label: "label" },
      })
    ).toBeNull();

    expect(
      LeftIcon({ addressKind: { type: "unknown", pkh: mockContractAddress(0).pkh, label: null } })
    ).toBeNull();
  });

  it("Right icon renders", () => {
    render(<RightIcon addressKind={mockFA2Address} isRemove={false} />);
    expect(screen.getByTestId("add-contact-icon")).toBeInTheDocument();
  });

  it("Right icon returns x mark icon", () => {
    render(<RightIcon addressKind={mockFA2Address} isRemove={true} />);
    expect(screen.getByTestId("x-mark-icon")).toBeInTheDocument();
  });
});
