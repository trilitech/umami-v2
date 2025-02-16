import { SecurityWarningModal } from "./SecurityWarningModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../testUtils";

beforeEach(() => {
  localStorage.clear();
});

describe("<SecurityWarningModal />", () => {
  it("renders the modal with correct title and content", async () => {
    await renderInModal(<SecurityWarningModal />);

    await waitFor(() => {
      expect(screen.getByText("Browser extension security tips")).toBeVisible();
    });

    expect(
      screen.getByText(
        "Follow these essential guidelines to safeguard your wallet from security risks"
      )
    ).toBeVisible();
  });

  it.each([
    "Install extensions only from trusted sources",
    "Review permissions and ratings carefully",
    "Use a separate browser for financial activities",
    "Keep your browser and extensions updated",
    "Stay alert to social engineering risks",
  ])("renders %s accordion item", async title => {
    await renderInModal(<SecurityWarningModal />);

    await waitFor(() => {
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
