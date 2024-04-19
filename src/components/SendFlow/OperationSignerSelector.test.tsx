import { FormProvider, useForm } from "react-hook-form";

import { OperationSignerSelector } from "./OperationSignerSelector";
import {
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { render, renderHook, screen } from "../../mocks/testUtils";
import { MultisigAccount } from "../../types/Account";
import { RawPkh } from "../../types/Address";
import { multisigsSlice } from "../../utils/redux/slices/multisigsSlice";
import { store } from "../../utils/redux/store";

describe("OperationSignerSelector", () => {
  it("is hidden for implicit operations", () => {
    render(
      <OperationSignerSelector
        isLoading={false}
        operationType="implicit"
        reEstimate={jest.fn()}
        sender={mockImplicitAccount(0)}
      />
    );
    expect(screen.queryByTestId("signer-selector")).not.toBeInTheDocument();
  });

  describe("proposal operations", () => {
    it("allows only owned multisig signers to be chosen", () => {
      [mockMnemonicAccount(0), mockMnemonicAccount(1)].forEach(addAccount);
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
            isLoading={false}
            operationType="proposal"
            reEstimate={reEstimateSpy}
            sender={multisigAccount}
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
