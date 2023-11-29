import { Modal } from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import { FormPage, FormValues } from "./FormPage";
import { SignPage } from "./SignPage";
import { dynamicModalContextMock } from "../../../mocks/dynamicModal";
import {
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "../../../mocks/factories";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../utils/redux/store";
import { estimate } from "../../../utils/tezos";
import { DynamicModalContext } from "../../DynamicModal";
import { FormPageProps } from "../utils";

const fixture = (props: FormPageProps<FormValues> = {}) => (
  <Modal isOpen={true} onClose={() => {}}>
    <FormPage {...props} />
  </Modal>
);

describe("<Form />", () => {
  describe("default values", () => {
    it("renders an empty form by default", () => {
      render(fixture());

      expect(screen.getByLabelText("From")).toHaveValue("");
      expect(screen.getByLabelText("From")).toBeEnabled();
      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue("");
      expect(screen.getByLabelText("Amount")).toHaveValue(null);
    });

    it("renders a form with a prefilled sender", () => {
      render(fixture({ sender: mockImplicitAccount(0) }));

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
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        );
      });
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
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        );
      });
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
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-recipient")).toHaveValue(
          mockImplicitAccount(1).address.pkh
        );
      });
    });
  });

  // TODO: add custom matchers for the fields so that this code doesn't have to be repeated over and over again
  describe("validations", () => {
    describe("From", () => {
      it("is required", async () => {
        render(fixture());

        fireEvent.blur(screen.getByLabelText("From"));
        await waitFor(() => {
          expect(screen.getByTestId("from-error")).toHaveTextContent("Invalid address or contact");
        });
      });

      it("allows only owned accounts", async () => {
        store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
        render(fixture());

        fireEvent.change(screen.getByLabelText("From"), {
          target: { value: mockImplicitAccount(1).address.pkh },
        });
        await waitFor(() => {
          expect(screen.getByTestId("from-error")).toHaveTextContent("Invalid address or contact");
        });

        fireEvent.change(screen.getByLabelText("From"), {
          target: { value: mockImplicitAccount(0).address.pkh },
        });

        await waitFor(() => {
          expect(screen.queryByTestId("from-error")).not.toBeInTheDocument();
        });
      });

      it("allows owned multisig accounts", async () => {
        store.dispatch(multisigActions.setMultisigs([mockMultisigAccount(0)]));
        render(fixture());

        fireEvent.change(screen.getByLabelText("From"), {
          target: { value: mockMultisigAccount(1).address.pkh },
        });
        await waitFor(() => {
          expect(screen.getByTestId("from-error")).toHaveTextContent("Invalid address or contact");
        });

        fireEvent.change(screen.getByLabelText("From"), {
          target: { value: mockMultisigAccount(0).address.pkh },
        });

        await waitFor(() => {
          expect(screen.queryByTestId("from-error")).not.toBeInTheDocument();
        });
      });
    });

    describe("To", () => {
      it("is required", async () => {
        render(fixture());

        fireEvent.blur(screen.getByLabelText("To"));
        await waitFor(() => {
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          );
        });
      });

      it("allows only valid addresses", async () => {
        render(fixture());

        fireEvent.change(screen.getByLabelText("To"), {
          target: { value: "invalid" },
        });
        await waitFor(() => {
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          );
        });

        fireEvent.change(screen.getByLabelText("To"), {
          target: { value: mockImplicitAccount(0).address.pkh },
        });

        await waitFor(() => {
          expect(screen.queryByTestId("recipient-error")).not.toBeInTheDocument();
        });
      });
    });

    describe("Amount", () => {
      it("is required", async () => {
        render(fixture());

        fireEvent.blur(screen.getByLabelText("Amount"));
        await waitFor(() => {
          expect(screen.getByTestId("amount-error")).toHaveTextContent("Amount is required");
        });
      });
    });
  });

  describe("single transaction", () => {
    beforeEach(() => {
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
      store.dispatch(multisigActions.setMultisigs([mockMultisigAccount(0)]));
    });

    it("shows a toast if estimation fails", async () => {
      render(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            recipient: mockImplicitAccount(1).address.pkh,
            prettyAmount: "1",
          },
        })
      );
      const submitButton = screen.getByText("Preview");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      fireEvent.click(submitButton);
      const estimateMock = jest.mocked(estimate);
      estimateMock.mockRejectedValue(new Error("Some error occurred"));

      await waitFor(() => {
        expect(estimateMock).toHaveBeenCalledTimes(1);
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Some error occurred",
        status: "error",
      });
    });

    test.each([mockImplicitAccount(0), mockMultisigAccount(0)])(
      "opens a sign page if estimation succeeds",
      async sender => {
        render(
          <DynamicModalContext.Provider value={dynamicModalContextMock}>
            {fixture({
              form: {
                sender: sender.address.pkh,
                recipient: mockImplicitAccount(1).address.pkh,
                prettyAmount: "1",
              },
            })}
          </DynamicModalContext.Provider>
        );
        const submitButton = screen.getByText("Preview");
        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });
        fireEvent.click(submitButton);
        mockEstimatedFee(100);
        const operations = makeAccountOperations(sender, mockImplicitAccount(0), [
          { type: "tez", amount: "1000000", recipient: mockImplicitAccount(1).address },
        ]);
        await waitFor(() => {
          expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
            <SignPage
              data={undefined}
              fee={new BigNumber(100)}
              goBack={expect.any(Function)}
              mode="single"
              operations={operations}
            />
          );
        });
        expect(mockToast).not.toHaveBeenCalled();
      }
    );
  });
});
