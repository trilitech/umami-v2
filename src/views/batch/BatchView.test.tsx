import { mockImplicitAccount, mockImplicitAddress } from "../../mocks/factories";
import { fakeTezosUtils } from "../../mocks/fakeTezosUtils";
import {
  closeModal,
  dispatchMockAccounts,
  selectSender,
  setBatchEstimationPerTransaction,
} from "../../mocks/helpers";
import { fireEvent, render, screen, waitFor, within } from "../../mocks/testUtils";
import { SignerType, SkSignerConfig } from "../../types/SignerConfig";
import { TezosNetwork } from "../../types/TezosNetwork";
import { useGetSk } from "../../utils/hooks/accountUtils";
import { store } from "../../utils/store/store";
import { estimateAndUpdateBatch } from "../../utils/store/thunks/estimateAndupdateBatch";
import BatchView from "./BatchView";

// These tests might take long in the CI
jest.setTimeout(10000);

jest.mock("@chakra-ui/react", () => {
  return {
    ...jest.requireActual("@chakra-ui/react"),
    // Mock taost since it has an erratic behavior in RTL
    // https://github.com/chakra-ui/chakra-ui/issues/2969
    //
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    useToast: require("../../../src/mocks/toast").useToast,
  };
});

jest.mock("../../utils/hooks/accountUtils");

const useGetSkMock = useGetSk as jest.Mock;

const fixture = () => <BatchView />;

beforeEach(() => {
  dispatchMockAccounts([mockImplicitAccount(1), mockImplicitAccount(2), mockImplicitAccount(3)]);
  setBatchEstimationPerTransaction(fakeTezosUtils.estimateBatch, 10);

  useGetSkMock.mockReturnValue(() => "mockSk");
  fakeTezosUtils.submitBatch.mockResolvedValue({ opHash: "foo" } as any);
});

const addToBatchViaUI = async (amount: number, senderLabel: string, recipientPkh: string) => {
  const amountInput = screen.getByLabelText(/amount/i);
  fireEvent.change(amountInput, { target: { value: Number(amount) } });
  const recipientInput = screen.getByLabelText(/^to$/i);
  fireEvent.change(recipientInput, { target: { value: recipientPkh } });

  selectSender(senderLabel);

  const addToBatchButton = screen.getByRole("button", {
    name: /insert into batch/i,
  });

  await waitFor(() => {
    expect(addToBatchButton).toBeEnabled();
  });

  fireEvent.click(addToBatchButton);

  await waitFor(() => {
    expect(addToBatchButton).toBeDisabled();
  });

  await waitFor(() => {
    expect(addToBatchButton).toBeEnabled();
  });
};

// Can't run in beforeEach because it requires a render
// Also if you were to do it by different means, it slows down the whole test suite by 20s
const addItemsToBatchViaUI = async () => {
  const sendButton = screen.getByText(/send/i);
  fireEvent.click(sendButton);

  await addToBatchViaUI(33, mockImplicitAccount(1).label, mockImplicitAddress(9).pkh);
  await addToBatchViaUI(55, mockImplicitAccount(1).label, mockImplicitAddress(4).pkh);
  await addToBatchViaUI(9, mockImplicitAccount(1).label, mockImplicitAddress(2).pkh);

  await addToBatchViaUI(3, mockImplicitAccount(2).label, mockImplicitAddress(2).pkh);
  await addToBatchViaUI(22, mockImplicitAccount(2).label, mockImplicitAddress(4).pkh);
  await addToBatchViaUI(52, mockImplicitAccount(2).label, mockImplicitAddress(4).pkh);
  closeModal();
};

// Can run in beforeEach
const addItemsToBatchViaStore = async () => {
  await store.dispatch(
    estimateAndUpdateBatch(
      mockImplicitAccount(1).address.pkh,
      mockImplicitAccount(1).pk,
      [
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
      ],

      TezosNetwork.MAINNET
    )
  );

  await store.dispatch(
    estimateAndUpdateBatch(
      mockImplicitAccount(2).address.pkh,
      mockImplicitAccount(2).pk,
      [
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
      ],

      TezosNetwork.MAINNET
    )
  );
};

describe("<BatchView />", () => {
  describe("Given no batch has beed added", () => {
    it("a message 'no batches are present' is displayed", () => {
      render(fixture());

      expect(screen.getByText(/0 pending/i)).toBeInTheDocument();
      expect(screen.getByText(/your batch is currently empty/i)).toBeInTheDocument();
    });

    test("user can add transactions to batches and it displays batches of all accounts by default", async () => {
      render(fixture());
      await addItemsToBatchViaUI();

      expect(screen.queryByText(/your batch is currently empty/i)).not.toBeInTheDocument();
      expect(await screen.findAllByTestId(/batch-table/i)).toHaveLength(2);
    });
  });

  describe("Given batches have been added", () => {
    beforeEach(async () => {
      // This is fast and can run before each test
      await addItemsToBatchViaStore();
    });

    it("should display fee total and subtotal for a given batch", async () => {
      render(fixture());
      const firstBatch = screen.getAllByTestId(/batch-table/i)[0];
      const { getByLabelText } = within(firstBatch);
      const subTotal = getByLabelText(/^sub-total$/i);
      expect(subTotal).toHaveTextContent(/6 ꜩ/i);
      const fee = getByLabelText(/^fee$/i);
      expect(fee).toHaveTextContent(/0.00003 ꜩ/i);
      const total = getByLabelText(/^total$/i);
      expect(total).toHaveTextContent(/6.00003 ꜩ/i);
    });

    test("a batch can be deleted by clicking the delete button and confirming", () => {
      render(fixture());
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
      render(fixture());
      clickSubmitOnFirstBatch();
      const modal = screen.getByRole("dialog");
      const { getByText, getByLabelText } = within(modal);
      expect(getByText(/transaction details/i)).toBeInTheDocument();

      const txsAmount = getByLabelText(/transactions-amount/i);
      expect(txsAmount).toHaveTextContent("3");

      const subTotal = getByLabelText(/sub-total/i);
      expect(subTotal).toHaveTextContent("6 ꜩ");
      expect(screen.getByRole("button", { name: /preview/i })).toBeInTheDocument();
    });

    test("estimating and submiting a batch executes the batch of transactions and empties it after successfull submition", async () => {
      render(fixture());
      clickSubmitOnFirstBatch();

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
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
      });

      expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
        "href",
        "https://mainnet.tzkt.io/foo"
      );
      const config: SkSignerConfig = {
        type: SignerType.SK,
        network: TezosNetwork.MAINNET,
        sk: "mockSk",
      };
      expect(fakeTezosUtils.submitBatch).toHaveBeenCalledWith(
        [
          {
            type: "tez",
            amount: "1000000",
            recipient: mockImplicitAddress(1),
          },
          {
            type: "tez",
            amount: "2000000",
            recipient: mockImplicitAddress(2),
          },
          {
            type: "tez",
            amount: "3000000",
            recipient: mockImplicitAddress(3),
          },
        ],
        config
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
