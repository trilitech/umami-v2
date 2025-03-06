import {
  estimate,
  makeAccountOperations,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import {
  type UmamiStore,
  addTestAccount,
  makeStore,
  mockToast,
  useGetAccountBalanceDetails,
} from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { CustomError } from "@umami/utils";
import { BigNumber } from "bignumber.js";

import { FormPage } from "./FormPage";
import { SignPage } from "./SignPage";
import {
  act,
  dynamicModalContextMock,
  fireEvent,
  renderInModal,
  screen,
  userEvent,
  waitFor,
} from "../../../testUtils";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useGetAccountBalanceDetails: jest.fn(),
}));

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  jest.mocked(useGetAccountBalanceDetails).mockReturnValue({
    spendableBalance: BigNumber(1000000),
    totalBalance: BigNumber(1000000),
    stakedBalance: 0,
    totalFinalizableAmount: BigNumber(1000000),
    totalPendingAmount: BigNumber(0),
  });
});

describe("<Form />", () => {
  describe("default values", () => {
    it("renders an empty form by default", async () => {
      await renderInModal(<FormPage />, store);

      expect(screen.queryByTestId("available-balance")).not.toBeInTheDocument();
      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue("");
      expect(screen.getByLabelText("Amount")).toHaveValue(null);
    });

    it("renders a form with default form values", async () => {
      await renderInModal(
        <FormPage
          form={{
            sender: mockImplicitAccount(0).address.pkh,
            prettyAmount: "1",
            recipient: mockImplicitAccount(1).address.pkh,
          }}
        />,
        store
      );

      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue(
        mockImplicitAccount(1).address.pkh
      );
      expect(screen.getByLabelText("Amount")).toHaveValue(1);
    });

    it("renders a form with default form values but disabled sender if it's provided", async () => {
      await renderInModal(
        <FormPage
          form={{
            sender: mockImplicitAccount(0).address.pkh,
            prettyAmount: "1",
            recipient: mockImplicitAccount(1).address.pkh,
          }}
          sender={mockImplicitAccount(0)}
        />,
        store
      );

      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue(
        mockImplicitAccount(1).address.pkh
      );
      expect(screen.getByLabelText("Amount")).toHaveValue(1);
    });

    it("renders a form with prefilled recipient", async () => {
      await renderInModal(
        <FormPage
          form={{
            sender: "",
            prettyAmount: "",
            recipient: mockImplicitAccount(1).address.pkh,
          }}
        />,
        store
      );

      await waitFor(() =>
        expect(screen.getByTestId("real-address-input-recipient")).toHaveValue(
          mockImplicitAccount(1).address.pkh
        )
      );
    });
  });

  // TODO: add custom matchers for the fields so that this code doesn't have to be repeated over and over again
  describe("validations", () => {
    describe("To", () => {
      it("is required", async () => {
        await renderInModal(<FormPage />, store);

        fireEvent.blur(screen.getByLabelText("To"));
        await waitFor(() =>
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          )
        );
      });

      it("allows only valid addresses", async () => {
        await renderInModal(<FormPage />, store);

        fireEvent.change(screen.getByLabelText("To"), {
          target: { value: "invalid" },
        });
        await waitFor(() =>
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          )
        );

        fireEvent.change(screen.getByLabelText("To"), {
          target: { value: mockImplicitAccount(0).address.pkh },
        });

        await waitFor(() =>
          expect(screen.queryByTestId("recipient-error")).not.toBeInTheDocument()
        );
      });
    });

    describe("Amount", () => {
      it("is required", async () => {
        await renderInModal(<FormPage />, store);

        fireEvent.blur(screen.getByLabelText("Amount"));
        await waitFor(() =>
          expect(screen.getByTestId("amount-error")).toHaveTextContent("Amount is required")
        );
      });
    });
  });

  describe("single transaction", () => {
    beforeEach(() => {
      addTestAccount(store, mockMnemonicAccount(0));
      addTestAccount(store, mockMultisigAccount(0));
    });

    it("correctly validates insufficient balance", async () => {
      const user = userEvent.setup();
      await renderInModal(
        <FormPage
          form={{
            sender: mockImplicitAccount(0).address.pkh,
            recipient: mockImplicitAccount(1).address.pkh,
            prettyAmount: "2",
          }}
        />,
        store
      );

      const amountInput = screen.getByLabelText("Amount");
      await user.type(amountInput, "1");
      await user.tab();

      await waitFor(() =>
        expect(screen.getByTestId("amount-error")).toHaveTextContent("Insufficient funds")
      );

      const submitButton = screen.getByText("Preview");
      await waitFor(() => expect(submitButton).toBeDisabled());
    });

    it("shows a toast if estimation fails", async () => {
      const user = userEvent.setup();
      await renderInModal(
        <FormPage
          form={{
            sender: mockImplicitAccount(0).address.pkh,
            recipient: mockImplicitAccount(1).address.pkh,
            prettyAmount: "0.5",
          }}
        />,
        store
      );

      const submitButton = screen.getByText("Preview");
      await waitFor(() => expect(submitButton).toBeEnabled());
      const estimateMock = jest.mocked(estimate);
      estimateMock.mockRejectedValue(new CustomError("Some error occurred"));

      await act(() => user.click(submitButton));

      expect(estimateMock).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith({
        description: "Some error occurred",
        status: "error",
        isClosable: true,
      });
    });

    it.each([mockImplicitAccount(0), mockMultisigAccount(0)])(
      "opens a sign page if estimation succeeds",
      async sender => {
        const user = userEvent.setup();
        await renderInModal(
          <FormPage
            form={{
              sender: sender.address.pkh,
              recipient: mockImplicitAccount(1).address.pkh,
              prettyAmount: "0.5",
            }}
          />,
          store
        );
        const submitButton = screen.getByText("Preview");
        await waitFor(() => expect(submitButton).toBeEnabled());

        const operations = {
          ...makeAccountOperations(sender, mockImplicitAccount(0), [
            {
              type: "tez",
              amount: "1000000",
              recipient: mockImplicitAccount(1).address,
            },
          ]),
          estimates: [executeParams()],
        };

        jest.mocked(estimate).mockResolvedValueOnce(operations);
        await act(() => user.click(submitButton));

        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <SignPage
            data={undefined}
            goBack={expect.any(Function)}
            mode="single"
            operations={operations}
          />
        );
        expect(mockToast).not.toHaveBeenCalled();
      }
    );
  });
});
