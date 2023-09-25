import { mockImplicitAccount } from "../../../../mocks/factories";
import { render, screen, cleanup } from "../../../../mocks/testUtils";
import { AccountType } from "../../../../types/Account";
import { formatPkh } from "../../../../utils/formatPkh";
import { MultisigSignerTileDisplay } from "./MultisigSignerTileDisplay";

const pkh = mockImplicitAccount(0).address.pkh;
const label = "my label";
const shrinkedAddress = formatPkh(pkh);

describe("<MultisigSignerTileDisplay />", () => {
  it("renders the right icon with a shrinked address and label l for known addresses", () => {
    render(
      <MultisigSignerTileDisplay
        addressKind={{ type: "contact", pkh, label }}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        isLoading={false}
      />
    );
    expect(screen.getByTestId("contact-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        addressKind={{ type: AccountType.LEDGER, pkh, label }}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        isLoading={false}
      />
    );
    expect(screen.getByTestId("ledger-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        addressKind={{ type: "mnemonic", pkh, label }}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        isLoading={false}
      />
    );
    expect(screen.getByTestId("identicon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();

    cleanup();
    render(
      <MultisigSignerTileDisplay
        addressKind={{ type: "social", pkh, label }}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        isLoading={false}
      />
    );
    expect(screen.getByTestId("social-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("renders the right icon and no label for unknown addresses", () => {
    render(
      <MultisigSignerTileDisplay
        addressKind={{ type: "unknown", pkh, label: null }}
        signerState="approvable"
        onClickApproveExecute={() => {}}
        isLoading={false}
      />
    );
    expect(screen.getByTestId("unknown-contact-icon")).toBeInTheDocument();
    expect(screen.getByText(shrinkedAddress)).toBeInTheDocument();
    expect(screen.queryByText(label)).not.toBeInTheDocument();
  });
});
