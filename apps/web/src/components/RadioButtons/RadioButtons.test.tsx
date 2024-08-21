import { Box } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { RadioButtons } from "./RadioButtons";
import { act, render, screen, userEvent } from "../../testUtils";

const TestComponent = ({
  options,
  defaultValue,
  onSelect,
}: {
  options: string[];
  defaultValue: string;
  onSelect?: (value: string) => void;
}) => {
  const form = useForm({ mode: "onBlur", defaultValues: { value: defaultValue } });

  return (
    <FormProvider {...form}>
      <form>
        <RadioButtons inputName="value" onSelect={onSelect} options={options} />
        <Box data-testid="current-value">{form.watch("value")}</Box>
      </form>
    </FormProvider>
  );
};
describe("<RadioButtons />", () => {
  it("renders all options", () => {
    const options = ["1", "2", "3", "4"];

    render(<TestComponent defaultValue="1" options={options} />);

    options.forEach(option => {
      expect(screen.getByRole("button", { name: String(option) })).toBeVisible();
    });
  });

  it("selects the default button", () => {
    const options = ["1", "2", "3", "4"];

    render(<TestComponent defaultValue="2" options={options} />);

    expect(screen.getByTestId("radio-button-selected")).toHaveTextContent("2");
  });

  it("changes the value on a button click", async () => {
    const user = userEvent.setup();
    const options = ["1", "2", "3", "4"];

    render(<TestComponent defaultValue="3" options={options} />);

    await act(() => user.click(screen.getByRole("button", { name: "2" })));

    expect(screen.getByTestId("radio-button-selected")).toHaveTextContent("2");
    expect(screen.getByTestId("current-value")).toHaveTextContent("2");
  });

  it("calls onSelect when a button is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const options = ["1", "2", "3", "4"];

    render(<TestComponent defaultValue="3" onSelect={onSelect} options={options} />);

    await act(() => user.click(screen.getByRole("button", { name: "2" })));
    expect(onSelect).toHaveBeenCalledWith("2");
  });
});
