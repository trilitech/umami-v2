import { Modal } from "@chakra-ui/react";
import { Estimate, TransactionOperation } from "@taquito/taquito";
import { mockImplicitAccount } from "../../mocks/factories";
import { fakeTezosUtils } from "../../mocks/fakeTezosUtils";
import { fillPassword } from "../../mocks/helpers";
import { fireEvent, render, screen, waitFor } from "../../mocks/testUtils";
import { ImplicitAccount } from "../../types/Account";
import { parseContractPkh, parseImplicitPkh } from "../../types/Address";
import { useGetSk } from "../../utils/hooks/accountUtils";
import { multisigToAccount } from "../../utils/multisig/helpers";
import { Multisig } from "../../utils/multisig/types";
import accountsSlice from "../../utils/store/accountsSlice";
import multisigsSlice from "../../utils/store/multisigsSlice";
import { store } from "../../utils/store/store";
import { SendForm } from "./SendForm";
import { SendFormMode } from "./types";

jest.mock("../../utils/hooks/accountUtils");

const MOCK_ID = "mockid";
const MOCK_SK = "mocksk";

const m: Multisig = {
  address: parseContractPkh("KT1Jr2UdC6boStHUrVyFYoxArKfNr1CDiYxK"),
  threshold: 1,
  signers: [parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3")],
  pendingOperationsBigmapId: 3,
};

const mockAccount: ImplicitAccount = {
  ...mockImplicitAccount(0),
  address: parseImplicitPkh("tz1UNer1ijeE9ndjzSszRduR3CzX49hoBUB3"),
};

beforeEach(() => {
  (useGetSk as jest.Mock).mockReturnValue(() => Promise.resolve(MOCK_SK));

  store.dispatch(multisigsSlice.actions.setMultisigs([m]));
  store.dispatch(accountsSlice.actions.add([mockAccount]));

  fakeTezosUtils.estimateMultisigApproveOrExecute.mockResolvedValueOnce({
    suggestedFeeMutez: 12345,
  } as Estimate);

  fakeTezosUtils.approveOrExecuteMultisigOperation.mockResolvedValueOnce({
    hash: "foo",
  } as TransactionOperation);
});

afterEach(() => {
  store.dispatch(accountsSlice.actions.reset());
  store.dispatch(multisigsSlice.actions.reset());
});

const multisigAccount = multisigToAccount(m, "multi");

const fixture = (sender?: string, assetType?: SendFormMode) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SendForm sender={sender} mode={assetType} />
  </Modal>
);

describe("<SendForm /> case propose/execute", () => {
  it("Use can execute a proposal with tez transactions", async () => {
    render(
      fixture(undefined, {
        type: "execute",
        data: {
          operationId: MOCK_ID,
          batch: [
            {
              type: "tez",
              value: {
                recipient: mockImplicitAccount(3).address.pkh,
                sender: multisigAccount.address.pkh,
                amount: "200000",
              },
            },
            {
              type: "tez",
              value: {
                recipient: mockImplicitAccount(2).address.pkh,
                sender: multisigAccount.address.pkh,
                amount: "800000",
              },
            },
          ],
        },
      })
    );

    expect(screen.getByText(/execute/i)).toBeInTheDocument();
    expect(screen.getByText(/signer/i)).toBeInTheDocument();

    const previewButton = screen.getByText(/preview/i);
    fireEvent.click(previewButton);
    await screen.findByTestId(/submit-step/i);

    expect(fakeTezosUtils.estimateMultisigApproveOrExecute).toHaveBeenCalledWith(
      {
        contract: multisigAccount.address,
        operationId: MOCK_ID,
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

    expect(fakeTezosUtils.approveOrExecuteMultisigOperation).toHaveBeenCalledWith(
      {
        contract: multisigAccount.address,
        operationId: MOCK_ID,
        type: "execute",
      },
      { network: "mainnet", sk: MOCK_SK, type: "sk" }
    );
  });

  it("Use can approve a proposal with tez transactions", async () => {
    render(
      fixture(undefined, {
        type: "approve",
        data: {
          operationId: MOCK_ID,
          batch: [
            {
              type: "tez",
              value: {
                recipient: mockImplicitAccount(3).address.pkh,
                sender: multisigAccount.address.pkh,
                amount: "200000",
              },
            },
            {
              type: "tez",
              value: {
                recipient: mockImplicitAccount(2).address.pkh,
                sender: multisigAccount.address.pkh,
                amount: "800000",
              },
            },
          ],
        },
      })
    );

    expect(screen.getByText(/approve/i)).toBeInTheDocument();
    expect(screen.getByText(/signer/i)).toBeInTheDocument();

    const previewButton = screen.getByText(/preview/i);
    fireEvent.click(previewButton);
    await screen.findByTestId(/submit-step/i);

    expect(fakeTezosUtils.estimateMultisigApproveOrExecute).toHaveBeenCalledWith(
      {
        contract: multisigAccount.address,
        operationId: MOCK_ID,
        type: "approve",
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

    expect(fakeTezosUtils.approveOrExecuteMultisigOperation).toHaveBeenCalledWith(
      {
        contract: multisigAccount.address,
        operationId: MOCK_ID,
        type: "approve",
      },
      { network: "mainnet", sk: MOCK_SK, type: "sk" }
    );
  });
});
