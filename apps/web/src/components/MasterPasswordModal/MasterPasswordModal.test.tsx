import { mockMnemonicAccount, mockSocialAccount } from "@umami/core";

import { MasterPasswordModal } from "./MasterPasswordModal";
import { renderInModal, screen, userEvent, waitFor } from "../../testUtils";

const mockOnSubmit = jest.fn();

describe("<MasterPasswordModal />", () => {
  it("calls onSubmit with entered password when form is submitted", async () => {
    const user = userEvent.setup();
    await renderInModal(<MasterPasswordModal onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText("Password"), "testpassword");
    await waitFor(
      async () => {
        await user.click(screen.getByRole("button", { name: "Submit" }));
      },
      {
        timeout: 5000,
      }
    );

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith("testpassword"));
  });

  it("shows validation error when submitting without a password", async () => {
    const user = userEvent.setup();
    await renderInModal(<MasterPasswordModal onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  describe("when has defaultAccount", () => {
    it("shows social login button if defaultAccount is social", async () => {
      await renderInModal(
        <MasterPasswordModal defaultAccount={mockSocialAccount(0)} onSubmit={mockOnSubmit} />
      );

      await screen.findByTestId("social-login-button");
    });

    it("shows password input if defaultAccount is mnemonic", async () => {
      await renderInModal(
        <MasterPasswordModal defaultAccount={mockMnemonicAccount(0)} onSubmit={mockOnSubmit} />
      );

      await screen.findByLabelText("Password");
    });
  });
});
