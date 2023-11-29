import { Modal } from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import { FormPage, FormValues } from "./FormPage";
import { SignPage } from "./SignPage";
import { dynamicModalContextMock } from "../../../mocks/dynamicModal";
import { mockImplicitAccount, mockMnemonicAccount, mockNFT } from "../../../mocks/factories";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { parseContractPkh } from "../../../types/Address";
import { NFTBalance } from "../../../types/TokenBalance";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { store } from "../../../utils/redux/store";
import { DynamicModalContext } from "../../DynamicModal";
import { FormPagePropsWithSender } from "../utils";

const fixture = (props: FormPagePropsWithSender<FormValues>, nft: NFTBalance = mockNFT(1, "1")) => (
  <Modal isOpen={true} onClose={() => {}}>
    <FormPage {...props} nft={nft} />
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
          sender: mockImplicitAccount(0),
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            quantity: 1,
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
      expect(screen.getByTestId("quantity-input")).toHaveValue(1);
    });
  });

  describe("nft", () => {
    it("displays the correct name", async () => {
      render(
        fixture(
          {
            sender: mockImplicitAccount(0),
          },
          mockNFT(1, "10")
        )
      );

      await waitFor(() => {
        expect(screen.getByTestId("nft-owned")).toHaveTextContent("10");
      });
      expect(screen.getByTestId("nft-name")).toHaveTextContent(mockNFT(1).metadata.name as string);
    });

    it("renders the correct balance", async () => {
      render(
        fixture(
          {
            sender: mockImplicitAccount(0),
          },
          mockNFT(1, "10")
        )
      );

      await waitFor(() => {
        expect(screen.getByTestId("nft-owned")).toHaveTextContent("10");
      });
      expect(screen.getByTestId("out-of-nft")).toHaveTextContent("10");
    });
  });

  describe("validation", () => {
    describe("To", () => {
      it("is required", async () => {
        render(
          fixture({
            sender: mockImplicitAccount(0),
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
            sender: mockImplicitAccount(0),
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
          target: { value: mockImplicitAccount(0).address.pkh },
        });

        await waitFor(() => {
          expect(screen.queryByTestId("recipient-error")).not.toBeInTheDocument();
        });
      });
    });

    describe("quantity", () => {
      it("doesn't allow values < 1", async () => {
        render(
          fixture({
            sender: mockImplicitAccount(0),
          })
        );
        fireEvent.change(screen.getByTestId("quantity-input"), { target: { value: "0" } });
        fireEvent.blur(screen.getByTestId("quantity-input"));
        await waitFor(() => {
          expect(screen.getByTestId("quantity-error")).toHaveTextContent("Min quantity is 1");
        });
      });

      it("doesn't allow values above the nft balance", async () => {
        render(
          fixture(
            {
              sender: mockImplicitAccount(0),
            },
            mockNFT(1, "5")
          )
        );
        fireEvent.change(screen.getByTestId("quantity-input"), { target: { value: "7" } });
        fireEvent.blur(screen.getByTestId("quantity-input"));
        await waitFor(() => {
          expect(screen.getByTestId("quantity-error")).toHaveTextContent("Max quantity is 5");
        });
      });
    });

    describe("single transaction", () => {
      it("opens a sign page if estimation succeeds", async () => {
        store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
        const sender = mockImplicitAccount(0);
        render(
          <DynamicModalContext.Provider value={dynamicModalContextMock}>
            {fixture({
              sender,
              form: {
                sender: sender.address.pkh,
                recipient: mockImplicitAccount(1).address.pkh,
                quantity: 1,
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
          {
            type: "fa2",
            amount: "1",
            sender: sender.address,
            recipient: mockImplicitAccount(1).address,
            contract: parseContractPkh(mockNFT(1).contract),
            tokenId: mockNFT(1).tokenId,
          },
        ]);
        await waitFor(() => {
          expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
            <SignPage
              data={{ nft: mockNFT(1) }}
              fee={new BigNumber(100)}
              goBack={expect.any(Function)}
              mode="single"
              operations={operations}
            />
          );
        });
        expect(mockToast).not.toHaveBeenCalled();
      });
    });
  });
});
