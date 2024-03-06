import { Modal } from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import { FormPage, FormValues } from "./FormPage";
import { SignPage } from "./SignPage";
import {
  mockFA2Token,
  mockFA2TokenRaw,
  mockImplicitAccount,
  mockMnemonicAccount,
} from "../../../mocks/factories";
import { mockEstimatedFee } from "../../../mocks/helpers";
import {
  act,
  dynamicModalContextMock,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { parseContractPkh } from "../../../types/Address";
import { FA2TokenBalance } from "../../../types/TokenBalance";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { assetsSlice } from "../../../utils/redux/slices/assetsSlice";
import { store } from "../../../utils/redux/store";
import { FormPagePropsWithSender } from "../utils";

const mockAccount = mockMnemonicAccount(0);
const mockTokenRaw = mockFA2TokenRaw(0, mockAccount.address.pkh);
const mockToken = mockFA2Token(0, mockAccount);
const fixture = (
  props: FormPagePropsWithSender<FormValues>,
  token: FA2TokenBalance = mockToken
) => (
  <Modal isOpen={true} onClose={() => {}}>
    <FormPage {...props} token={token} />
  </Modal>
);

describe("<FormPage />", () => {
  describe("default values", () => {
    it("renders a form with a prefilled sender", () => {
      render(fixture({ sender: mockImplicitAccount(1) }));

      expect(screen.getByTestId("address-tile")).toHaveTextContent(
        mockImplicitAccount(1).address.pkh
      );
    });

    it("renders a form with default form values", async () => {
      render(
        fixture({
          sender: mockAccount,
          form: {
            sender: mockAccount.address.pkh,
            prettyAmount: "1",
            recipient: mockImplicitAccount(1).address.pkh,
          },
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
          mockAccount.address.pkh
        );
      });
      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue(
        mockImplicitAccount(1).address.pkh
      );
      expect(screen.getByLabelText("Amount")).toHaveValue(1);
    });
  });

  describe("token", () => {
    it("displays the correct token symbol", async () => {
      render(
        fixture({
          sender: mockAccount,
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("token-symbol")).toHaveTextContent(
          mockToken.metadata?.symbol as string
        );
      });
    });
  });

  describe("validation", () => {
    describe("To", () => {
      it("is required", async () => {
        render(
          fixture({
            sender: mockAccount,
          })
        );

        fireEvent.blur(screen.getByLabelText("To"));
        await waitFor(() => {
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          );
        });
      });

      it("allows only valid addresses", async () => {
        render(
          fixture({
            sender: mockAccount,
          })
        );

        fireEvent.change(screen.getByLabelText("To"), {
          target: { value: "invalid" },
        });
        await waitFor(() => {
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          );
        });

        fireEvent.change(screen.getByLabelText("To"), {
          target: { value: mockAccount.address.pkh },
        });

        await waitFor(() => {
          expect(screen.queryByTestId("recipient-error")).not.toBeInTheDocument();
        });
      });
    });

    describe("amount", () => {
      it("doesn't allow values above the token balance", async () => {
        render(
          fixture(
            {
              sender: mockAccount,
            },
            mockFA2Token(1, mockAccount, 5, 0)
          )
        );
        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "7" } });
        fireEvent.blur(screen.getByLabelText("Amount"));
        await waitFor(() => {
          expect(screen.getByTestId("amount-error")).toHaveTextContent("Max amount is 5");
        });
      });

      it("doesn't allow values above the token balance with decimals", async () => {
        render(
          fixture(
            {
              sender: mockAccount,
            },
            mockFA2Token(1, mockAccount, 1234)
          )
        );
        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "0.1235" } });
        fireEvent.blur(screen.getByLabelText("Amount"));
        await waitFor(() => {
          expect(screen.getByTestId("amount-error")).toHaveTextContent("Max amount is 0.1234");
        });
      });

      it("doesn't allow values with more decmial places", async () => {
        const decimals = 2;
        render(
          fixture(
            {
              sender: mockAccount,
            },
            mockFA2Token(1, mockAccount, 1, decimals)
          )
        );
        fireEvent.change(screen.getByLabelText("Amount"), { target: { value: "0.00007" } });
        fireEvent.blur(screen.getByLabelText("Amount"));
        await waitFor(() => {
          expect(screen.getByTestId("amount-error")).toHaveTextContent(
            `Please enter a value with up to ${decimals} decimal places`
          );
        });
      });
    });

    describe("single transaction", () => {
      it("opens a sign page if estimation succeeds", async () => {
        const user = userEvent.setup();
        store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockAccount]));
        store.dispatch(assetsSlice.actions.updateTokenBalance([mockTokenRaw]));
        const sender = mockAccount;
        render(
          fixture(
            {
              sender,
              form: {
                sender: sender.address.pkh,
                recipient: mockImplicitAccount(1).address.pkh,
                prettyAmount: "1",
              },
            },
            mockFA2Token(0, mockAccount, 2, 0)
          )
        );
        const submitButton = screen.getByText("Preview");
        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });
        mockEstimatedFee(100);
        const operations = makeAccountOperations(sender, mockAccount, [
          {
            type: "fa2",
            amount: "1",
            sender: sender.address,
            recipient: mockImplicitAccount(1).address,
            contract: parseContractPkh(mockToken.contract),
            tokenId: mockToken.tokenId,
          },
        ]);

        await act(() => user.click(submitButton));

        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <SignPage
            data={{ token: mockFA2Token(0, mockAccount, 2, 0) }}
            fee={new BigNumber(100)}
            goBack={expect.any(Function)}
            mode="single"
            operations={operations}
          />
        );
        expect(mockToast).not.toHaveBeenCalled();
      });
    });
  });
});
