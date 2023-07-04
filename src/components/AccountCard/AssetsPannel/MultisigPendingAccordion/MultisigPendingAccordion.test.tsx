import { Estimate, TransactionOperation } from "@taquito/taquito";
import MultisigPendingAccordion from ".";
import { mockImplicitAccount, mockMultisigAccount } from "../../../../mocks/factories";
import { fakeTezosUtils } from "../../../../mocks/fakeTezosUtils";
import { fillPassword } from "../../../../mocks/helpers";
import { fireEvent, render, screen, waitFor, within } from "../../../../mocks/testUtils";
import { ImplicitAccount } from "../../../../types/Account";
import { useGetSk } from "../../../../utils/hooks/accountUtils";
import { multisigWithPendingOpsToAccount } from "../../../../utils/multisig/helpers";
import { MultisigWithPendingOperations } from "../../../../utils/multisig/types";
import accountsSlice from "../../../../utils/store/accountsSlice";
import multisigsSlice from "../../../../utils/store/multisigsSlice";
import { store } from "../../../../utils/store/store";

jest.mock("../../../../utils/hooks/accountUtils");

const multisigAccount = mockMultisigAccount(0);

beforeEach(() => {
  (useGetSk as jest.Mock).mockReturnValue(() => Promise.resolve("mockkey"));
});

describe("<MultisigPendingAccordion />", () => {
  it("should display no pending operations if there are none", () => {
    render(<MultisigPendingAccordion account={multisigAccount} />);
    expect(screen.getByText(/No multisig pending operations/i)).toBeInTheDocument();
  });

  it("should display multisig executable tez operations", async () => {
    const m: MultisigWithPendingOperations = {
      address: { type: "contract", pkh: "KT1Jr2UdC6boStHUrVyFYoxArKfNr1CDiYxK" },
      threshold: 1,
      signers: [{ type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" }],
      pendingOperations: [
        {
          key: "1",
          rawActions:
            '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"00e09454275ac1a764ca6f8b1f52a2eeff1fd4fe0e"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"1000000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
          approvals: [{ type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" }],
        },
        {
          key: "2",
          rawActions:
            '[{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PUSH","args":[{"prim":"key_hash"},{"bytes":"0057c264d6d7f7257cd3d8096150b0d8be60577ca7"}]},{"prim":"IMPLICIT_ACCOUNT"},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"3000000"}]},{"prim":"UNIT"},{"prim":"TRANSFER_TOKENS"},{"prim":"CONS"}]',
          approvals: [{ type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" }],
        },
      ],
    };
    const multisigAccount = multisigWithPendingOpsToAccount(m, "multi");
    store.dispatch(multisigsSlice.actions.set([m]));
    const mockAccount: ImplicitAccount = {
      ...mockImplicitAccount(0),
      address: { type: "implicit", pkh: "tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3" },
    };
    store.dispatch(accountsSlice.actions.add([mockAccount]));

    fakeTezosUtils.estimateMultisigApproveOrExecute.mockResolvedValueOnce({
      suggestedFeeMutez: 12345,
    } as Estimate);

    fakeTezosUtils.approveOrExecuteMultisigOperation.mockResolvedValueOnce({
      hash: "foo",
    } as TransactionOperation);

    render(<MultisigPendingAccordion account={multisigAccount} />);

    const allPending = screen.getAllByTestId(/multisig-pending-operation/);
    expect(allPending).toHaveLength(2);
    const { getByText } = within(
      screen.getByTestId("multisig-pending-operation-" + m.pendingOperations[0].key)
    );
    const executeBtn = getByText(/execute/i);

    fireEvent.click(executeBtn);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    {
      const { getByText } = within(dialog);
      expect(getByText(/execute/i)).toBeInTheDocument();
      expect(getByText(/proposal signer/i)).toBeInTheDocument();
    }

    const previewButton = screen.getByText(/preview/i);
    fireEvent.click(previewButton);
    await screen.findByTestId(/submit-step/i);

    expect(fakeTezosUtils.estimateMultisigApproveOrExecute).toHaveBeenCalledWith(
      {
        contract: multisigAccount.address,
        operationId: m.pendingOperations[0].key,
        type: "execute",
      },
      mockAccount.pk,
      mockAccount.address.pkh,
      "mainnet"
    );

    fillPassword("mockPass");
    const submitBtn = screen.getByText(/submit transaction/i);
    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });
    fireEvent.click(submitBtn);
    await screen.findByText(/Operation Submitted/i);
  });
});
