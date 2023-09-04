import { Modal } from "@chakra-ui/react";
import { mockDelegation, mockImplicitAccount, mockMultisigAccount } from "../../../mocks/factories";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { mockToast } from "../../../mocks/toast";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import store from "../../../utils/redux/store";
import FormPage, { FormValues } from "./FormPage";
import SignPage from "./SignPage";
import BigNumber from "bignumber.js";
import { makeAccountOperations } from "../../sendForm/types";
import { DynamicModalContext } from "../../DynamicModal";
import { dynamicModalContextMock } from "../../../mocks/dynamicModal";
import { estimate } from "../../../utils/tezos";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { FormPagePropsWithSender } from "../utils";
import assetsSlice from "../../../utils/redux/slices/assetsSlice";

const fixture = (props: FormPagePropsWithSender<FormValues>) => (
  <Modal isOpen={true} onClose={() => {}}>
    <FormPage {...props} />
  </Modal>
);

describe("<Form />", () => {
  describe("default values", () => {
    it("renders a form with a prefilled sender", async () => {
      render(fixture({ sender: mockImplicitAccount(0) }));

      await waitFor(() => {
        expect(screen.getByLabelText("From")).toHaveValue(mockImplicitAccount(0).address.pkh);
      });

      expect(screen.getByLabelText("From")).toBeDisabled();
    });

    it("shows sender baker's tile", async () => {
      const sender = mockImplicitAccount(0);
      const baker = mockImplicitAccount(1);
      store.dispatch(
        assetsSlice.actions.updateBakers([
          { address: baker.address.pkh, name: "baker1", stakingBalance: 1 },
        ])
      );
      store.dispatch(
        assetsSlice.actions.updateDelegations([
          {
            pkh: sender.address.pkh,
            delegation: mockDelegation(0, 1, baker.address.pkh, "baker1"),
          },
        ])
      );
      render(fixture({ sender: mockImplicitAccount(0) }));

      await waitFor(() => {
        expect(screen.getByTestId("baker-tile")).toHaveTextContent("baker1");
      });
    });
  });

  describe("single transaction", () => {
    beforeEach(() => {
      store.dispatch(accountsSlice.actions.addAccount([mockImplicitAccount(0)]));
      store.dispatch(multisigActions.setMultisigs([mockMultisigAccount(0)]));
    });

    it("shows a toast if estimation fails", async () => {
      render(
        fixture({
          sender: mockImplicitAccount(0),
          form: {
            sender: mockImplicitAccount(0).address.pkh,
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

    it("opens a sign page if estimation succeeds", async () => {
      const sender = mockImplicitAccount(0);
      render(
        <DynamicModalContext.Provider value={dynamicModalContextMock}>
          {fixture({
            sender: sender,
            form: {
              sender: sender.address.pkh,
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
      const operations = makeAccountOperations(sender, sender, [
        {
          type: "undelegation",
          sender: sender.address,
        },
      ]);
      await waitFor(() => {
        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <SignPage
            data={undefined}
            mode="single"
            goBack={expect.any(Function)}
            operations={operations}
            fee={new BigNumber(100)}
          />
        );
      });
      expect(mockToast).not.toHaveBeenCalled();
    });
  });
});
