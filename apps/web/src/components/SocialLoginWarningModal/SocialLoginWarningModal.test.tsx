import { SocialLoginWarningModal } from "./SocialLoginWarningModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../testUtils";

beforeEach(() => {
  localStorage.clear();
});

describe("<SocialLoginWarningModal />", () => {
  it("renders the modal with correct title and content", async () => {
    await renderInModal(<SocialLoginWarningModal />);

    await waitFor(() => {
      expect(screen.getByText("Important notice about your social account wallet")).toBeVisible();
    });

    expect(
      screen.getByText(
        "Wallets created with social accounts depend on those accounts to function. Losing access to this social account will result in loosing the wallet. Enable two-factor authentication to protect your social accounts."
      )
    ).toBeVisible();
  });

  it("disables 'Continue' button when checkbox is not checked", async () => {
    await renderInModal(<SocialLoginWarningModal />);

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toBeDisabled();
  });

  it("enables 'Continue' button when checkbox is checked", async () => {
    const user = userEvent.setup();
    await renderInModal(<SocialLoginWarningModal />);

    const checkbox = screen.getByRole("checkbox", {
      name: "I understand and accept the risks.",
    });
    await act(() => user.click(checkbox));

    const continueButton = screen.getByRole("button", { name: "Continue" });
    expect(continueButton).toBeEnabled();
  });

  it("toggles checkbox state correctly", async () => {
    const user = userEvent.setup();
    await renderInModal(<SocialLoginWarningModal />);

    const checkbox = screen.getByRole("checkbox", {
      name: "I understand and accept the risks.",
    });

    expect(checkbox).not.toBeChecked();

    await act(() => user.click(checkbox));
    expect(checkbox).toBeChecked();

    await act(() => user.click(checkbox));
    expect(checkbox).not.toBeChecked();
  });
});
