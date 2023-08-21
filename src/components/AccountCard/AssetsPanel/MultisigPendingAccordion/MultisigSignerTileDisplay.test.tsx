import { mockImplicitAccount } from "../../../../mocks/factories";
import { render, screen, cleanup } from "../../../../mocks/testUtils";
import { AccountType } from "../../../../types/Account";
import { formatPkh } from "../../../../utils/formatPkh";
import { MultisigSignerTileDisplay } from "./MultisigSignerTileDisplay";

const pkh = mockImplicitAccount(0).address.pkh;

describe("<MultisigSignerTileDisplay />", () => {
  it("renders the right icon and a shrinked address given an account type", () => {
    const shrinkedAddress = formatPkh(pkh);
    render(
      <MultisigSignerTileDisplay
        kind="contact"
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
      />
    );
    expect(screen.getByTestId("contact-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        kind={AccountType.LEDGER}
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
      />
    );
    expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        kind={AccountType.MNEMONIC}
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
      />
    );
    expect(screen.getByTestId("identicon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        kind={AccountType.SOCIAL}
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
      />
    );
    expect(screen.getByTestId("social-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
  });

  it("should render correct icon and full address on unknown accounts", () => {
    render(
      <MultisigSignerTileDisplay
        kind="unknown"
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
      />
    );
    expect(screen.getByTestId("unknown-contact-icon")).toBeInTheDocument();
    expect(screen.getByText(pkh)).toBeInTheDocument();
  });
});
