import { noop } from "lodash";

import { EnterPassword } from "./EnterPassword";
import { act, render, screen, userEvent } from "../../../../mocks/testUtils";

const mockPassword = "Qwerty123123!23vcxz";

const fixture = (isLoading: boolean) => <EnterPassword isLoading={isLoading} onSubmit={noop} />;

const checkPasswords = async (password: string, expected: boolean) => {
  const user = userEvent.setup();
  const submit = screen.getByRole("button", { name: /submit/i });
  expect(submit).toBeDisabled();

  const passwordField = screen.getByTestId("password");
  await act(() => user.type(passwordField, password));
  expected ? expect(submit).toBeEnabled() : expect(submit).toBeDisabled();
};

describe("<EnterPassword />", () => {
  describe("Form", () => {
    test("Working verification", async () => {
      render(fixture(false));
      await checkPasswords(mockPassword, true);
    });

    test("Form is loading", () => {
      render(fixture(true));

      const submit = screen.getByRole("button", { name: /submit/i });
      expect(submit).toBeDisabled();
    });
  });
});
