import { Modal } from "@chakra-ui/react";
import type { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";

import { BatchPage } from "./BatchPage";
import { mockImplicitAccount, mockMnemonicAccount, mockTezOperation } from "../../mocks/factories";
import { dispatchMockAccounts, mockEstimatedFee } from "../../mocks/helpers";
import { act, fireEvent, render, screen, userEvent } from "../../mocks/testUtils";
import { makeAccountOperations } from "../../types/AccountOperations";
import { MAINNET } from "../../types/Network";
import { batchesActions } from "../../utils/redux/slices/batches";
import { store } from "../../utils/redux/store";
import { estimate, executeOperations } from "../../utils/tezos";

beforeEach(() => {
  dispatchMockAccounts([mockMnemonicAccount(1), mockMnemonicAccount(2), mockMnemonicAccount(3)]);
  mockEstimatedFee(10);

  jest.mocked(executeOperations).mockResolvedValue({ opHash: "foo" } as BatchWalletOperation);
});

describe("<BatchPage />", () => {
  it("shows empty batch message by default", () => {
    render(<BatchPage />);

    expect(screen.getByTestId("empty-state-message")).toBeInTheDocument();
    expect(screen.getByText("No batches to show")).toBeVisible();
    expect(screen.getByText("There is no batch transactions to show...")).toBeVisible();
  });

  it("hides empty batch message when batches are present", () => {
    store.dispatch(
      batchesActions.add({
        network: MAINNET,
        operations: makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
          mockTezOperation(0),
        ]),
      })
    );

    render(<BatchPage />);

    expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
  });

  describe("pending", () => {
    it("shows 0 when no batches exist", () => {
      render(<BatchPage />);

      expect(screen.getByText(/0 pending/i)).toBeInTheDocument();
    });

    it("shows the number of different pending batches", () => {
      store.dispatch(
        batchesActions.add({
          network: MAINNET,
          operations: makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
            mockTezOperation(0),
            mockTezOperation(0),
          ]),
        })
      );
      render(<BatchPage />);

      expect(screen.getByText(/1 pending/i)).toBeInTheDocument();
      act(() => {
        store.dispatch(
          batchesActions.add({
            network: MAINNET,
            operations: makeAccountOperations(mockImplicitAccount(2), mockImplicitAccount(2), [
              mockTezOperation(0),
              mockTezOperation(0),
            ]),
          })
        );
      });
      expect(screen.getByText(/2 pending/i)).toBeInTheDocument();
    });
  });

  it("renders all the batches", () => {
    store.dispatch(
      batchesActions.add({
        network: MAINNET,
        operations: makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          mockTezOperation(0),
          mockTezOperation(0),
        ]),
      })
    );
    store.dispatch(
      batchesActions.add({
        network: MAINNET,
        operations: makeAccountOperations(mockImplicitAccount(2), mockImplicitAccount(2), [
          mockTezOperation(0),
          mockTezOperation(0),
        ]),
      })
    );

    render(<BatchPage />);

    expect(screen.getAllByTestId(/batch-table/i)).toHaveLength(2);
  });

  describe("action buttons", () => {
    const operations = makeAccountOperations(mockImplicitAccount(2), mockImplicitAccount(2), [
      mockTezOperation(0),
      mockTezOperation(0),
    ]);

    beforeEach(() => {
      store.dispatch(
        batchesActions.add({
          network: MAINNET,
          operations,
        })
      );
    });

    test("delete batch", () => {
      render(<BatchPage />);

      const deleteButton = screen.getByTestId("remove-batch");
      fireEvent.click(deleteButton);
      expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Delete Batch" }));
      expect(screen.queryByTestId(/batch-table/i)).not.toBeInTheDocument();
    });

    test("submit batch", async () => {
      const user = userEvent.setup();
      mockEstimatedFee(10);
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <BatchPage />
        </Modal>
      );

      await act(() => user.click(screen.getByRole("button", { name: "Submit Batch" })));

      expect(jest.mocked(estimate)).toHaveBeenCalledWith(operations, MAINNET);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });
  });
});
