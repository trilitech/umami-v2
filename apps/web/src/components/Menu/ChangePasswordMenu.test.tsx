import { changeMnemonicPassword } from "@umami/state";

import { ChangePasswordMenu } from "./ChangePasswordMenu";
import { fireEvent, renderInDrawer, screen, userEvent, waitFor } from "../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useAppDispatch: () => jest.fn(),
  changeMnemonicPassword: jest.fn(),
}));

describe("<ChangePasswordMenu />", () => {
  describe("currentPassword", () => {
    it("is empty by default", async () => {
      await renderInDrawer(<ChangePasswordMenu />);
      expect(screen.getByLabelText("Current Password")).toHaveValue("");
    });

    it("is required", async () => {
      await renderInDrawer(<ChangePasswordMenu />);

      fireEvent.blur(screen.getByLabelText("Current Password"));

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

    it("requires 8 characters", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<ChangePasswordMenu />);

      const newPasswordInput = screen.getByTestId("new-password");
      await user.type(newPasswordInput, "myPass");
      fireEvent.blur(newPasswordInput);

      await waitFor(() => {
        expect(screen.getByTestId("new-password-error")).toHaveTextContent(
          "Your password must be at least 8 characters long"
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
  });

  describe("Submit Button", () => {
    it("is enabled with valid form", async () => {
      const user = userEvent.setup();

      await renderInDrawer(<ChangePasswordMenu />);
      const currentPasswordInput = screen.getByTestId("current-password");
      const newPasswordInput = screen.getByTestId("new-password");
      const newPasswordConfirmationInput = screen.getByTestId("new-password-confirmation");

      await user.type(currentPasswordInput, "myOldPassword");
      await user.type(newPasswordInput, "myNewPassword");
      await user.type(newPasswordConfirmationInput, "myNewPassword");

      expect(screen.getByRole("button", { name: "Update Password" })).toBeEnabled();
    });

    it("submits the new password", async () => {
      const user = userEvent.setup();

      await renderInDrawer(<ChangePasswordMenu />);
      const currentPasswordInput = screen.getByTestId("current-password");
      const newPasswordInput = screen.getByTestId("new-password");
      const newPasswordConfirmationInput = screen.getByTestId("new-password-confirmation");

      await user.type(currentPasswordInput, "myOldPassword");
      await user.type(newPasswordInput, "myNewPassword");
      await user.type(newPasswordConfirmationInput, "myNewPassword");

      await user.click(screen.getByRole("button", { name: "Update Password" }));

      expect(changeMnemonicPassword).toHaveBeenCalledWith({
        currentPassword: "myOldPassword",
        newPassword: "myNewPassword",
      });
    });
  });
});
