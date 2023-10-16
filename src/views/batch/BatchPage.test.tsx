import { makeAccountOperations } from "../../types/AccountOperations";
import { mockImplicitAccount, mockTezOperation } from "../../mocks/factories";
import { dispatchMockAccounts, mockEstimatedFee } from "../../mocks/helpers";
import { act, fireEvent, render, screen, waitFor } from "../../mocks/testUtils";
import { useGetSecretKey } from "../../utils/hooks/accountUtils";
import store from "../../utils/redux/store";
import { estimate, executeOperations } from "../../utils/tezos";
import BatchPage from "./BatchPage";
import { batchesActions } from "../../utils/redux/slices/batches";
import { MAINNET } from "../../types/Network";
import { Modal } from "@chakra-ui/react";
jest.mock("../../utils/hooks/accountUtils");
jest.mock("../../utils/tezos");

const useGetSecretKeyMock = jest.mocked(useGetSecretKey);

beforeEach(() => {
  dispatchMockAccounts([
    mockImplicitAccount(1),
    mockImplicitAccount(2),
    mockImplicitAccount(3),
  ] as any);
  mockEstimatedFee(10);

  useGetSecretKeyMock.mockReturnValue(async (_a, _b) => "mockSk");
  jest.mocked(executeOperations).mockResolvedValue({ opHash: "foo" });
});

describe("<BatchPage />", () => {
  it("shows empty batch message by default", () => {
    render(<BatchPage />);

    expect(screen.getByText(/your batch is currently empty/i)).toBeInTheDocument();
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
      fireEvent.click(screen.getByRole("button", { name: "Clear" }));
      expect(screen.queryByTestId(/batch-table/i)).not.toBeInTheDocument();
    });

    test("submit batch", async () => {
      mockEstimatedFee(10);
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <BatchPage />
        </Modal>
      );
      const submitBatchButton = screen.getByRole("button", { name: /confirm batch/i });
      fireEvent.click(submitBatchButton);

      expect(jest.mocked(estimate)).toHaveBeenCalledWith(operations, MAINNET);
      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });
  });
});
