import { mockImplicitAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import MultisigSignerTile, { ActionButton } from "./MultisigSignerTile";

import { store } from "../../../utils/store/store";
import accountsSlice from "../../../utils/store/accountsSlice";

const { add, reset } = accountsSlice.actions;
afterEach(() => store.dispatch(reset()));

describe("<MultisigSignerTile/>", () => {
  it("should display a button for non-pending operation with signer included in the account", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(<MultisigSignerTile signer={account.pkh} approvers={[]} pendingApprovals={0} />);
    expect(screen.getByTestId("multisig-signer-button")).toBeInTheDocument();
  });

  it("should hide button for pending operation with signers included in the account that already approved", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(
      <MultisigSignerTile signer={account.pkh} approvers={[account.pkh]} pendingApprovals={1} />
    );
    expect(screen.queryByTestId("multisig-signer-button")).not.toBeInTheDocument();
  });

  it("should hide button for operation with signers not in the account", () => {
    const account = mockImplicitAccount(0);
    render(
      <MultisigSignerTile signer={account.pkh} approvers={[account.pkh]} pendingApprovals={1} />
    );
    expect(screen.queryByTestId("multisig-signer-button")).not.toBeInTheDocument();
  });
});

describe("<ActionButton/>", () => {
  it("should display execute for non-pending operation with signer included in the owned account", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(<ActionButton signer={account.pkh} approvers={[]} pendingApprovals={0} />);
    expect(screen.getByTestId("multisig-signer-button")).toHaveTextContent("Execute");
  });

  it("should display approve for pending operation with signer included in the owned account", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(<ActionButton signer={account.pkh} approvers={[]} pendingApprovals={1} />);
    expect(screen.getByTestId("multisig-signer-button")).toHaveTextContent("Approve");
  });

  it("should show approved for pending operation with signers included in the account that already approved", () => {
    const account = mockImplicitAccount(0);
    store.dispatch(add([account]));
    render(<ActionButton signer={account.pkh} approvers={[account.pkh]} pendingApprovals={1} />);
    expect(screen.queryByTestId("multisig-signer-approved")).toHaveTextContent("Approved");
  });

  it("should show approved for operation with signers not in the account", () => {
    const account = mockImplicitAccount(0);
    render(
      <MultisigSignerTile signer={account.pkh} approvers={[account.pkh]} pendingApprovals={1} />
    );
    expect(screen.queryByTestId("multisig-signer-approved-or-waiting")).toHaveTextContent(
      "Approved"
    );
  });

  it("should show Awaiting approval for operation with signers not in the account that hasn't apporved", () => {
    const account = mockImplicitAccount(0);
    render(<MultisigSignerTile signer={account.pkh} approvers={[]} pendingApprovals={1} />);
    expect(screen.queryByTestId("multisig-signer-approved-or-waiting")).toHaveTextContent(
      "Awaiting Approval"
    );
  });
});
