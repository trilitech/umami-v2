import { mockImplicitAccount } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import MultisigSignerTile from "./MultisigSignerTile";

import { store } from "../../../../utils/store/store";
import accountsSlice from "../../../../utils/store/accountsSlice";

const { add } = accountsSlice.actions;

describe("<MultisigSignerTile/>", () => {
  it("should display a button for non-pending operation with signer included in the account", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(
      <MultisigSignerTile
        signer={account.address}
        approvers={[]}
        pendingApprovals={0}
        onClickApproveOrExecute={() => {}}
      />
    );
    expect(screen.getByTestId("multisig-signer-button")).toBeInTheDocument();
  });

  it("should hide button for pending operation with signers included in the account that already approved", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(
      <MultisigSignerTile
        signer={account.address}
        approvers={[account.address]}
        pendingApprovals={1}
        onClickApproveOrExecute={() => {}}
      />
    );
    expect(screen.queryByTestId("multisig-signer-button")).not.toBeInTheDocument();
  });

  it("should hide button for operation with signers not in the account", () => {
    const account = mockImplicitAccount(0);
    render(
      <MultisigSignerTile
        signer={account.address}
        approvers={[account.address]}
        pendingApprovals={1}
        onClickApproveOrExecute={() => {}}
      />
    );
    expect(screen.queryByTestId("multisig-signer-button")).not.toBeInTheDocument();
  });
});
