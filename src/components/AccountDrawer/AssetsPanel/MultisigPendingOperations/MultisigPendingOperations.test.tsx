import {
  mockImplicitAddress,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "../../../../mocks/factories";
import { addAccount, mockEstimatedFee } from "../../../../mocks/helpers";
import { pendingOps } from "../../../../mocks/multisig";
import { fireEvent, render, screen, within } from "../../../../mocks/testUtils";
import { MnemonicAccount } from "../../../../types/Account";
import { multisigsSlice } from "../../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../../utils/redux/store";

import { MultisigPendingOperations } from ".";

describe("<MultisigPendingOperations />", () => {
  it("displays multisig executable tez operations", async () => {
    mockEstimatedFee(33);
    const multisig = {
      ...mockMultisigAccount(0),
      pendingOperationsBigmapId: 3,
    };
    store.dispatch(multisigsSlice.actions.setMultisigs([multisig]));
    store.dispatch(multisigsSlice.actions.setPendingOperations(pendingOps));

    const mockAccount: MnemonicAccount = {
      ...mockMnemonicAccount(0),
      address: mockImplicitAddress(0),
    };

    addAccount(mockAccount);

    render(<MultisigPendingOperations account={multisig} />);

    const allPending = screen.getAllByTestId(/multisig-pending-operation/);
    expect(allPending).toHaveLength(2);
    const { getByText } = within(
      screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id)
    );
    const executeBtn = getByText(/execute/i);

    fireEvent.click(executeBtn);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Execute transaction" })).toBeInTheDocument();
  });
});
