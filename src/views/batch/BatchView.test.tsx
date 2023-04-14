import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { mockAccount, mockPkh } from "../../mocks/factories";
import { closeModal, fillAccountSelector } from "../../mocks/helpers";
import { ReduxStore } from "../../providers/ReduxStore";
import { UmamiTheme } from "../../providers/UmamiTheme";
import { decrypt } from "../../utils/aes";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import { estimateBatch, submitBatch } from "../../utils/tezos";
import BatchView from "./BatchView";

// TODO refactor mocks
jest.mock("../../utils/aes");
jest.mock("react-router-dom");
jest.mock("../../utils/tezos");

const estimateBatchMock = estimateBatch as jest.Mock;
const submitBatchMock = submitBatch as jest.Mock;
const decryptMock = decrypt as jest.Mock;

const fixture = () => (
  <ReduxStore>
    <UmamiTheme>
      <BatchView />
    </UmamiTheme>
  </ReduxStore>
);

beforeAll(() => {
  store.dispatch(
    accountsSlice.actions.add([mockAccount(1), mockAccount(2), mockAccount(3)])
  );
});

// Why doesn't this work in beforeAll??
beforeEach(() => {
  estimateBatchMock.mockImplementation(async (transactions: any[]) => {
    return transactions.map((_) => ({ suggestedFeeMutez: 10 }));
  });

  decryptMock.mockResolvedValue("mockSk");
  submitBatchMock.mockResolvedValue({ opHash: "foo" });
});

afterAll(() => {
  // Cleanup
  // Isn't there a way to reset redux root store to zero? Apparently not.
  store.dispatch(accountsSlice.actions.reset());
  store.dispatch(assetsSlice.actions.reset());
});

const addToBatch = async (
  amount: number,
  senderLabel: string,
  recipientPkh: string
) => {
  const amountInput = screen.getByLabelText(/amount/i);
  fireEvent.change(amountInput, { target: { value: Number(amount) } });
  const recipientInput = screen.getByLabelText(/^to$/i);
  fireEvent.change(recipientInput, { target: { value: recipientPkh } });

  fillAccountSelector(senderLabel);

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

const addItemsToBatch = async () => {
  const sendButton = screen.getByText(/send/i);
  fireEvent.click(sendButton);

  await addToBatch(33, mockAccount(1).label || "", mockPkh(9));
  await addToBatch(55, mockAccount(1).label || "", mockPkh(4));
  await addToBatch(9, mockAccount(1).label || "", mockPkh(2));

  await addToBatch(3, mockAccount(2).label || "", mockPkh(2));
  await addToBatch(22, mockAccount(2).label || "", mockPkh(4));
  await addToBatch(52, mockAccount(2).label || "", mockPkh(4));
  closeModal();
};

describe("<BatchView />", () => {
  test("user adds transactions to batch and it displays batches of all accounts by default", async () => {
    render(fixture());
    await addItemsToBatch();

    expect(screen.queryByText(/your batch is empty/i)).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/batch-table/i)).toHaveLength(2);
  });

  it("should display fee total and subtotal for a given batch", async () => {
    render(fixture());
    const firstBatch = screen.getAllByTestId(/batch-table/i)[0];
    const { getByLabelText } = within(firstBatch);

    const subTotal = getByLabelText(/^sub-total$/i);
    expect(subTotal).toHaveTextContent(/97 ꜩ/i);

    const fee = getByLabelText(/^fee$/i);
    expect(fee).toHaveTextContent(/0.00003 ꜩ/i);

    const total = getByLabelText(/^total$/i);
    expect(total).toHaveTextContent(/97.00003 ꜩ/i);
  });

  test("batch can be deleted by clicking the delete button and confirming", () => {
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

  const clickSubmitBatch = () => {
    const batchTable = screen.getByTestId(/batch-table/i);

    const { getByRole } = within(batchTable);
    const submitBatchBtn = getByRole("button", { name: /submit batch/i });

    fireEvent.click(submitBatchBtn);
  };

  test("clicking submit batch button displays 'recap and submit' form", () => {
    render(fixture());
    clickSubmitBatch();
    const modal = screen.getByRole("dialog");
    const { getByText, getByLabelText } = within(modal);
    expect(getByText(/transaction details/i)).toBeInTheDocument();

    const txsAmount = getByLabelText(/^transactions-amount$/i);
    expect(txsAmount).toHaveTextContent("3");
    const fee = getByLabelText(/^fee$/i);
    expect(fee).toHaveTextContent("0.00003 ꜩ");
    const subTotal = getByLabelText(/^sub-total$/i);
    expect(subTotal).toHaveTextContent("77 ꜩ");
    const total = getByLabelText(/^total$/i);
    expect(total).toHaveTextContent("77.00003 ꜩ");
  });

  test("submiting transaction executes the batch of transactions and emptys batch after successfull submition", async () => {
    render(fixture());
    clickSubmitBatch();

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "mockPass" } });

    const submit = screen.getByRole("button", {
      name: /submit transaction/i,
    });

    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
        "href",
        "https://mainnet.tzkt.io/foo"
      );
    });
    expect(submitBatch).toHaveBeenCalledWith(
      [
        {
          type: "tez",
          values: {
            amount: 3,
            recipient: mockPkh(2),
            sender: mockPkh(2),
          },
        },
        {
          type: "tez",
          values: {
            amount: 22,
            recipient: mockPkh(4),
            sender: mockPkh(2),
          },
        },
        {
          type: "tez",
          values: {
            amount: 52,
            recipient: mockPkh(4),
            sender: mockPkh(2),
          },
        },
      ],
      "mockSk",
      "mainnet"
    );
  });
});
