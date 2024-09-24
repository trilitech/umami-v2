import { FormProvider, useForm, useFormContext } from "react-hook-form";

import { usePasswordValidation } from "./usePasswordValidation";
import { act, render, screen, userEvent } from "../testUtils";

const password = {
  wrong: "123123",
  weak: "Qwerty1231231",
  medium: "Qwerty123123!23",
  strong: "Qwerty123123!23vcxz",
};

const TestComponent = () => {
  const { validatePassword, PasswordStrengthBar } = usePasswordValidation();
  const { register } = useFormContext();

  return (
    <>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="text"
        {...register("password", {
          validate: validatePassword,
        })}
      />
      {PasswordStrengthBar}
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
    [password.weak, "Weak"],
    [password.medium, "Medium"],
    [password.strong, "Strong"],
  ])("should update PasswordStrengthBar based on score", async (password, text) => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await act(() => user.type(screen.getByLabelText("Password"), password));
    expect(screen.getByTestId(`password-strength-${text}`)).toBeVisible();
  });

  it("should not display password strength text if there is a password error", async () => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await act(() => user.type(screen.getByLabelText("Password"), password.wrong));

    expect(screen.queryByTestId("password-strength-text")).not.toBeInTheDocument();
  });
});
