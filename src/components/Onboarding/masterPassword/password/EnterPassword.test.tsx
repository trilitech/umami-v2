import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { EnterPassword } from "./EnterPassword";

const fixture = (onSubmit: (password: string) => void, isLoading: boolean) => (
  <EnterPassword isLoading={isLoading} onSubmit={onSubmit} />
);

const checkPasswords = async (password: string, expectedResult: boolean) => {
  const submit = screen.getByRole("button", { name: /submit/i });
  await waitFor(() => {
    expect(submit).toBeDisabled();
  });
  const passwordField = screen.getByTestId("password");
  fireEvent.change(passwordField, { target: { value: password } });
  await waitFor(() => {
    if (expectedResult) {
      expect(submit).toBeEnabled();
    } else {
      expect(submit).toBeDisabled();
    }
  });
};

describe("<EnterAndConfirmPassword />", () => {
  describe("Form", () => {
    test("Working verification", async () => {
      render(fixture(() => {}, false));
      checkPasswords("test", true);
    });

    test("Not meeting password policy", async () => {
      render(fixture(() => {}, false));
      checkPasswords("tes", true);
    });

    test("Form is loading", async () => {
      render(fixture(() => {}, true));
      const submit = screen.getByRole("button", { name: /submit/i });
      await waitFor(() => {
        expect(submit).toBeDisabled();
      });
    });
  });
});
