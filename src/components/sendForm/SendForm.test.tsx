import { Modal } from "@chakra-ui/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockAccount, mockNFT, mockPkh } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import { NFT } from "../../types/Asset";
import { formatPkh } from "../../utils/format";
import accountsSlice from "../../utils/store/accountsSlice";
import { store } from "../../utils/store/store";
import { SendForm } from "./SendForm";
import { estimateTezTransfer } from "../../utils/tezos";

const { add } = accountsSlice.actions;

jest.mock("../../utils/tezos");

const estimateTezTransferMock = estimateTezTransfer as jest.Mock;

const fixture = (sender?: string, nft?: NFT) => (
  <ReduxStore>
    <Modal isOpen={true} onClose={() => {}}>
      <SendForm sender={sender} nft={nft} />
    </Modal>
  </ReduxStore>
);

beforeAll(() => {
  store.dispatch(add([mockAccount(1), mockAccount(2), mockAccount(3)]));
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

    test("should display simulation result: subtotal, fee and total", async () => {
      render(fixture(mockAccount(1).pkh));
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockAccount(1).pkh)
      );

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: "23" } });

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
        // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
        expect(total).toHaveTextContent(/23.012345 ꜩ/i);
      });
    });
  });

  describe("case send NFT", () => {
    test("sender button is disabled and prefilled with NFT owner", () => {
      render(fixture(undefined, mockNFT(1)));

      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockNFT(1).owner)
      );

      expect(screen.getByTestId(/account-selector/)).toBeDisabled();
    });
  });
});
