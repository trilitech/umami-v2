import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EnterAndConfirmPassword from "./EnterAndConfirmPassword";

const fixture = (onSubmit: (password: string) => void, isLoading: boolean) => (
  <EnterAndConfirmPassword isLoading={isLoading} onSubmit={onSubmit} />
);

const checkPasswords = async (password: string, confirmation: string, expectedResult: boolean) => {
  const submit = screen.getByRole("button", { name: /submit/i });
  await waitFor(() => {
    expect(submit).toBeDisabled();
  });
  const passwordField = screen.getByTestId("password");
  const confirmationField = screen.getByTestId("confirmation");
  fireEvent.change(passwordField, { target: { value: password } });
  fireEvent.change(confirmationField, { target: { value: confirmation } });
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
      checkPasswords("test", "test", true);
    });

    test("Not matching password", async () => {
      render(fixture(() => {}, false));
      checkPasswords("test", "test1", false);
    });

    test("Not meeting password policy", async () => {
      render(fixture(() => {}, false));
      checkPasswords("tes", "tes", false);
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
