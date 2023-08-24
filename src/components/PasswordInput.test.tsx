import PasswordInput from "./PasswordInput";
import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
type FormFields = { destination: string };

const fixture = () => {
  const view = renderHook(() => useForm<FormFields>({ defaultValues: { destination: "" } }));
  return (
    <FormProvider {...view.result.current}>
      <PasswordInput inputName="password" label="Password" />
    </FormProvider>
  );
};

describe("<PasswordInput/>", () => {
  it("hides password by default", async () => {
    render(fixture());
    await waitFor(() => {
      expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    });
    expect(screen.getByTestId("eye-icon")).toBeInTheDocument();
  });
  it("shows password on click icon", async () => {
    render(fixture());
    const iconButton = screen.getByTestId("eye-icon");
    fireEvent.click(iconButton);

    await waitFor(() => {
      expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    });
    expect(screen.getByTestId("eye-slash-icon")).toBeInTheDocument();
  });
});
