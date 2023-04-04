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
import { formatPkh } from "../../utils/format";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import {
  delegate,
  estimateDelegation,
  estimateFA2transfer,
  estimateTezTransfer,
  transferFA2Token,
  transferTez,
} from "../../utils/tezos";
import { SendForm } from "./SendForm";
import { SendFormMode } from "./types";

const { add } = accountsSlice.actions;

jest.mock("../../utils/tezos");
jest.mock("react-router-dom");

const estimateTezTransferMock = estimateTezTransfer as jest.Mock;
const estimateFA2transferMock = estimateFA2transfer as jest.Mock;
const transferTezMock = transferTez as jest.Mock;
const transferFA2TokenMock = transferFA2Token as jest.Mock;
const delegateMock = delegate as jest.Mock;
const estimateDelegationMock = estimateDelegation as jest.Mock;

const fixture = (sender?: string, assetType?: SendFormMode) => (
  <ReactQueryProvider>
    <ReduxStore>
      <Modal isOpen={true} onClose={() => {}}>
        <SendForm sender={sender} mode={assetType} />
      </Modal>
    </ReduxStore>
  </ReactQueryProvider>
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

    const fillFormAndSimulate = async () => {
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
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/23.012345 ꜩ/i);
      });
    };

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
      expect(transferTezMock).toHaveBeenCalledWith(
        mockPkh(7),
        "23",
        { data: "mockData1", iv: "mockIv1", salt: "mockSalt1" },
        "mockPass",
        "mainnet"
      );
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
          recipient: "tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3x7",
          sender: "tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3x1",
          tokenId: "mockId1",
        },
        { data: "mockData1", iv: "mockIv1", salt: "mockSalt1" },
        "mockPass",
        "mainnet"
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

    // test.only("User can simulate and execute delegations to bakers", async () => {
    //   render(fixture(undefined, { type: "delegation" }));
    //   const senderInput = screen.getByText(/select an account/i);
    //   fireEvent.click(senderInput);
    //   // userEvent.selectOptions(senderInput, mockAccount(1).pkh);
    // });
  });
});
