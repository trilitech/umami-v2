import { mockImplicitAccount, mockMultisigAccount } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import MultisigSignerTile from "./MultisigSignerTile";

import store from "../../../../utils/redux/store";
import accountsSlice from "../../../../utils/redux/slices/accountsSlice";
import { pendingOps } from "../../../../mocks/multisig";

const { add } = accountsSlice.actions;

const signer = mockImplicitAccount(0);
describe("<MultisigSignerTile/>", () => {
  beforeEach(() => {
    store.dispatch(add([signer]));
  });

  it("should display a button for non-pending operation with signer included in the account", () => {
    render(
      <MultisigSignerTile
        signerAddress={signer.address}
        pendingApprovals={0}
        operation={pendingOps[0]}
        sender={mockMultisigAccount(0)}
        openSignModal={_ => {}}
      />
    );
    expect(screen.getByTestId("multisig-signer-button")).toBeInTheDocument();
  });

  it("should hide button for pending operation with signers included in the account that already approved", () => {
    render(
      <MultisigSignerTile
        signerAddress={signer.address}
        pendingApprovals={1}
        operation={{ ...pendingOps[0], approvals: [signer.address] }}
        sender={mockMultisigAccount(0)}
        openSignModal={_ => {}}
      />
    );
    expect(screen.queryByTestId("multisig-signer-button")).not.toBeInTheDocument();
  });

  it("should hide button for operation with signers not in the account", () => {
    const account = { ...mockMultisigAccount(0), signers: [mockImplicitAccount(1).address] };
    render(
      <MultisigSignerTile
        signerAddress={mockImplicitAccount(1).address}
        pendingApprovals={1}
        operation={pendingOps[0]}
        sender={account}
        openSignModal={_ => {}}
      />
    );
    expect(screen.queryByTestId("multisig-signer-button")).not.toBeInTheDocument();
  });
});
