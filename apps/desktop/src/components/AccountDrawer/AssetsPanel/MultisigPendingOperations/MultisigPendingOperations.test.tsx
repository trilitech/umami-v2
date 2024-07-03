import {
  type MnemonicAccount,
  estimate,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import { multisigPendingOpsFixtures } from "@umami/multisig";
import { addTestAccount, makeStore, multisigsActions } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { mockImplicitAddress } from "@umami/tezos";

import { fireEvent, render, screen, within } from "../../../../mocks/testUtils";

import { MultisigPendingOperations } from ".";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
}));

describe("<MultisigPendingOperations />", () => {
  it("displays multisig executable tez operations", async () => {
    const store = makeStore();
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
    store.dispatch(multisigsActions.setMultisigs([multisig]));
    store.dispatch(multisigsActions.setPendingOperations(multisigPendingOpsFixtures));

    const mockAccount: MnemonicAccount = {
      ...mockMnemonicAccount(0),
      address: mockImplicitAddress(0),
    };

    addTestAccount(store, mockAccount);

    render(<MultisigPendingOperations account={multisig} />, { store });

    const allPending = screen.getAllByTestId(/multisig-pending-operation/);
    expect(allPending).toHaveLength(2);
    const { getByText } = within(
      screen.getByTestId("multisig-pending-operation-" + multisigPendingOpsFixtures[0].id)
    );
    const executeBtn = getByText(/execute/i);

    fireEvent.click(executeBtn);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Execute transaction" })).toBeInTheDocument();
  });
});
