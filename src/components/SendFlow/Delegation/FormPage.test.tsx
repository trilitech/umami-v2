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
import { makeAccountOperations } from "../../../types/AccountOperations";
import { DynamicModalContext } from "../../DynamicModal";
import { dynamicModalContextMock } from "../../../mocks/dynamicModal";
import { estimate } from "../../../utils/tezos";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { FormPageProps } from "../utils";
import assetsSlice from "../../../utils/redux/slices/assetsSlice";

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

      expect(screen.getByLabelText("From")).toHaveValue(mockImplicitAccount(0).address.pkh);
      expect(screen.getByLabelText("From")).toBeDisabled();
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
        expect(screen.getByLabelText("From")).toHaveValue(mockImplicitAccount(0).address.pkh);
      });
      expect(screen.getByLabelText("From")).toBeEnabled();
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
        expect(screen.getByLabelText("From")).toHaveValue(mockImplicitAccount(0).address.pkh);
      });
      expect(screen.getByLabelText("From")).toBeDisabled();
    });

    it("displays delegate for address who is not delegating", async () => {
      const sender = mockImplicitAccount(0);
      render(
        fixture({
          sender,
        })
      );

      await waitFor(() => {
        expect(screen.getByText("Delegate")).toBeInTheDocument();
      });
    });

    it("displays change baker for address who is delegating", async () => {
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
      render(
        fixture({
          sender,
        })
      );

      await waitFor(() => {
        expect(screen.getByText("Change Baker")).toBeInTheDocument();
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
            baker: mockImplicitAccount(1).address.pkh,
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
              baker: mockImplicitAccount(1).address.pkh,
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
          type: "delegation",
          sender: sender.address,
          recipient: mockImplicitAccount(1).address,
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
