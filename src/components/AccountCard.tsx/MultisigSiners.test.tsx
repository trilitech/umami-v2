import MultisigSigners from "./MultisigSigners";
import { fireEvent, render, screen } from "../../mocks/testUtils";
describe("<MultisigSiners/>", () => {
  it("should display singers by default", () => {
    render(<MultisigSigners signers={["singer1"]} />);

    expect(screen.getByTestId("multisig-tag-section")).toBeInTheDocument();
  });

  it("should hide singers on click", () => {
    render(<MultisigSigners signers={["singer1"]} />);
    const button = screen.getByTestId("multisig-toggle-button");
    fireEvent.click(button);
    expect(screen.queryByTestId("multisig-tag-section")).toBeFalsy();
  });
});
