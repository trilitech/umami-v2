import { render, screen } from "../../../../mocks/testUtils";
import { AccountType } from "../../../../types/Account";
import { MultisigSignerTileDisplay } from "./MultisigSignerTileDisplay";

test("<MultisigSignerTileDisplay /> renders the right icon given an account type", () => {
  render(
    <MultisigSignerTileDisplay
      kind="contact"
      pkh="foo"
      signerState="approvable"
      onClickApproveExecute={() => {}}
    />
  );
  expect(screen.getByTestId("contact-icon")).toBeInTheDocument();

  render(
    <MultisigSignerTileDisplay
      kind="unknownContact"
      pkh="foo"
      signerState="approvable"
      onClickApproveExecute={() => {}}
    />
  );
  expect(screen.getByTestId("unknown-contact-icon")).toBeInTheDocument();

  render(
    <MultisigSignerTileDisplay
      kind={AccountType.LEDGER}
      pkh="foo"
      signerState="approvable"
      onClickApproveExecute={() => {}}
    />
  );
  expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();

  render(
    <MultisigSignerTileDisplay
      kind={AccountType.MNEMONIC}
      pkh="foo"
      signerState="approvable"
      onClickApproveExecute={() => {}}
    />
  );
  expect(screen.getByTestId("identicon")).toBeInTheDocument();

  render(
    <MultisigSignerTileDisplay
      kind={AccountType.SOCIAL}
      pkh="foo"
      signerState="approvable"
      onClickApproveExecute={() => {}}
    />
  );
  expect(screen.getByTestId("social-icon")).toBeInTheDocument();
});
