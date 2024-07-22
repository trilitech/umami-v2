import {
  type MultisigAccount,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
} from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, multisigsActions } from "@umami/state";
import { type RawPkh, mockImplicitAddress } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { OperationSignerSelector } from "./OperationSignerSelector";
import { render, renderHook, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("OperationSignerSelector", () => {
  it("is hidden for implicit operations", () => {
    render(
      <OperationSignerSelector
        isLoading={false}
        operationType="implicit"
        reEstimate={jest.fn()}
        sender={mockImplicitAccount(0)}
      />,
      { store }
    );
    expect(screen.queryByTestId("signer-selector")).not.toBeInTheDocument();
  });

  describe("proposal operations", () => {
    it("allows only owned multisig signers to be chosen", () => {
      [mockMnemonicAccount(0), mockMnemonicAccount(1)].forEach(account =>
        addTestAccount(store, account)
      );
      const multisigAccount: MultisigAccount = {
        ...mockMultisigAccount(0),
        signers: [
          mockImplicitAccount(0).address,
          mockImplicitAccount(1).address,
          mockImplicitAccount(2).address,
        ],
      };
      store.dispatch(multisigsActions.setMultisigs([multisigAccount]));

      const { result } = renderHook(
        () =>
          useForm<{ signer: RawPkh }>({
            // it's assumed that we don't preselect an invalid signer
            defaultValues: { signer: mockImplicitAddress(0).pkh },
          }),
        { store }
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
        </FormProvider>,
        { store }
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
