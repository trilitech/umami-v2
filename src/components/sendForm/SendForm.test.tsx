/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { Modal } from "@chakra-ui/react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import {
  mockAccount,
  mockBaker,
  mockNFT,
  mockPkh,
} from "../../mocks/factories";
import { ReactQueryProvider } from "../../providers/ReactQueryProvider";
import { ReduxStore } from "../../providers/ReduxStore";
import { AccountType } from "../../types/Account";
import { UmamiTheme } from "../../providers/UmamiTheme";
import { formatPkh } from "../../utils/format";
import { useGetSk } from "../../utils/hooks/accountUtils";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import { SendForm } from "./SendForm";
import { SendFormMode } from "./types";
import { estimateBatch, estimateFA2transfer, estimateTezTransfer } from "../../utils/tezos/estimate";
import { transferFA2Token, transferTez } from "../../utils/tezos/operations";

const { add, addSecret } = accountsSlice.actions;

jest.mock("../../GoogleAuth", () => ({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  GoogleAuth: require("../../mocks/GoogleAuthMock").GoogleAuthMock,
}));
jest.mock("../../utils/tezos");
jest.mock("react-router-dom");
jest.mock("../../utils/hooks/accountUtils");

const estimateTezTransferMock = estimateTezTransfer as jest.Mock;
const estimateFA2transferMock = estimateFA2transfer as jest.Mock;
const transferTezMock = transferTez as jest.Mock;
const transferFA2TokenMock = transferFA2Token as jest.Mock;
const estimateBatchMock = estimateBatch as jest.Mock;
const useGetSkMock = useGetSk as jest.Mock;

const fixture = (sender?: string, assetType?: SendFormMode) => (
  <ReactQueryProvider>
    <UmamiTheme>
      <ReduxStore>
        <Modal isOpen={true} onClose={() => {}}>
          <SendForm sender={sender} mode={assetType} />
        </Modal>
      </ReduxStore>
    </UmamiTheme>
  </ReactQueryProvider>
);

const MOCK_SK = "mockSk";

beforeEach(() => {
  useGetSkMock.mockReturnValue(() => MOCK_SK);
});
beforeAll(() => {
  store.dispatch(addSecret({ hash: "mockPrint", secret: {} as any }));
  store.dispatch(
    add([
      mockAccount(1),
      mockAccount(2),
      mockAccount(3),
      mockAccount(4, AccountType.SOCIAL),
    ])
  );
});

describe("<SendForm />", () => {
  describe("case send tez", () => {
    test("should render first step with sender blank", () => {
      render(fixture());
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        /select an account/i
      );
    });

    test("should render first step with sender prefiled if provided", () => {
      render(fixture(mockAccount(1).pkh));
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockAccount(1).pkh)
      );
    });

    const fillForm = async () => {
      render(fixture(mockAccount(1).pkh));
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockAccount(1).pkh)
      );

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });
    };

    const fillFormAndSimulate = async () => {
      await fillForm();
      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      estimateTezTransferMock.mockResolvedValueOnce({
        suggestedFeeMutez: 12345,
      });

      fireEvent.click(submitBtn);

      await waitFor(() => {
        const subTotal = screen.getByLabelText(/^sub-total$/i);
        expect(subTotal).toHaveTextContent(/23 ꜩ/i);

        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/23.012345 ꜩ/i);
      });
    };

    it("should allow to add transaction to batch", async () => {
      await fillForm();

      estimateBatchMock.mockImplementationOnce(async (transactions: any[]) => {
        return transactions.map((_) => ({ suggestedFeeMutez: 33 }));
      });
      const addToBatchBtn = screen.getByRole("button", {
        name: /insert into batch/i,
      });

      await waitFor(() => {
        expect(addToBatchBtn).toBeEnabled();
      });

      fireEvent.click(addToBatchBtn);
      await waitFor(() => {
        expect(addToBatchBtn).toBeDisabled();
      });
      await waitFor(() => {
        expect(screen.getByText(/added to batch/i)).toBeTruthy();
      });

      const batch = store.getState().assets.batches[mockAccount(1).pkh];
      expect(batch).toEqual({
        isSimulating: false,
        items: [
          {
            fee: 33,
            transaction: {
              type: "tez",
              values: {
                amount: 23,
                recipient: mockPkh(7),
                sender: mockPkh(1),
              },
            },
          },
        ],
      });

      estimateBatchMock.mockImplementationOnce(async (transactions: any[]) => {
        return transactions.map((_) => ({ suggestedFeeMutez: 33 }));
      });
      fireEvent.click(addToBatchBtn);
      await waitFor(() => {
        expect(addToBatchBtn).toBeDisabled();
      });
      await waitFor(() => {
        expect(screen.getAllByText(/added to batch/i)).toBeTruthy();
      });

      const batch2 = store.getState().assets.batches[mockAccount(1).pkh];
      expect(batch2).toEqual({
        isSimulating: false,
        items: [
          {
            fee: 33,
            transaction: {
              type: "tez",
              values: {
                amount: 23,
                recipient: mockPkh(7),
                sender: mockPkh(1),
              },
            },
          },
          {
            fee: 33,
            transaction: {
              type: "tez",
              values: {
                amount: 23,
                recipient: mockPkh(7),
                sender: mockPkh(1),
              },
            },
          },
        ],
      });
    });

    test("should display simulation result: subtotal, fee and total", async () => {
      await fillFormAndSimulate();
    });

    test("it should submit transaction and display recap with tzkt link", async () => {
      await fillFormAndSimulate();

      transferTezMock.mockResolvedValueOnce({
        hash: "foo",
      });

      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: "mockPass" } });

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      fireEvent.click(submit);

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/foo"
        );
      });
      expect(transferTezMock).toHaveBeenCalledWith(mockPkh(7), 23, {
        network: "mainnet",
        sk: MOCK_SK,
      });
    });
  });

  describe("case send NFT", () => {
    const fillFormAndSimulate = async () => {
      render(fixture(undefined, { type: "nft", data: mockNFT(1) }));
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockAccount(1).pkh)
      );

      // const amountInput = screen.getByLabelText(/amount/i);
      // fireEvent.change(amountInput, { target: { value: "23" } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });

      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      estimateFA2transferMock.mockResolvedValueOnce({
        suggestedFeeMutez: 3654,
      });

      fireEvent.click(submitBtn);

      await waitFor(() => {
        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.003654 ꜩ/i);

        const nft = screen.getByLabelText(/^nft$/i);
        expect(within(nft).getByRole("img")).toHaveProperty(
          "src",
          mockNFT(1).metadata.displayUri
        );
      });
    };

    test("sender button is disabled and prefilled with NFT owner", () => {
      render(fixture(undefined, { type: "nft", data: mockNFT(1) }));

      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockNFT(1).owner)
      );

      expect(screen.getByTestId(/account-selector/)).toBeDisabled();
    });

    test("should display simulation result: NFT image, fee and total", async () => {
      await fillFormAndSimulate();
    });

    test("it should transfer NFT and display recap with tzktLink", async () => {
      await fillFormAndSimulate();

      const passwordInput = screen.getByLabelText(/password/i);
      fireEvent.change(passwordInput, { target: { value: "mockPass" } });
      transferFA2TokenMock.mockResolvedValueOnce({ hash: "mockHash" });

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      fireEvent.click(submit);

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/mockHash"
        );
      });

      expect(transferFA2TokenMock).toHaveBeenCalledWith(
        {
          amount: 1,
          contract: "KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob1",
          recipient: mockPkh(7),
          sender: mockPkh(1),
          tokenId: "mockId1",
        },
        {
          network: "mainnet",
          sk: MOCK_SK,
        }
      );
    });
  });

  describe("case delegations", () => {
    beforeAll(() => {
      const { updateBakers } = assetsSlice.actions;
      store.dispatch(updateBakers([mockBaker(1), mockBaker(2), mockBaker(3)]));
    });

    test("it displays delegation form form", async () => {
      render(fixture(undefined, { type: "delegation" }));

      expect(screen.getByText(/delegate/i)).toBeTruthy();

      const bakerInput = screen.getByTestId(/baker-selector/i);
      fireEvent.change(bakerInput, {
        target: { value: mockBaker(2).address },
      });
    });

    // Can't find a way to itneract with Chakra select boxes with Testing Library.
    // So it's impossible to do a fill use case.
    // TODO investigate this

    // test("User can simulate and execute delegations to bakers", async () => {
    //   render(fixture(undefined, { type: "delegation" }));
    //   const senderInput = screen.getByText(/select an account/i);
    //   fireEvent.click(senderInput);
    //   // userEvent.selectOptions(senderInput, mockAccount(1).pkh);
    // });
  });
  describe("case send tez with Google account", () => {
    const fillForm = async () => {
      render(fixture(mockAccount(4, AccountType.SOCIAL).pkh));

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });

      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      estimateTezTransferMock.mockResolvedValueOnce({
        suggestedFeeMutez: 12345,
      });

      fireEvent.click(submitBtn);

      await waitFor(() => {
        const subTotal = screen.getByLabelText(/^sub-total$/i);
        expect(subTotal).toHaveTextContent(/23 ꜩ/i);

        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/23.012345 ꜩ/i);
      });
    };
    test("It doesn't display password in SubmitStep", async () => {
      await fillForm();
      expect(
        screen.getByRole("button", { name: /sign with google/i })
      ).toBeTruthy();
      expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    });

    test("Clicking on submit transaction signs with google private key and shows operation submitted message", async () => {
      await fillForm();

      const googleSSOBtn = screen.getByText(/sign with google/i);

      transferTezMock.mockResolvedValueOnce({
        hash: "foo",
      });

      fireEvent.click(googleSSOBtn);

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/foo"
        );
      });
    });
  });
});
