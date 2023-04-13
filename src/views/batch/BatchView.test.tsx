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
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import { estimateBatch } from "../../utils/tezos";
import BatchView from "./BatchView";

jest.mock("../../utils/tezos");
const estimateBatchMock = estimateBatch as jest.Mock;

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

beforeEach(() => {
  estimateBatchMock.mockImplementation(async (transactions: any[]) => {
    return transactions.map((_) => ({ suggestedFeeMutez: 10 }));
  });
});

afterAll(() => {
  // Cleanup
  // Isn't there a way to reset redux root store to zero? Apparently not.
  store.dispatch(accountsSlice.actions.reset());
  store.dispatch(assetsSlice.actions.reset());
});

describe("<BatchView />", () => {
  it("should display a message if no batches are present", () => {
    render(fixture());

    expect(screen.getByText(/0 pending/i)).toBeInTheDocument();
    expect(screen.getByText(/your batch is empty/i)).toBeInTheDocument();
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
    closeModal();
  };

  it("should diplay batches of all accounts by default", async () => {
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
});
