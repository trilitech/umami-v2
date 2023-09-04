import { TezosToolkit } from "@taquito/taquito";
import { makeAccountOperations } from "../../components/sendForm/types";
import { mockImplicitAccount, mockImplicitAddress } from "../../mocks/factories";
import { dispatchMockAccounts, mockEstimatedFee } from "../../mocks/helpers";
import { act, fireEvent, render, screen, waitFor, within } from "../../mocks/testUtils";
import { TezosNetwork } from "../../types/TezosNetwork";
import { useGetSecretKey } from "../../utils/hooks/accountUtils";
import store from "../../utils/redux/store";
import { estimateAndUpdateBatch } from "../../utils/redux/thunks/estimateAndUpdateBatch";
import { executeOperations, makeToolkit } from "../../utils/tezos";
import BatchPage from "./BatchPage";

// These tests might take long in the CI
jest.setTimeout(10000);

jest.mock("../../utils/hooks/accountUtils");
jest.mock("../../utils/tezos");

const useGetSecretKeyMock = jest.mocked(useGetSecretKey);

beforeEach(() => {
  dispatchMockAccounts([mockImplicitAccount(1), mockImplicitAccount(2), mockImplicitAccount(3)]);
  mockEstimatedFee(10);

  useGetSecretKeyMock.mockReturnValue(async (_a, _b) => "mockSk");
  jest.mocked(executeOperations).mockResolvedValue({ opHash: "foo" });
});

describe("<BatchPage />", () => {
  describe("Given no batch has beed added", () => {
    it("a message 'no batches are present' is displayed", () => {
      render(<BatchPage />);

      expect(screen.getByText(/0 pending/i)).toBeInTheDocument();
      expect(screen.getByText(/your batch is currently empty/i)).toBeInTheDocument();
    });
  });

  describe("Given batches have been added", () => {
    const MOCK_TEZOS_TOOLKIT = {};
    beforeEach(async () => {
      await store.dispatch(
        estimateAndUpdateBatch(
          makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
            {
              type: "tez",
              recipient: mockImplicitAddress(1),
              amount: "1000000",
            },
            {
              type: "tez",
              recipient: mockImplicitAddress(2),
              amount: "2000000",
            },
            {
              type: "tez",
              recipient: mockImplicitAddress(3),
              amount: "3000000",
            },
          ]),
          TezosNetwork.MAINNET
        )
      );

      store.dispatch(
        estimateAndUpdateBatch(
          makeAccountOperations(mockImplicitAccount(2), mockImplicitAccount(2), [
            {
              type: "tez",
              recipient: mockImplicitAddress(9),
              amount: "4",
            },
            {
              type: "tez",
              recipient: mockImplicitAddress(4),
              amount: "5",
            },
            {
              type: "tez",
              recipient: mockImplicitAddress(5),
              amount: "6",
            },
          ]),
          TezosNetwork.MAINNET
        )
      );
      jest.mocked(makeToolkit).mockResolvedValue(MOCK_TEZOS_TOOLKIT as TezosToolkit);
    });

    test("a batch can be deleted by clicking the delete button and confirming", () => {
      render(<BatchPage />);
      const firstBatch = screen.getAllByTestId(/batch-table/i)[0];
      const { getByLabelText } = within(firstBatch);
      const deleteBtn = getByLabelText(/Delete Batch/i);
      fireEvent.click(deleteBtn);
      expect(screen.getByText(/Are you sure/i)).toBeTruthy();
      const confirmBtn = screen.getByRole("button", { name: /confirm/i });
      fireEvent.click(confirmBtn);
      expect(screen.getAllByTestId(/batch-table/i)).toHaveLength(1);
    });

    const clickSubmitOnFirstBatch = () => {
      const batchTable = screen.getAllByTestId(/batch-table/i)[0];

      const { getByRole } = within(batchTable);
      const submitBatchBtn = getByRole("button", { name: /submit batch/i });
      fireEvent.click(submitBatchBtn);
    };

    test("clicking submit batch button displays 'preview' form", () => {
      render(<BatchPage />);
      act(() => {
        clickSubmitOnFirstBatch();
      });
      const modal = screen.getByRole("dialog");
      const { getByText, getByLabelText } = within(modal);
      expect(getByText(/transaction details/i)).toBeInTheDocument();

      const txsAmount = getByLabelText(/transactions-amount/i);
      expect(txsAmount).toHaveTextContent("3");

      expect(screen.getByRole("button", { name: /preview/i })).toBeInTheDocument();
    });

    test("estimating and submiting a batch executes the batch of transactions and empties it after successful submition", async () => {
      mockEstimatedFee(10);
      render(<BatchPage />);
      act(() => {
        clickSubmitOnFirstBatch();
      });

      expect(
        screen.getByTestId("batch-table-" + mockImplicitAccount(2).address.pkh)
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("batch-table-" + mockImplicitAccount(1).address.pkh)
      ).toBeInTheDocument();

      const previewBtn = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(previewBtn);

      const passwordInput = await screen.findByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: "mockPass" } });

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      await waitFor(() => {
        expect(submit).toBeEnabled();
      });
      fireEvent.click(submit);

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeInTheDocument();
      });

      expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
        "href",
        "https://mainnet.tzkt.io/foo"
      );

      expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(
        makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          {
            amount: "1000000",
            recipient: { pkh: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf", type: "implicit" },
            type: "tez",
          },
          {
            amount: "2000000",
            recipient: { pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D", type: "implicit" },
            type: "tez",
          },
          {
            amount: "3000000",
            recipient: { pkh: "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS", type: "implicit" },
            type: "tez",
          },
        ]),
        MOCK_TEZOS_TOOLKIT
      );

      expect(
        screen.getByTestId("batch-table-" + mockImplicitAccount(2).address.pkh)
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("batch-table-" + mockImplicitAccount(1).address.pkh)
      ).not.toBeInTheDocument();
    });
  });
});
