import { type MnemonicAccount } from "@umami/core";
import {
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
  mockMultisigAccount,
  pendingOps,
} from "@umami/test-utils";

import { executeParams } from "../../../../mocks/executeParams";
import { addAccount } from "../../../../mocks/helpers";
import { fireEvent, render, screen, within } from "../../../../mocks/testUtils";
import { multisigsSlice } from "../../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../../utils/redux/store";
import { estimate } from "../../../../utils/tezos";

import { MultisigPendingOperations } from ".";

jest.mock("../../../../utils/tezos/estimate");

describe("<MultisigPendingOperations />", () => {
  it("displays multisig executable tez operations", async () => {
    jest.mocked(estimate).mockResolvedValueOnce({
      type: "implicit",
      operations: [],
      sender: mockImplicitAccount(0),
      signer: mockImplicitAccount(0),
      estimates: [executeParams()],
    });
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
