import { defaultDerivationPathTemplate } from "@umami/tezos";

import { NameAccountModal } from "./NameAccountModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../testUtils";

const mockOnSubmit = jest.fn();

describe("NameAccountModal", () => {
  it("renders with custom title and subtitle", async () => {
    await renderInModal(
      <NameAccountModal onSubmit={mockOnSubmit} subtitle="Custom subtitle" title="Custom title" />
    );

    await waitFor(() => {
      expect(screen.getByText("Custom title")).toBeVisible();
    });
    expect(screen.getByText("Custom subtitle")).toBeVisible();
    expect(screen.queryByTestId("advanced-section")).not.toBeInTheDocument();
  });

  it("calls onSubmit with form data when submitted", async () => {
    const user = userEvent.setup();

    await renderInModal(<NameAccountModal onSubmit={mockOnSubmit} />);

    await act(() => user.type(screen.getByLabelText("Account name (optional)"), "Test Account"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("shows error for a long account name", async () => {
    const user = userEvent.setup();
    await renderInModal(<NameAccountModal onSubmit={mockOnSubmit} />);

    await act(() => user.type(screen.getByLabelText("Account name (optional)"), "a".repeat(28)));
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();

    await act(() => user.type(screen.getByLabelText("Account name (optional)"), "a".repeat(29)));
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
    expect(await screen.findByTestId("name-error")).toHaveTextContent(
      "Maximum length is 28 characters"
    );
  });

  it("renders advanced settings when enabled", async () => {
    await renderInModal(<NameAccountModal onSubmit={mockOnSubmit} withAdvancedSettings />);

    expect(screen.getByTestId("advanced-section")).toBeVisible();
  });

  it("submits the form with advanced settings when enabled", async () => {
    const user = userEvent.setup();
    await renderInModal(<NameAccountModal onSubmit={mockOnSubmit} withAdvancedSettings />);

    const input = screen.getByTestId("accountName");
    const submitButton = screen.getByRole("button", { name: "Continue" });

    await user.type(input, "My Advanced Account");
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        accountName: "My Advanced Account",
        derivationPath: defaultDerivationPathTemplate,
        curve: "ed25519",
      })
    );
  });
});
