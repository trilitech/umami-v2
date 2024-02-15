import { FormProvider, useForm } from "react-hook-form";

import { PasswordInput } from "./PasswordInput";
import { act, render, renderHook, screen, userEvent } from "../mocks/testUtils";

type FormFields = { destination: string };

const fixture = () => {
  const view = renderHook(() => useForm<FormFields>({ defaultValues: { destination: "" } }));
  return (
    <FormProvider {...view.result.current}>
      <PasswordInput inputName="password" />
    </FormProvider>
  );
};

describe("<PasswordInput/>", () => {
  it("hides password by default", () => {
    render(fixture());

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
  });

  it("shows password on click icon", async () => {
    const user = userEvent.setup();
    render(fixture());

    await act(() => user.click(screen.getByTestId("eye-icon")));

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("eye-slash-icon")).toBeInTheDocument();
  });

  it("shows and hide password on click icon", async () => {
    const user = userEvent.setup();
    render(fixture());

    await act(() => user.click(screen.getByTestId("eye-icon")));

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");

    await act(() => user.click(screen.getByTestId("eye-slash-icon")));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });
});
