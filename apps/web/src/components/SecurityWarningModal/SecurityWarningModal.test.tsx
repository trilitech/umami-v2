import { SecurityWarningModal } from "./SecurityWarningModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../testUtils";

beforeEach(() => {
  localStorage.clear();
});

describe("<SecurityWarningModal />", () => {
  it("renders the modal with correct title and content", async () => {
    await renderInModal(<SecurityWarningModal />);

    await waitFor(() => {
      expect(screen.getByText("Browser Extension Security Tips")).toBeVisible();
    });

    expect(
      screen.getByText(
        "Please carefully review these guidelines to protect your wallet from potential security risks"
      )
    ).toBeVisible();
  });

  it("renders all accordion items", async () => {
    await renderInModal(<SecurityWarningModal />);

    const expectedTitles = [
      "Install extensions only from trusted sources",
      "Review permissions and ratings",
      "Maintain a separate browser for financial activities",
      "Keep your browser updated",
      "Stay alert to social engineering risks",
    ];

    expectedTitles.forEach(title => {
      expect(screen.getByText(title)).toBeVisible();
    });
  });

  it("disables 'Continue' button when checkbox is not checked", async () => {
    await renderInModal(<SecurityWarningModal />);

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toBeDisabled();
  });

  it("enables 'Continue' button when checkbox is checked", async () => {
    const user = userEvent.setup();
    await renderInModal(<SecurityWarningModal />);

    const checkbox = screen.getByRole("checkbox", {
      name: "I understand and accept the risks.",
    });
    await act(() => user.click(checkbox));

    const continueButton = screen.getByRole("button", { name: "Continue" });
    expect(continueButton).toBeEnabled();
  });
});
