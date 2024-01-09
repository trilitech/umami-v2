import { Accordion } from "@chakra-ui/react";
import { TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import BigNumber from "bignumber.js";

import { MultisigPendingAccordionItem } from "./MultisigPendingAccordionItem";
import {
  mockImplicitAddress,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "../../../../mocks/factories";
import { fillPassword } from "../../../../mocks/helpers";
import { pendingOps } from "../../../../mocks/multisig";
import { fireEvent, render, screen, waitFor, within } from "../../../../mocks/testUtils";
import { ImplicitAccount, MnemonicAccount } from "../../../../types/Account";
import { makeAccountOperations } from "../../../../types/AccountOperations";
import { parseImplicitPkh } from "../../../../types/Address";
import { MAINNET } from "../../../../types/Network";
import { makeMultisigApproveOrExecuteOperation } from "../../../../types/Operation";
import { useGetSecretKey } from "../../../../utils/hooks/accountUtils";
import { MultisigOperation } from "../../../../utils/multisig/types";
import { accountsSlice } from "../../../../utils/redux/slices/accountsSlice";
import { store } from "../../../../utils/redux/store";
import { estimate, executeOperations, makeToolkit } from "../../../../utils/tezos";

jest.mock("../../../../utils/hooks/accountUtils");

const MOCK_TEZOS_TOOLKIT = {};
beforeEach(() => {
  jest.mocked(useGetSecretKey).mockReturnValue(() => Promise.resolve("mockkey"));
  jest.mocked(makeToolkit).mockResolvedValue(MOCK_TEZOS_TOOLKIT as TezosToolkit);
});

describe("<MultisigPendingAccordionItem/>", () => {
  it("displays the correct number of pending approvals", () => {
    const pkh0 = mockImplicitAddress(0);
    const account = { ...mockMultisigAccount(0), threshold: 3 };
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          operation={{
            id: "1",
            bigmapId: 0,
            rawActions: "action",
            approvals: [pkh0],
          }}
          sender={account}
        />
      </Accordion>
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("2");
  });

  it("displays 0 for pending approvals if there are more approvers than the threshold", () => {
    render(
      <Accordion>
        <MultisigPendingAccordionItem
          operation={{
            id: "1",
            bigmapId: 0,
            rawActions: "action",
            approvals: [mockImplicitAddress(0), mockImplicitAddress(1)],
          }}
          sender={mockMultisigAccount(0)}
        />
      </Accordion>
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("0");
  });

  test("User can accomplish a proposal execution", async () => {
    const account: MnemonicAccount = {
      ...mockMnemonicAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };
    jest.mocked(estimate).mockResolvedValue(new BigNumber(33));

    jest.mocked(executeOperations).mockResolvedValue({
      opHash: "mockHash",
    } as BatchWalletOperation);

    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([account]));

    const executablePendingOp: MultisigOperation = pendingOps[0];
    const multisig = { ...mockMultisigAccount(0), signers: [account.address] };

    render(
      <Accordion>
        <MultisigPendingAccordionItem operation={executablePendingOp} sender={multisig} />
      </Accordion>
    );
    const firstPendingOp = screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id);
    const { getByText } = within(firstPendingOp);
    const executeBtn = getByText(/execute/i);
    fireEvent.click(executeBtn);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const operation = makeAccountOperations(account, account, [
      makeMultisigApproveOrExecuteOperation(multisig.address, "execute", pendingOps[0].id),
    ]);

    expect(jest.mocked(estimate)).toHaveBeenCalledWith(operation, MAINNET);

    fillPassword("mockPass");

    const submitButton = screen.getByRole("button", { name: /execute transaction/i });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    await screen.findByText(/operation submitted/i);

    expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(operation, MOCK_TEZOS_TOOLKIT);
  });

  test("User can accomplish a proposal approval", async () => {
    const signer: ImplicitAccount = {
      ...mockMnemonicAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };

    jest.mocked(estimate).mockResolvedValue(new BigNumber(33));

    jest.mocked(executeOperations).mockResolvedValue({
      opHash: "mockHash",
    } as BatchWalletOperation);

    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([signer]));
    const multisig = { ...mockMultisigAccount(0), signers: [signer.address] };
    const approvablePendingOp: MultisigOperation = { ...pendingOps[0], approvals: [] };
    render(
      <Accordion>
        <MultisigPendingAccordionItem operation={approvablePendingOp} sender={multisig} />
      </Accordion>
    );
    const firstPendingOp = screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id);
    const { getByText } = within(firstPendingOp);
    const approveBtn = getByText(/approve/i);
    fireEvent.click(approveBtn);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    const operations = makeAccountOperations(signer, signer, [
      makeMultisigApproveOrExecuteOperation(multisig.address, "approve", pendingOps[0].id),
    ]);

    expect(jest.mocked(estimate)).toHaveBeenCalledWith(operations, MAINNET);

    fillPassword("mockPass");

    const submitButton = screen.getByRole("button", { name: /approve transaction/i });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    await screen.findByText(/operation submitted/i);

    expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(operations, MOCK_TEZOS_TOOLKIT);
  });
});
