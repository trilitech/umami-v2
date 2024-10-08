import { type TezosToolkit } from "@taquito/taquito";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import {
  type ImplicitAccount,
  type MnemonicAccount,
  estimate,
  executeOperations,
  makeAccountOperations,
  makeMultisigApproveOrExecuteOperation,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import { type MultisigOperation, multisigPendingOpsFixtures } from "@umami/multisig";
import { type UmamiStore, addTestAccount, makeStore, useGetSecretKey } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { MAINNET, makeToolkit, mockImplicitAddress, parseImplicitPkh } from "@umami/tezos";

import { MultisigPendingOperation } from "./MultisigPendingOperation";
import { act, render, screen, userEvent, within } from "../../../../mocks/testUtils";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
  executeOperations: jest.fn(),
}));

jest.mock("@umami/tezos", () => ({
  ...jest.requireActual("@umami/tezos"),
  makeToolkit: jest.fn(),
}));

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useGetSecretKey: jest.fn(),
  getAccountDataHooks: () => Promise.resolve("mockkey"),
}));

const MOCK_TEZOS_TOOLKIT = {};
const password = "Qwerty123123!23vcxz";
let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  jest.mocked(useGetSecretKey).mockReturnValue(() => Promise.resolve("mockkey"));
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
      />,
      { store }
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
      />,
      { store }
    );

    expect(screen.getByTestId("pending-approvals-count")).toHaveTextContent("0");
  });

  it("User can accomplish a proposal execution", async () => {
    const user = userEvent.setup();
    const account: MnemonicAccount = mockMnemonicAccount(0, {
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    });

    const multisig = { ...mockMultisigAccount(0), signers: [account.address] };

    const operation = makeAccountOperations(account, account, [
      makeMultisigApproveOrExecuteOperation(
        multisig.address,
        "execute",
        multisigPendingOpsFixtures[0].id
      ),
    ]);

    jest.mocked(estimate).mockResolvedValueOnce({
      ...operation,
      estimates: [executeParams()],
    });

    jest.mocked(executeOperations).mockResolvedValue({
      opHash: "mockHash",
    } as BatchWalletOperation);

    addTestAccount(store, account);

    const executablePendingOp: MultisigOperation = multisigPendingOpsFixtures[0];

    render(<MultisigPendingOperation operation={executablePendingOp} sender={multisig} />, {
      store,
    });

    const firstPendingOp = screen.getByTestId(
      "multisig-pending-operation-" + multisigPendingOpsFixtures[0].id
    );

    await act(() => user.click(within(firstPendingOp).getByText("Execute")));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(jest.mocked(estimate)).toHaveBeenCalledWith(operation, MAINNET);

    await act(() => user.type(screen.getByTestId("password"), password));

    const submitButton = screen.getByRole("button", {
      name: "Execute transaction",
    });
    expect(submitButton).toBeEnabled();

    await act(() => user.click(submitButton));

    await screen.findByText("Operation Submitted");

    expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(
      {
        ...operation,
        estimates: [executeParams()],
      },
      MOCK_TEZOS_TOOLKIT
    );
  });

  test("User can accomplish a proposal approval", async () => {
    const user = userEvent.setup();
    const signer: ImplicitAccount = mockMnemonicAccount(0, {
      address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
    });

    const multisig = { ...mockMultisigAccount(0), signers: [signer.address] };

    const operations = makeAccountOperations(signer, signer, [
      makeMultisigApproveOrExecuteOperation(
        multisig.address,
        "approve",
        multisigPendingOpsFixtures[0].id
      ),
    ]);

    jest.mocked(estimate).mockResolvedValueOnce({
      ...operations,
      estimates: [executeParams()],
    });

    jest.mocked(executeOperations).mockResolvedValue({
      opHash: "mockHash",
    } as BatchWalletOperation);

    addTestAccount(store, signer);
    const approvablePendingOp: MultisigOperation = {
      ...multisigPendingOpsFixtures[0],
      approvals: [],
    };
    render(<MultisigPendingOperation operation={approvablePendingOp} sender={multisig} />, {
      store,
    });

    const firstPendingOp = screen.getByTestId(
      "multisig-pending-operation-" + multisigPendingOpsFixtures[0].id
    );
    await act(() => user.click(within(firstPendingOp).getByText("Approve")));

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(jest.mocked(estimate)).toHaveBeenCalledWith(operations, MAINNET);

    await act(() => user.type(screen.getByTestId("password"), password));

    const submitButton = screen.getByRole("button", {
      name: "Approve transaction",
    });
    expect(submitButton).toBeEnabled();

    await act(() => user.click(submitButton));

    await screen.findByText("Operation Submitted");

    expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(
      {
        ...operations,
        estimates: [executeParams()],
      },
      MOCK_TEZOS_TOOLKIT
    );
  });
});
