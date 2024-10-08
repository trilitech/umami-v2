import { noop } from "lodash";

import { EnterAndConfirmPassword } from "./EnterAndConfirmPassword";
import { act, render, screen, userEvent } from "../../../../mocks/testUtils";

const mockPassword = "Qwerty123123!23vcxz";

const fixture = (isLoading: boolean) => (
  <EnterAndConfirmPassword isLoading={isLoading} onSubmit={noop} />
);

const checkPasswords = async (password: string, confirmation: string, expected: boolean) => {
  const user = userEvent.setup();
  const submit = screen.getByRole("button", { name: /submit/i });
  expect(submit).toBeDisabled();

  const passwordField = screen.getByTestId("password");
  const confirmationField = screen.getByTestId("confirmation");
  await act(() => user.type(passwordField, password));
  await act(() => user.type(confirmationField, confirmation));

  expected ? expect(submit).toBeEnabled() : expect(submit).toBeDisabled();
};

describe("<EnterAndConfirmPassword />", () => {
  describe("Form", () => {
    test("Working verification", async () => {
      render(fixture(false));
      await checkPasswords(mockPassword, mockPassword, true);
    });

    test("Not matching password", async () => {
      render(fixture(false));
      await checkPasswords(mockPassword, "password1", false);
    });

    test("Form is loading", () => {
      render(fixture(true));
      const submit = screen.getByRole("button", { name: /submit/i });
      expect(submit).toBeDisabled();
    });
  });
});
