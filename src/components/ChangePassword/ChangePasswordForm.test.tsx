import { Modal } from "@chakra-ui/react";
import { render } from "../../mocks/testUtils";
import ChangePasswordFrom from "./ChangePasswordForm";
import { fireEvent, screen, waitFor } from "@testing-library/react";
const fixture = () => {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ChangePasswordFrom />
    </Modal>
  );
};

describe("ChangePassword Form", () => {
  describe("currentPassword", () => {
    it("is empty by default", () => {
      render(fixture());
      expect(screen.getByLabelText("Current Password")).toHaveValue("");
    });

    it("is required", async () => {
      render(fixture());

      fireEvent.blur(screen.getByLabelText("Current Password"));
      await waitFor(() => {
        expect(screen.getByTestId("current-password-error")).toHaveTextContent(
          "Current password is required"
        );
      });
    });
  });
  describe("newPassword", () => {
    it("is empty by default", () => {
      render(fixture());
      expect(screen.getByTestId("new-password")).toHaveValue("");
    });

    it("is required", async () => {
      render(fixture());

      fireEvent.blur(screen.getByTestId("new-password"));
      await waitFor(() => {
        expect(screen.getByTestId("new-password-error")).toHaveTextContent(
          "New password is required"
        );
      });
    });

    it("requires 8 characters", async () => {
      render(fixture());
      const newPasswordInput = screen.getByTestId("new-password");
      fireEvent.change(newPasswordInput, { target: { value: "myPass" } });
      fireEvent.blur(newPasswordInput);
      await waitFor(() => {
        expect(screen.getByTestId("new-password-error")).toHaveTextContent(
          "Your password must be at least 8 characters long"
        );
      });
    });
  });
  describe("newPasswordConfirmation", () => {
    it("is empty by default", () => {
      render(fixture());
      expect(screen.getByTestId("new-password-confirmation")).toHaveValue("");
    });

    it("is required", async () => {
      render(fixture());

      fireEvent.blur(screen.getByTestId("new-password-confirmation"));
      await waitFor(() => {
        expect(screen.getByTestId("new-password-confirmation-error")).toHaveTextContent(
          "Confirmation is required"
        );
      });
    });

    it("requires same password", async () => {
      render(fixture());
      const newPasswordInput = screen.getByTestId("new-password");
      const newPasswordConfirmationInput = screen.getByTestId("new-password-confirmation");
      fireEvent.change(newPasswordInput, { target: { value: "myPassword" } });
      fireEvent.change(newPasswordConfirmationInput, { target: { value: "myWrongPassword" } });
      fireEvent.blur(newPasswordConfirmationInput);
      await waitFor(() => {
        expect(screen.getByTestId("new-password-confirmation-error")).toHaveTextContent(
          "Your new passwords do no match"
        );
      });
    });
  });

  describe("Submit Button", () => {
    it("Submit Button is enabled with valid form", async () => {
      render(fixture());
      const currentPasswordInput = screen.getByTestId("current-password");
      const newPasswordInput = screen.getByTestId("new-password");
      const newPasswordConfirmationInput = screen.getByTestId("new-password-confirmation");
      fireEvent.change(currentPasswordInput, { target: { value: "myOldPassword" } });
      fireEvent.change(newPasswordInput, { target: { value: "myNewPassword" } });
      fireEvent.change(newPasswordConfirmationInput, { target: { value: "myNewPassword" } });
      const submitBtn = screen.getByRole("button", { name: "Update Password" });
      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });
    });
  });
});
