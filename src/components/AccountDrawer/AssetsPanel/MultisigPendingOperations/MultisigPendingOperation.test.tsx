import { TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import BigNumber from "bignumber.js";

import { MultisigPendingOperation } from "./MultisigPendingOperation";
import {
  mockImplicitAddress,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "../../../../mocks/factories";
import { addAccount } from "../../../../mocks/helpers";
import { pendingOps } from "../../../../mocks/multisig";
import { act, render, screen, userEvent, within } from "../../../../mocks/testUtils";
import { ImplicitAccount, MnemonicAccount } from "../../../../types/Account";
import { makeAccountOperations } from "../../../../types/AccountOperations";
import { parseImplicitPkh } from "../../../../types/Address";
import { MAINNET } from "../../../../types/Network";
import { makeMultisigApproveOrExecuteOperation } from "../../../../types/Operation";
import * as getAccountDataHooks from "../../../../utils/hooks/getAccountDataHooks";
import { MultisigOperation } from "../../../../utils/multisig/types";
import { estimate, executeOperations, makeToolkit } from "../../../../utils/tezos";

jest.mock("../../../../utils/tezos", () => ({
  ...jest.requireActual("../../../../utils/tezos"),
  estimate: jest.fn(),
  executeOperations: jest.fn(),
  makeToolkit: jest.fn(),
}));

const MOCK_TEZOS_TOOLKIT = {};
beforeEach(() => {
  jest
    .spyOn(getAccountDataHooks, "useGetSecretKey")
    .mockReturnValue(() => Promise.resolve("mockkey"));
  jest.mocked(makeToolkit).mockResolvedValue(MOCK_TEZOS_TOOLKIT as TezosToolkit);
});

describe("<MultisigPendingOperation />", () => {
  it("displays the correct number of pending approvals", () => {
    const pkh0 = mockImplicitAddress(0);
    const account = { ...mockMultisigAccount(0), threshold: 3 };
    render(
      <MultisigPendingOperation
        operation={{
          id: "1",
          bigmapId: 0,
          rawActions: "action",
          approvals: [pkh0],
        }}
        sender={account}
      />
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("2");
  });

  it("displays 0 for pending approvals if there are more approvers than the threshold", () => {
    render(
      <MultisigPendingOperation
        operation={{
          id: "1",
          bigmapId: 0,
          rawActions: "action",
          approvals: [mockImplicitAddress(0), mockImplicitAddress(1)],
        }}
        sender={mockMultisigAccount(0)}
      />
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("0");
  });

  test("User can accomplish a proposal execution", async () => {
    const user = userEvent.setup();
    const account: MnemonicAccount = {
      ...mockMnemonicAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };
    jest.mocked(estimate).mockResolvedValueOnce(BigNumber(33));

    jest.mocked(executeOperations).mockResolvedValue({
      opHash: "mockHash",
    } as BatchWalletOperation);

    addAccount(account);

    const executablePendingOp: MultisigOperation = pendingOps[0];
    const multisig = { ...mockMultisigAccount(0), signers: [account.address] };

    render(<MultisigPendingOperation operation={executablePendingOp} sender={multisig} />);

    const firstPendingOp = screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id);

    await act(() => user.click(within(firstPendingOp).getByText("Execute")));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const operation = makeAccountOperations(account, account, [
      makeMultisigApproveOrExecuteOperation(multisig.address, "execute", pendingOps[0].id),
    ]);

    expect(jest.mocked(estimate)).toHaveBeenCalledWith(operation, MAINNET);

    await act(() => user.type(screen.getByTestId("password"), "mockPass"));

    const submitButton = screen.getByRole("button", { name: "Execute transaction" });
    expect(submitButton).toBeEnabled();

    await act(() => user.click(submitButton));

    await screen.findByText("Operation Submitted");

    expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(operation, MOCK_TEZOS_TOOLKIT);
  });

  test("User can accomplish a proposal approval", async () => {
    const user = userEvent.setup();
    const signer: ImplicitAccount = {
      ...mockMnemonicAccount(0),
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    };

    jest.mocked(estimate).mockResolvedValueOnce(BigNumber(33));

    jest.mocked(executeOperations).mockResolvedValue({
      opHash: "mockHash",
    } as BatchWalletOperation);

    addAccount(signer);
    const multisig = { ...mockMultisigAccount(0), signers: [signer.address] };
    const approvablePendingOp: MultisigOperation = { ...pendingOps[0], approvals: [] };
    render(<MultisigPendingOperation operation={approvablePendingOp} sender={multisig} />);

    const firstPendingOp = screen.getByTestId("multisig-pending-operation-" + pendingOps[0].id);
    await act(() => user.click(within(firstPendingOp).getByText("Approve")));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const operations = makeAccountOperations(signer, signer, [
      makeMultisigApproveOrExecuteOperation(multisig.address, "approve", pendingOps[0].id),
    ]);

    expect(jest.mocked(estimate)).toHaveBeenCalledWith(operations, MAINNET);

    await act(() => user.type(screen.getByTestId("password"), "mockPass"));

    const submitButton = screen.getByRole("button", { name: "Approve transaction" });
    expect(submitButton).toBeEnabled();

    await act(() => user.click(submitButton));

    await screen.findByText("Operation Submitted");

    expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(operations, MOCK_TEZOS_TOOLKIT);
  });
});
