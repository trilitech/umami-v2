import { changeMnemonicPassword } from "@umami/state";

import { ChangePasswordMenu } from "./ChangePasswordMenu";
import { fireEvent, renderInDrawer, screen, userEvent, waitFor } from "../../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useAppDispatch: () => jest.fn(),
  changeMnemonicPassword: jest.fn(),
}));

const currentPassword = "Qwerty123123!23vcxz";
const newPassword = "Qwerty123123!23vcxz32llll";

describe("<ChangePasswordMenu />", () => {
  describe("currentPassword", () => {
    it("is empty by default", async () => {
      await renderInDrawer(<ChangePasswordMenu />);
      expect(screen.getByLabelText("Current password")).toHaveValue("");
    });

    it("is required", async () => {
      await renderInDrawer(<ChangePasswordMenu />);

      fireEvent.blur(screen.getByLabelText("Current password"));

      await waitFor(() => {
        expect(screen.getByTestId("current-password-error")).toHaveTextContent(
          "Current password is required"
        );
      });
    });
  });
  describe("newPassword", () => {
    it("is empty by default", async () => {
      await renderInDrawer(<ChangePasswordMenu />);

      expect(screen.getByTestId("new-password")).toHaveValue("");
    });

    it("is required", async () => {
      await renderInDrawer(<ChangePasswordMenu />);

      fireEvent.blur(screen.getByTestId("new-password"));

      await waitFor(() => {
        expect(screen.getByTestId("new-password-error")).toHaveTextContent(
          "New password is required"
        );
      });
    });
  });
  describe("newPasswordConfirmation", () => {
    it("is empty by default", async () => {
      await renderInDrawer(<ChangePasswordMenu />);

      expect(screen.getByTestId("new-password-confirmation")).toHaveValue("");
    });

    it("is required", async () => {
      await renderInDrawer(<ChangePasswordMenu />);

      fireEvent.blur(screen.getByTestId("new-password-confirmation"));

      await waitFor(() => {
        expect(screen.getByTestId("new-password-confirmation-error")).toHaveTextContent(
          "Confirmation is required"
        );
      });
    });

    it("requires same password", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<ChangePasswordMenu />);
      const newPasswordInput = screen.getByTestId("new-password");
      const newPasswordConfirmationInput = screen.getByTestId("new-password-confirmation");

      await user.type(newPasswordInput, "myPassword");
      await user.type(newPasswordConfirmationInput, "myWrongPassword");
      fireEvent.blur(newPasswordConfirmationInput);

      await waitFor(() => {
        expect(screen.getByTestId("new-password-confirmation-error")).toHaveTextContent(
          "Your new passwords do not match"
        );
      });
    });

    it("requires same password and clears error when fixed", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<ChangePasswordMenu />);

      const newPasswordInput = screen.getByTestId("new-password");
      const newPasswordConfirmationInput = screen.getByTestId("new-password-confirmation");

      // Step 1: Enter mismatched passwords
      await user.type(newPasswordInput, "myPassword");
      await user.type(newPasswordConfirmationInput, "myWrongPassword");
      fireEvent.blur(newPasswordConfirmationInput);

      await waitFor(() => {
        expect(screen.getByTestId("new-password-confirmation-error")).toHaveTextContent(
          "Your new passwords do not match"
        );
      });

      // Step 2: Fix the password confirmation
      await user.clear(newPasswordConfirmationInput);
      await user.type(newPasswordConfirmationInput, "myPassword");
      fireEvent.blur(newPasswordConfirmationInput);

      await waitFor(() => {
        expect(screen.queryByTestId("new-password-confirmation-error")).not.toBeInTheDocument();
      });

      // Step 3: Change `newPassword` after confirmation
      await user.clear(newPasswordInput);
      await user.type(newPasswordInput, "newSecurePassword");
      fireEvent.blur(newPasswordInput);

      await waitFor(() => {
        expect(screen.getByTestId("new-password-confirmation-error")).toHaveTextContent(
          "Your new passwords do not match"
        );
      });

      // Step 4: Fix the confirmation again
      await user.clear(newPasswordConfirmationInput);
      await user.type(newPasswordConfirmationInput, "newSecurePassword");
      fireEvent.blur(newPasswordConfirmationInput);

      await waitFor(() => {
        expect(screen.queryByTestId("new-password-confirmation-error")).not.toBeInTheDocument();
      });
    });
  });

  describe("Submit Button", () => {
    it("is enabled with valid form", async () => {
      const user = userEvent.setup();

      await renderInDrawer(<ChangePasswordMenu />);
      const currentPasswordInput = screen.getByTestId("current-password");
      const newPasswordInput = screen.getByTestId("new-password");
      const newPasswordConfirmationInput = screen.getByTestId("new-password-confirmation");

      await user.type(currentPasswordInput, currentPassword);
      await user.type(newPasswordInput, newPassword);
      await user.type(newPasswordConfirmationInput, newPassword);

      expect(screen.getByRole("button", { name: "Update password" })).toBeEnabled();
    });

    it("submits the new password", async () => {
      const user = userEvent.setup();

      await renderInDrawer(<ChangePasswordMenu />);
      const currentPasswordInput = screen.getByTestId("current-password");
      const newPasswordInput = screen.getByTestId("new-password");
      const newPasswordConfirmationInput = screen.getByTestId("new-password-confirmation");

      await user.type(currentPasswordInput, currentPassword);
      await user.type(newPasswordInput, newPassword);
      await user.type(newPasswordConfirmationInput, newPassword);

      await user.click(screen.getByRole("button", { name: "Update password" }));

      expect(changeMnemonicPassword).toHaveBeenCalledWith({
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
    });
  });
});
