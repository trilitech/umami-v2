import { FormProvider, useForm } from "react-hook-form";
import { mockImplicitAccount, mockImplicitAddress } from "../../mocks/factories";
import { render, renderHook, screen } from "../../mocks/testUtils";
import { OperationSignerSelector } from "./OperationSignerSelector";
import { RawPkh } from "../../types/Address";
import { fireEvent } from "@storybook/testing-library";
import store from "../../utils/redux/store";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { multisigs } from "../../mocks/multisig";
import multisigsSlice from "../../utils/redux/slices/multisigsSlice";

describe("OperationSignerSelector", () => {
  it("is hidden for implicit operations", () => {
    render(
      <OperationSignerSelector
        sender={mockImplicitAccount(0)}
        operationType="implicit"
        isDisabled={false}
        reEstimate={jest.fn()}
      />
    );
    expect(screen.queryByTestId("signer-selector")).not.toBeInTheDocument();
  });

  describe("proposal operations", () => {
    it("renders a selector", () => {
      const { result } = renderHook(() =>
        useForm<{ signer: RawPkh }>({
          defaultValues: { signer: mockImplicitAccount(0).address.pkh },
        })
      );

      render(
        <FormProvider {...result.current}>
          <OperationSignerSelector
            sender={mockImplicitAccount(0)}
            operationType="proposal"
            isDisabled={false}
            reEstimate={jest.fn()}
          />
        </FormProvider>
      );
      expect(screen.getByTestId("signer-selector")).toBeInTheDocument();
    });

    it("can disable the underlying selector", () => {
      const { result } = renderHook(() =>
        useForm<{ signer: RawPkh }>({
          defaultValues: { signer: mockImplicitAccount(0).address.pkh },
        })
      );

      render(
        <FormProvider {...result.current}>
          <OperationSignerSelector
            isDisabled
            sender={mockImplicitAccount(0)}
            operationType="proposal"
            reEstimate={jest.fn()}
          />
        </FormProvider>
      );
      expect(screen.getByTestId("signer-selector")).toBeInTheDocument();
      expect(screen.getByLabelText("signer")).toBeDisabled();
    });

    it("allows only owned multisig signers to be chosen", () => {
      store.dispatch(accountsSlice.actions.addAccount([mockImplicitAccount(0)]));
      store.dispatch(
        multisigsSlice.actions.setMultisigs([
          {
            ...multisigs[0],
            signers: [mockImplicitAddress(0), mockImplicitAddress(1)],
          },
        ])
      );

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
            sender={mockImplicitAccount(0)}
            operationType="proposal"
            isDisabled={false}
            reEstimate={reEstimateSpy}
          />
        </FormProvider>
      );
      const selector = screen.getByTestId("signer-selector");
      expect(selector).not.toBeDisabled();
      const accountSelector = screen.getByLabelText("signer");
      const realSignerValue = screen.getByTestId("real-address-input-signer");

      // not in signers
      fireEvent.change(accountSelector, { target: { value: mockImplicitAddress(2).pkh } });
      fireEvent.blur(accountSelector);
      expect(reEstimateSpy).not.toHaveBeenCalled();
      expect(realSignerValue).toHaveValue(mockImplicitAddress(0).pkh);

      // in signers, but not owned
      fireEvent.change(accountSelector, { target: { value: mockImplicitAddress(1).pkh } });
      fireEvent.blur(accountSelector);
      expect(reEstimateSpy).not.toHaveBeenCalled();
      expect(realSignerValue).toHaveValue(mockImplicitAddress(0).pkh);

      fireEvent.change(accountSelector, { target: { value: mockImplicitAddress(0).pkh } });
      fireEvent.blur(accountSelector);
      expect(reEstimateSpy).toHaveBeenCalledWith(mockImplicitAddress(0).pkh);
    });
  });
});
