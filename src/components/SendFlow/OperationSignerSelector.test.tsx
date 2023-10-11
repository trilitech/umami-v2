import { FormProvider, useForm } from "react-hook-form";
import {
  mockImplicitAccount,
  mockImplicitAddress,
  mockMultisigAccount,
} from "../../mocks/factories";
import { render, renderHook, screen } from "../../mocks/testUtils";
import { OperationSignerSelector } from "./OperationSignerSelector";
import { RawPkh } from "../../types/Address";
import store from "../../utils/redux/store";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import multisigsSlice from "../../utils/redux/slices/multisigsSlice";
import { MultisigAccount } from "../../types/Account";

describe("OperationSignerSelector", () => {
  it("is hidden for implicit operations", () => {
    render(
      <OperationSignerSelector
        sender={mockImplicitAccount(0)}
        operationType="implicit"
        isLoading={false}
        reEstimate={jest.fn()}
      />
    );
    expect(screen.queryByTestId("signer-selector")).not.toBeInTheDocument();
  });

  describe("proposal operations", () => {
    it("allows only owned multisig signers to be chosen", () => {
      store.dispatch(
        accountsSlice.actions.addAccount([mockImplicitAccount(0), mockImplicitAccount(1)])
      );
      const multisigAccount: MultisigAccount = {
        ...mockMultisigAccount(0),
        signers: [
          mockImplicitAccount(0).address,
          mockImplicitAccount(1).address,
          mockImplicitAccount(2).address,
        ],
      };
      store.dispatch(multisigsSlice.actions.setMultisigs([multisigAccount]));

      const { result } = renderHook(() =>
        useForm<{ signer: RawPkh }>({
          // it's assumed that we don't preselect an invalid signer
          defaultValues: { signer: mockImplicitAddress(0).pkh },
        })
      );

      const reEstimateSpy = jest.fn();

      render(
        <FormProvider {...result.current}>
          <OperationSignerSelector
            sender={multisigAccount}
            operationType="proposal"
            isLoading={false}
            reEstimate={reEstimateSpy}
          />
        </FormProvider>
      );

      // there is no input, just a select box
      expect(screen.getByTestId("signer-selector")).toBeInTheDocument();
      expect(screen.queryByLabelText("signer")).not.toBeInTheDocument();
      const realSignerValue = screen.getByTestId("real-address-input-signer");

      expect(realSignerValue).toHaveValue(mockImplicitAddress(0).pkh);

      // fireEvent.click(screen.getByTestId(/selected-address-tile-/));

      // expect(screen.getByTestId("suggestions-list")).toBeInTheDocument();

      // fireEvent.change(accountSelector, { target: { value: mockImplicitAddress(0).pkh } });
      // fireEvent.blur(accountSelector);
      // expect(reEstimateSpy).toHaveBeenCalledWith(mockImplicitAddress(0).pkh);
    });
  });
});
