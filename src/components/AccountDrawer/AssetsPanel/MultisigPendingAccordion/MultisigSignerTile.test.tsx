import {
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "../../../../mocks/factories";
import { render, screen } from "../../../../mocks/testUtils";
import MultisigSignerTile from "./MultisigSignerTile";

import store from "../../../../utils/redux/store";
import accountsSlice from "../../../../utils/redux/slices/accountsSlice";
import { pendingOps } from "../../../../mocks/multisig";

const { addMockMnemonicAccounts } = accountsSlice.actions;

const signer = mockMnemonicAccount(0);
describe("<MultisigSignerTile/>", () => {
  beforeEach(() => {
    store.dispatch(addMockMnemonicAccounts([signer]));
  });

  it("should display a button for non-pending operation with signer included in the account", () => {
    render(
      <MultisigSignerTile
        operation={pendingOps[0]}
        pendingApprovals={0}
        sender={mockMultisigAccount(0)}
        signerAddress={signer.address}
      />
    );
    expect(screen.getByTestId("multisig-signer-button")).toBeInTheDocument();
  });

  it("should hide button for pending operation with signers included in the account that already approved", () => {
    render(
      <MultisigSignerTile
        operation={{ ...pendingOps[0], approvals: [signer.address] }}
        pendingApprovals={1}
        sender={mockMultisigAccount(0)}
        signerAddress={signer.address}
      />
    );
    expect(screen.queryByTestId("multisig-signer-button")).not.toBeInTheDocument();
  });

  it("should hide button for operation with signers not in the account", () => {
    const account = { ...mockMultisigAccount(0), signers: [mockImplicitAccount(1).address] };
    render(
      <MultisigSignerTile
        operation={pendingOps[0]}
        pendingApprovals={1}
        sender={account}
        signerAddress={mockImplicitAccount(1).address}
      />
    );
    expect(screen.queryByTestId("multisig-signer-button")).not.toBeInTheDocument();
  });
});
