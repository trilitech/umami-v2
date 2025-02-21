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
  const errors: { [key: string]: string } = {
    uppercase: "At least one uppercase letter",
    number: "At least one number",
    special: 'At least one special character: !@#$%^&*(),.?":{}|<>',
    minlength: "At least 12 characters long",
    simplicity: "Good complexity, no simple sequences or patterns",
  };

  it.each([
    {
      password: "123",
      passed: ["number"],
      failed: ["uppercase", "special", "minlength", "simplicity"],
    },
    {
      password: "1234567890a!",
      passed: ["number", "special", "minlength"],
      failed: ["uppercase", "simplicity"],
    },
    {
      password: "1234567890a-=A",
      passed: ["number", "minlength", "uppercase"],
      failed: ["special", "simplicity"],
    },
    {
      password: "1234567890a-=A!",
      passed: ["number", "minlength", "uppercase", "special"],
      failed: ["simplicity"],
    },
    {
      password: "1234567890a-=A!get",
      passed: ["number", "minlength", "uppercase", "special"],
      failed: ["simplicity"],
    },
    {
      password: "1234567890a-=A!getg",
      passed: ["number", "minlength", "uppercase", "special", "simplicity"],
      failed: [],
    },
  ])('should update PasswordStrengthBar based on score for "$password" ', async data => {
    const user = userEvent.setup();
    render(<Wrapper />);

    await act(() => user.type(screen.getByLabelText("Password"), data.password));

    for (const passed of data.passed) {
      expect(screen.getByTestId(`${passed}-passed`)).toHaveTextContent(errors[passed]);
    }
    for (const failed of data.failed) {
      expect(screen.getByTestId(`${failed}-failed`)).toHaveTextContent(errors[failed]);
    }
  });
});
