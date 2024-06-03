import { FormProvider, useForm } from "react-hook-form";

import { AdvancedSettingsAccordion } from "./AdvancedSettingsAccordion";
import { act, render, screen, userEvent } from "../mocks/testUtils";

const TestComponent = () => {
  const form = useForm({
    defaultValues: {
      executeParams: { fee: 100, storageLimit: 0, gasLimit: 0 },
    },
  });

  return (
    <FormProvider {...form}>
      <input
        {...form.register("executeParams.fee")}
        data-testid="real-fee-input"
        type="number"
      />
      <AdvancedSettingsAccordion />
    </FormProvider>
  );
};

describe("<AdvancedSettingsAccordion />", () => {
  it("renders without crashing", () => {
    render(<TestComponent />);
    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("renders fee input with correct value", () => {
    render(<TestComponent />);
    const feeInput = screen.getByLabelText("Fee");

    expect(feeInput).toHaveValue(0.0001);
  });

  it("updates fee value on change", async () => {
    const user = userEvent;
    render(<TestComponent />);

    await act(() =>
      user.click(screen.getByRole("button", { name: "Advanced" }))
    );

    const feeInput = screen.getByLabelText("Fee");

    await act(() => user.clear(feeInput));

    await act(() => user.type(feeInput, "0.000001"));

    expect(screen.getByTestId("real-fee-input")).toHaveValue(1);

    expect(feeInput).toHaveValue(0.000001);
  });

  it("updates gas limit value on change", async () => {
    const user = userEvent;
    render(<TestComponent />);
    await act(() =>
      user.click(screen.getByRole("button", { name: "Advanced" }))
    );

    const gasLimitInput = screen.getByLabelText("Gas Limit");

    await act(() => user.type(gasLimitInput, "1000"));

    expect(gasLimitInput).toHaveValue(1000);
  });

  it("updates storage limit value on change", async () => {
    const user = userEvent;
    render(<TestComponent />);
    await act(() =>
      user.click(screen.getByRole("button", { name: "Advanced" }))
    );

    const storageLimitInput = screen.getByLabelText("Storage Limit");

    await act(() => user.type(storageLimitInput, "1000"));

    expect(storageLimitInput).toHaveValue(1000);
  });
});
