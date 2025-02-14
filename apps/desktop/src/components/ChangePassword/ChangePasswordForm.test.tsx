import { Modal } from "@chakra-ui/react";

import { ChangePasswordForm } from "./ChangePasswordForm";
import { fireEvent, render, screen, waitFor } from "../../mocks/testUtils";
const fixture = () => (
  <Modal isOpen={true} onClose={() => {}}>
    <ChangePasswordForm />
  </Modal>
);

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
      fireEvent.change(newPasswordInput, { target: { value: "myNewPassword123L!" } });
      fireEvent.change(newPasswordConfirmationInput, { target: { value: "myNewPassword123L!" } });

      await waitFor(() => {
        expect(screen.getByRole("button", { name: "Update Password" })).toBeEnabled();
      });
    });
  });
});
