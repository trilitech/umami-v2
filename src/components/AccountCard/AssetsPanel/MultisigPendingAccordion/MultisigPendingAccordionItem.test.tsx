import { Accordion } from "@chakra-ui/react";
import { Estimate, TezosToolkit, TransactionOperation } from "@taquito/taquito";
import {
  mockContractAddress,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMultisigAccount,
} from "../../../../mocks/factories";
import { fakeTezosUtils } from "../../../../mocks/fakeTezosUtils";
import { fillPassword } from "../../../../mocks/helpers";
import { pendingOps } from "../../../../mocks/multisig";
import { fireEvent, render, screen, waitFor, within } from "../../../../mocks/testUtils";
import { ImplicitAccount } from "../../../../types/Account";
import { parseImplicitPkh } from "../../../../types/Address";
import { useGetSecretKey } from "../../../../utils/hooks/accountUtils";
import { MultisigOperation } from "../../../../utils/multisig/types";
import accountsSlice from "../../../../utils/redux/slices/accountsSlice";
import store from "../../../../utils/redux/store";
import MultisigPendingAccordionItem from "./MultisigPendingAccordionItem";

jest.mock("../../../../utils/hooks/accountUtils");

const MOCK_TEZOS_TOOLKIT = {};
beforeEach(() => {
  (useGetSecretKey as jest.Mock).mockReturnValue(() => Promise.resolve("mockkey"));
  fakeTezosUtils.makeToolkit.mockResolvedValue(MOCK_TEZOS_TOOLKIT as TezosToolkit);
});

describe("<MultisigPendingCard/>", () => {
  it("displays the correct number of pending approvals", () => {
    const pkh0 = mockImplicitAddress(0);
    const account = { ...mockMultisigAccount(0), threshold: 3 };
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          sender={account}
          operation={{
            id: "1",
            bigmapId: 0,
            rawActions: "action",
            approvals: [pkh0],
          }}
        />
      </Accordion>
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("2");
  });

  it("displays 0 for pending approvals if there are more approvers than the threshold", () => {
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          sender={mockMultisigAccount(0)}
          operation={{
            id: "1",
            bigmapId: 0,
            rawActions: "action",
            approvals: [mockImplicitAddress(0), mockImplicitAddress(1)],
          }}
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

    store.dispatch(accountsSlice.actions.addAccount([account]));

    const executablePendingOp: MultisigOperation = pendingOps[0];
    const multisig = { ...mockMultisigAccount(0), signers: [account.address] };

    render(
      <Accordion>
        <MultisigPendingAccordionItem sender={multisig} operation={executablePendingOp} />
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
      account,
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
      MOCK_TEZOS_TOOLKIT
    );
  });

  test("User can accomplish a proposal approval", async () => {
    const signer: ImplicitAccount = {
      ...mockImplicitAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };
    fakeTezosUtils.estimateMultisigApproveOrExecute.mockResolvedValue({
      suggestedFeeMutez: 33,
    } as Estimate);

    fakeTezosUtils.approveOrExecuteMultisigOperation.mockResolvedValue({
      hash: "mockHash",
    } as TransactionOperation);

    store.dispatch(accountsSlice.actions.addAccount([signer]));
    const account = { ...mockMultisigAccount(0), signers: [signer.address] };
    const approvablePendingOp: MultisigOperation = { ...pendingOps[0], approvals: [] };
    render(
      <Accordion>
        <MultisigPendingAccordionItem sender={account} operation={approvablePendingOp} />
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
      signer,
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
      MOCK_TEZOS_TOOLKIT
    );
  });
});
