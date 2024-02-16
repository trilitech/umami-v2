import { Modal } from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import { FormPage, FormValues } from "./FormPage";
import { SignPage } from "./SignPage";
import { dynamicModalContextMock } from "../../../mocks/dynamicModal";
import {
  mockImplicitAccount,
  mockImplicitAddress,
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
import { FormPagePropsWithSender } from "../utils";

const fixture = (props: FormPagePropsWithSender<FormValues>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <FormPage {...props} />
  </Modal>
);

describe("<Form />", () => {
  describe("default values", () => {
    it("renders a form with a prefilled sender", () => {
      render(fixture({ sender: mockImplicitAccount(0) }));

      expect(screen.getAllByTestId("address-tile")[0]).toHaveTextContent(
        mockImplicitAccount(0).address.pkh
      );
    });

    it("shows address tile for baker", () => {
      const sender = mockImplicitAccount(0);
      const baker = mockImplicitAccount(1);
      store.dispatch(
        assetsSlice.actions.updateBakers([
          { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
        ])
      );

      render(
        fixture({
          sender: sender,
          form: {
            sender: sender.address.pkh,
            baker: baker.address.pkh,
          },
        })
      );

      expect(screen.getAllByTestId("address-tile")[1]).toHaveTextContent("baker1");
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

      const estimateMock = jest.mocked(estimate);
      estimateMock.mockRejectedValue(new Error("Some error occurred"));

      const submitButton = screen.getByText("Preview");
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
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
              baker: mockImplicitAddress(2).pkh,
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
          type: "undelegation",
          sender: sender.address,
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
