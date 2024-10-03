import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { usePasswordValidation } from "./usePasswordValidation";
import { act, render, screen, userEvent } from "../testUtils";

const password = {
  short: "123123",
  noUppercase: "qwerty1231231",
  noNumber: "Qwertykgjfdkjk!",
  noSpecialChar: "Qwerty123123123",
  strong: "Qwerty123123!23vcxz",
};

const TestComponent = () => {
  const { validatePasswordStrength, PasswordStrengthBar } = usePasswordValidation();
  const { formState, register } = useFormContext();

  return (
    <>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="text"
        {...register("password", {
          validate: validatePasswordStrength,
        })}
      />
      {PasswordStrengthBar}
      <span data-testid="password-error">{formState.errors.password?.message as string}</span>
    </>
  );
};

const Wrapper = () => {
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      password: "",
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <TestComponent />
      </form>
    </FormProvider>
  );
};

describe("usePasswordValidation", () => {
  it("should render PasswordStrengthBar with default score", () => {
    render(<Wrapper />);
    expect(screen.queryByTestId("password-strength-text")).not.toBeInTheDocument();
  });

  it.each([
    [password.short, "Password must be at least 12 characters long"],
    [password.noUppercase, "Password must contain at least one uppercase letter"],
    [password.noNumber, "Password must contain at least one number"],
    [password.noSpecialChar, "Password must contain at least one special character"],
  ])("should update PasswordStrengthBar based on score", async (password, text) => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await act(() => user.type(screen.getByLabelText("Password"), password));

    expect(screen.queryByTestId("password-strength-text")).not.toBeInTheDocument();
    expect(screen.getByTestId("password-error")).toHaveTextContent(text);
  });

  it("should display that password is strong if all requirements are met", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await act(() => user.type(screen.getByLabelText("Password"), password.strong));

    expect(screen.getByTestId("password-strength-text")).toHaveTextContent(
      "Your password is strong"
    );
  });
});
