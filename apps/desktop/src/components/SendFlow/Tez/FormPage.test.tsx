import { Modal } from "@chakra-ui/react";
import {
  estimate,
  makeAccountOperations,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, mockToast } from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { CustomError } from "@umami/utils";

import { FormPage, type FormValues } from "./FormPage";
import { SignPage } from "./SignPage";
import {
  act,
  dynamicModalContextMock,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../../mocks/testUtils";
import { type FormPageProps } from "../utils";

const fixture = (props: FormPageProps<FormValues> = {}) => (
  <Modal isOpen={true} onClose={() => {}}>
    <FormPage {...props} />
  </Modal>
);

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
    it("renders an empty form by default", () => {
      render(fixture(), { store });

      expect(screen.getByLabelText("From")).toHaveValue("");
      expect(screen.getByLabelText("From")).toBeEnabled();
      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue("");
      expect(screen.getByLabelText("Amount")).toHaveValue(null);
    });

    it("renders a form with a prefilled sender", () => {
      render(fixture({ sender: mockImplicitAccount(0) }), { store });

      expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
        mockImplicitAccount(0).address.pkh
      );
    });

    it("renders a form with default form values", async () => {
      render(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            prettyAmount: "1",
            recipient: mockImplicitAccount(1).address.pkh,
          },
        }),
        { store }
      );

      await waitFor(() =>
        expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        )
      );
      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue(
        mockImplicitAccount(1).address.pkh
      );
      expect(screen.getByLabelText("Amount")).toHaveValue(1);
    });

    it("renders a form with default form values but disabled sender if it's provided", async () => {
      render(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            prettyAmount: "1",
            recipient: mockImplicitAccount(1).address.pkh,
          },
          sender: mockImplicitAccount(0),
        }),
        { store }
      );

      await waitFor(() =>
        expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        )
      );
      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue(
        mockImplicitAccount(1).address.pkh
      );
      expect(screen.getByLabelText("Amount")).toHaveValue(1);
    });

    it("renders a form with prefilled recipient", async () => {
      render(
        fixture({
          form: {
            sender: "",
            prettyAmount: "",
            recipient: mockImplicitAccount(1).address.pkh,
          },
        }),
        { store }
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
    describe("From", () => {
      it("is required", async () => {
        render(fixture(), { store });

        fireEvent.blur(screen.getByLabelText("From"));
        await waitFor(() =>
          expect(screen.getByTestId("from-error")).toHaveTextContent("Invalid address or contact")
        );
      });

      it("allows only owned accounts", async () => {
        addTestAccount(store, mockMnemonicAccount(0));
        render(fixture(), { store });

        fireEvent.change(screen.getByLabelText("From"), {
          target: { value: mockImplicitAccount(1).address.pkh },
        });
        await waitFor(() =>
          expect(screen.getByTestId("from-error")).toHaveTextContent("Invalid address or contact")
        );

        fireEvent.change(screen.getByLabelText("From"), {
          target: { value: mockImplicitAccount(0).address.pkh },
        });

        await waitFor(() => expect(screen.queryByTestId("from-error")).not.toBeInTheDocument());
      });

      it("allows owned multisig accounts", async () => {
        addTestAccount(store, mockMultisigAccount(0));
        render(fixture(), { store });

        fireEvent.change(screen.getByLabelText("From"), {
          target: { value: mockMultisigAccount(1).address.pkh },
        });
        await waitFor(() =>
          expect(screen.getByTestId("from-error")).toHaveTextContent("Invalid address or contact")
        );

        fireEvent.change(screen.getByLabelText("From"), {
          target: { value: mockMultisigAccount(0).address.pkh },
        });

        await waitFor(() => expect(screen.queryByTestId("from-error")).not.toBeInTheDocument());
      });
    });

    describe("To", () => {
      it("is required", async () => {
        render(fixture(), { store });

        fireEvent.blur(screen.getByLabelText("To"));
        await waitFor(() =>
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          )
        );
      });

      it("allows only valid addresses", async () => {
        render(fixture(), { store });

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
        render(fixture(), { store });

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
      render(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            recipient: mockImplicitAccount(1).address.pkh,
            prettyAmount: "1",
          },
        }),
        { store }
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
        render(
          fixture({
            form: {
              sender: sender.address.pkh,
              recipient: mockImplicitAccount(1).address.pkh,
              prettyAmount: "1",
            },
          }),
          { store }
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
