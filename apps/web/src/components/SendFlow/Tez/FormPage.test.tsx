import {
  estimate,
  makeAccountOperations,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, mockToast } from "@umami/state";
import { executeParams } from "@umami/test-utils";

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

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<Form />", () => {
  describe("default values", () => {
    it("renders an empty form by default", async () => {
      await renderInModal(<FormPage />, store);

      expect(screen.getByTestId("available-balance")).toBeInTheDocument();
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

    it("shows a toast if estimation fails", async () => {
      const user = userEvent.setup();
      await renderInModal(
        <FormPage
          form={{
            sender: mockImplicitAccount(0).address.pkh,
            recipient: mockImplicitAccount(1).address.pkh,
            prettyAmount: "1",
          }}
        />,
        store
      );
      const submitButton = screen.getByText("Preview");
      await waitFor(() => expect(submitButton).toBeEnabled());
      const estimateMock = jest.mocked(estimate);
      estimateMock.mockRejectedValue(new Error("Some error occurred"));

      await act(() => user.click(submitButton));

      expect(estimateMock).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith({
        description:
          "Something went wrong. Please try again or contact support if the issue persists.",
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
              prettyAmount: "1",
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
