import { mockImplicitAccount } from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";

import { store } from "../../../../utils/store/store";
import MultisigActionButton from "./MultisigSignerTile";
import accountsSlice from "../../../../utils/store/accountsSlice";

const { add } = accountsSlice.actions;

describe("<ActionButton/>", () => {
  it("should display execute for non-pending operation with signer included in the owned account", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(<MultisigActionButton signer={account.address} approvers={[]} pendingApprovals={0} />);
    expect(screen.getByTestId("multisig-signer-button")).toHaveTextContent("Execute");
  });

  it("should display approve for pending operation with signer included in the owned account", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(<MultisigActionButton signer={account.address} approvers={[]} pendingApprovals={1} />);
    expect(screen.getByTestId("multisig-signer-button")).toHaveTextContent("Approve");
  });

  it("should show approved for pending operation with signers included in the account that already approved", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(
      <MultisigActionButton
        signer={account.address}
        approvers={[account.address]}
        pendingApprovals={1}
      />
    );
    expect(screen.getByTestId("multisig-signer-approved")).toHaveTextContent("Approved");
  });

  it("should show approved for operation with signers not in the account", () => {
    const account = mockImplicitAccount(0);
    render(
      <MultisigActionButton
        signer={account.address}
        approvers={[account.address]}
        pendingApprovals={1}
      />
    );
    expect(screen.getByTestId("multisig-signer-approved-or-waiting")).toHaveTextContent("Approved");
  });

  it("should show Awaiting approval for operation with signers not owned by the user account that hasn't approved", () => {
    const account = mockImplicitAccount(0);
    render(<MultisigActionButton signer={account.address} approvers={[]} pendingApprovals={1} />);
    expect(screen.getByTestId("multisig-signer-approved-or-waiting")).toHaveTextContent(
      "Awaiting Approval"
    );
  });
});
