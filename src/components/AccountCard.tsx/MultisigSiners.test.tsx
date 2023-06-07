import MultisigSigners from "./MultisigSigners";
import { fireEvent, render, screen } from "../../mocks/testUtils";
import AccountCard from ".";
import { AccountType, MultisigAccount } from "../../types/Account";
describe("<MultisigSiners/>", () => {
  it("should display singers by default", () => {
    render(<MultisigSigners signers={["singer1"]} />);

    expect(screen.getByTestId("multisig-tag-section")).toBeInTheDocument();
  });
  it("should display singers from AccountCard", () => {
    const mockMultisigAccount = {
      type: AccountType.MULTISIG,
      pkh: "pkh",
      label: "label",
      threshold: 1,
      signers: ["signers2"],
      balance: "1",
      operations: [],
    } as MultisigAccount;

    render(<AccountCard account={mockMultisigAccount} />);

    expect(screen.getByTestId("multisig-tag-section")).toBeInTheDocument();
  });

  it("should hide singers on click", () => {
    render(<MultisigSigners signers={["singer1"]} />);
    const button = screen.getByTestId("multisig-toggle-button");
    fireEvent.click(button);
    expect(screen.queryByTestId("multisig-tag-section")).toBeFalsy();
  });
});
