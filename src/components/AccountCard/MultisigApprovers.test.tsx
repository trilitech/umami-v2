import MultisigApprovers from "./MultisigApprovers";
import { fireEvent, render, screen } from "../../mocks/testUtils";
describe("<MultisigApprovers/>", () => {
  it("should display approvers by default", () => {
    render(<MultisigApprovers signers={["singer1"]} />);

    expect(screen.getByTestId("multisig-tag-section")).toBeInTheDocument();
  });

  it("should hide approvers on click", () => {
    render(<MultisigApprovers signers={["singer1"]} />);
    const button = screen.getByTestId("multisig-toggle-button");
    fireEvent.click(button);
    expect(screen.queryByTestId("multisig-tag-section")).toBeFalsy();
  });
});
