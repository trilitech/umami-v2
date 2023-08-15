import { Modal } from "@chakra-ui/react";
import { render } from "../../mocks/testUtils";
import ChangePasswordFrom from "./ChangePasswordForm";
import { fireEvent, screen, waitFor } from "@testing-library/react";
const fixture = () => {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <ChangePasswordFrom onSubmitChangePassword={() => {}} isLoading={false} />
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

    it("requires 8 charactor", async () => {
      render(fixture());
      const newPaswordInput = screen.getByTestId("new-password");
      fireEvent.change(newPaswordInput, { target: { value: "myPass" } });
      fireEvent.blur(newPaswordInput);
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
      const newPaswordInput = screen.getByTestId("new-password");
      const newPaswordConfirmationInput = screen.getByTestId("new-password-confirmation");
      fireEvent.change(newPaswordInput, { target: { value: "myPassword" } });
      fireEvent.change(newPaswordConfirmationInput, { target: { value: "myWrongPassword" } });
      fireEvent.blur(newPaswordConfirmationInput);
      await waitFor(() => {
        expect(screen.getByTestId("new-password-confirmation-error")).toHaveTextContent(
          "Your new passwords do no match"
        );
      });
    });
  });
});
