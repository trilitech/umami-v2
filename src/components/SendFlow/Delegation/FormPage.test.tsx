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
import { act, render, screen, userEvent, waitFor } from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { assetsSlice } from "../../../utils/redux/slices/assetsSlice";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import { store } from "../../../utils/redux/store";
import { estimate } from "../../../utils/tezos";
import { DynamicModalContext } from "../../DynamicModal";
import { FormPageProps } from "../utils";

const fixture = (props: FormPageProps<FormValues>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <FormPage {...props} />
  </Modal>
);

describe("<Form />", () => {
  describe("default values", () => {
    it("renders an empty form by default", () => {
      render(fixture({}));

      expect(screen.getByLabelText("From")).toHaveValue("");
      expect(screen.getByLabelText("From")).toBeEnabled();
    });

    it("renders a form with a prefilled sender", () => {
      render(fixture({ sender: mockImplicitAccount(0) }));

      expect(screen.getByTestId("address-tile")).toHaveTextContent(
        mockImplicitAccount(0).address.pkh
      );
    });

    it("renders a form with default form values", async () => {
      render(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            baker: mockImplicitAccount(1).address.pkh,
          },
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        );
      });
    });

    it("renders a form with default form values but disabled sender if it's provided", async () => {
      render(
        fixture({
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            baker: mockImplicitAccount(1).address.pkh,
          },
          sender: mockImplicitAccount(0),
        })
      );

      await waitFor(() => {
        expect(screen.getByTestId("real-address-input-baker")).toHaveValue(
          mockImplicitAccount(1).address.pkh
        );
      });

      expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
        mockImplicitAccount(0).address.pkh
      );
    });

    it("displays delegate for address who is not delegating", () => {
      const sender = mockImplicitAccount(0);
      render(
        fixture({
          sender,
        })
      );

      expect(screen.getByText("Delegate")).toBeInTheDocument();
    });

    it("displays change baker for address who is delegating", async () => {
      const sender = mockImplicitAccount(0);
      const baker = mockImplicitAccount(1);
      store.dispatch(
        assetsSlice.actions.updateBakers([
          { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
        ])
      );

      render(
        fixture({
          sender,
          form: {
            sender: sender.address.pkh,
            baker: baker.address.pkh,
          },
        })
      );

      await waitFor(() => {
        expect(screen.getByText("Change Baker")).toBeInTheDocument();
      });
    });
  });

  describe("single transaction", () => {
    beforeEach(() => {
      store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
      store.dispatch(multisigActions.setMultisigs([mockMultisigAccount(0)]));
    });

    it("shows a toast if estimation fails", async () => {
      const user = userEvent.setup();
      render(
        fixture({
          sender: mockImplicitAccount(0),
          form: {
            sender: mockImplicitAccount(0).address.pkh,
            baker: mockImplicitAccount(1).address.pkh,
          },
        })
      );
      const submitButton = screen.getByText("Preview");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      const estimateMock = jest.mocked(estimate);
      estimateMock.mockRejectedValue(new Error("Some error occurred"));

      await act(() => user.click(submitButton));

      expect(estimateMock).toHaveBeenCalledTimes(1);
      expect(mockToast).toHaveBeenCalledWith({
        description: "Some error occurred",
        status: "error",
      });
    });

    it("opens a sign page if estimation succeeds", async () => {
      const user = userEvent.setup();
      const sender = mockImplicitAccount(0);
      render(
        <DynamicModalContext.Provider value={dynamicModalContextMock}>
          {fixture({
            sender: sender,
            form: {
              sender: sender.address.pkh,
              baker: mockImplicitAccount(1).address.pkh,
            },
          })}
        </DynamicModalContext.Provider>
      );
      const submitButton = screen.getByText("Preview");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
      mockEstimatedFee(100);
      const operations = makeAccountOperations(sender, sender, [
        {
          type: "delegation",
          sender: sender.address,
          recipient: mockImplicitAccount(1).address,
        },
      ]);

      await act(() => user.click(submitButton));

      expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
        <SignPage
          data={undefined}
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
