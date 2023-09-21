import { mockImplicitAccount } from "../../../../mocks/factories";
import { render, screen, cleanup } from "../../../../mocks/testUtils";
import { AccountType } from "../../../../types/Account";
import { formatPkh } from "../../../../utils/formatPkh";
import { MultisigSignerTileDisplay } from "./MultisigSignerTileDisplay";

const pkh = mockImplicitAccount(0).address.pkh;
const label = "my label";

describe("<MultisigSignerTileDisplay />", () => {
  const shrinkedAddress = formatPkh(pkh);
  it("renders the right icon with a shrinked address and label l for known addresses", () => {
    render(
      <MultisigSignerTileDisplay
        kind="contact"
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        label={label}
      />
    );
    expect(screen.getByTestId("contact-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        kind={AccountType.LEDGER}
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        label={label}
      />
    );
    expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        kind={AccountType.MNEMONIC}
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        label={label}
      />
    );
    expect(screen.getByTestId("identicon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        kind={AccountType.SOCIAL}
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        label={label}
      />
    );
    expect(screen.getByTestId("social-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("renders the right icon with no label for unknown addresses", () => {
    render(
      <MultisigSignerTileDisplay
        kind="unknown"
        pkh={pkh}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        label={label}
      />
    );
    expect(screen.getByTestId("unknown-contact-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.queryByText(label)).not.toBeInTheDocument();
  });
});
