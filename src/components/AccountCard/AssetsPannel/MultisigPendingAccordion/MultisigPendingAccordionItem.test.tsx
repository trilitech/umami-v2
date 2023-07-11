import { Accordion } from "@chakra-ui/react";
import { Estimate, TransactionOperation } from "@taquito/taquito";
import {
  mockContractAddress,
  mockImplicitAccount,
  mockImplicitAddress,
} from "../../../../mocks/factories";
import { fakeTezosUtils } from "../../../../mocks/fakeTezosUtils";
import { fillPassword } from "../../../../mocks/helpers";
import { pendingOps } from "../../../../mocks/multisig";
import { act, fireEvent, render, screen, waitFor, within } from "../../../../mocks/testUtils";
import { ImplicitAccount } from "../../../../types/Account";
import { parseImplicitPkh } from "../../../../types/Address";
import { useGetSk } from "../../../../utils/hooks/accountUtils";
import { MultisigOperation } from "../../../../utils/multisig/types";
import accountsSlice from "../../../../utils/store/accountsSlice";
import { store } from "../../../../utils/store/store";
import MultisigPendingAccordionItem from "./MultisigPendingAccordionItem";

jest.mock("../../../../utils/hooks/accountUtils");

beforeEach(() => {
  (useGetSk as jest.Mock).mockReturnValue(() => Promise.resolve("mockkey"));
});

describe("<MultisigPendingCard/>", () => {
  it("displays the correct number of pending approvals", () => {
    const pkh0 = mockImplicitAddress(0);
    const pkh1 = mockImplicitAddress(1);
    const pkh2 = mockImplicitAddress(2);
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          multisigAddress={mockContractAddress(0)}
          operation={{
            id: "1",
            bigmapId: 0,
            rawActions: "action",
            approvals: [pkh0],
          }}
          threshold={3}
          signers={[pkh0, pkh1, pkh2]}
        />
      </Accordion>
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("2");
  });

  it("displays 0 for pending approvals if there are more approvers than the threshold", () => {
    const pkh0 = mockImplicitAddress(0);
    const pkh1 = mockImplicitAddress(1);
    const pkh2 = mockImplicitAddress(2);
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          multisigAddress={mockContractAddress(0)}
          operation={{
            id: "1",
            bigmapId: 0,
            rawActions: "action",
            approvals: [pkh0, pkh1, pkh2],
          }}
          threshold={2}
          signers={[pkh0, pkh1, pkh2]}
        />
      </Accordion>
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("0");
  });

  test("User can accomplish a proposal execution", async () => {
    const account: ImplicitAccount = {
      ...mockImplicitAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };
    fakeTezosUtils.estimateMultisigApproveOrExecute.mockResolvedValue({
      suggestedFeeMutez: 33,
    } as Estimate);

    fakeTezosUtils.approveOrExecuteMultisigOperation.mockResolvedValue({
      hash: "mockHash",
    } as TransactionOperation);

    act(() => {
      store.dispatch(accountsSlice.actions.add([account]));
    });

    const executablePendingOp: MultisigOperation = pendingOps[0];
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          multisigAddress={mockContractAddress(0)}
          operation={executablePendingOp}
          threshold={1}
          signers={[account.address]}
        />
      </Accordion>
    );
    const firstPendingOp = screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id);
    const { getByText } = within(firstPendingOp);
    const executeBtn = getByText(/execute/i);
    fireEvent.click(executeBtn);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    expect(fakeTezosUtils.estimateMultisigApproveOrExecute).toHaveBeenCalledWith(
      {
        contract: mockContractAddress(0),
        operationId: executablePendingOp.id,
        type: "execute",
      },
      account.pk,
      account.address.pkh,
      "mainnet"
    );

    fillPassword("mockPass");

    const submitButton = screen.getByText(/submit transaction/i);
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    await screen.findByText(/operation submitted/i);

    expect(fakeTezosUtils.approveOrExecuteMultisigOperation).toHaveBeenCalledWith(
      {
        contract: mockContractAddress(0),
        operationId: executablePendingOp.id,
        type: "execute",
      },
      { network: "mainnet", sk: "mockkey", type: "sk" }
    );
  });

  test("User can accomplish a proposal approval", async () => {
    const account: ImplicitAccount = {
      ...mockImplicitAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };
    fakeTezosUtils.estimateMultisigApproveOrExecute.mockResolvedValue({
      suggestedFeeMutez: 33,
    } as Estimate);

    fakeTezosUtils.approveOrExecuteMultisigOperation.mockResolvedValue({
      hash: "mockHash",
    } as TransactionOperation);

    act(() => {
      store.dispatch(accountsSlice.actions.add([account]));
    });

    const approvablePendingOp: MultisigOperation = { ...pendingOps[0], approvals: [] };
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          multisigAddress={mockContractAddress(0)}
          operation={approvablePendingOp}
          threshold={1}
          signers={[account.address]}
        />
      </Accordion>
    );
    const firstPendingOp = screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id);
    const { getByText } = within(firstPendingOp);
    const approveBtn = getByText(/approve/i);
    fireEvent.click(approveBtn);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    expect(fakeTezosUtils.estimateMultisigApproveOrExecute).toHaveBeenCalledWith(
      {
        contract: mockContractAddress(0),
        operationId: approvablePendingOp.id,
        type: "approve",
      },
      account.pk,
      account.address.pkh,
      "mainnet"
    );

    fillPassword("mockPass");

    const submitButton = screen.getByText(/submit transaction/i);
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    await screen.findByText(/operation submitted/i);

    expect(fakeTezosUtils.approveOrExecuteMultisigOperation).toHaveBeenCalledWith(
      {
        contract: mockContractAddress(0),
        operationId: approvablePendingOp.id,
        type: "approve",
      },
      { network: "mainnet", sk: "mockkey", type: "sk" }
    );
  });
});
