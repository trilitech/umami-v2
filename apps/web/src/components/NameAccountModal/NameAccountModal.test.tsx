import { NameAccountModal } from "./NameAccountModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../testUtils";

const mockOnSubmit = jest.fn();

describe("NameAccountModal", () => {
  it("renders with custom title and subtitle", async () => {
    await renderInModal(
      <NameAccountModal onSubmit={mockOnSubmit} subtitle="Custom Subtitle" title="Custom Title" />
    );

    await waitFor(() => {
      expect(screen.getByText("Custom Title")).toBeVisible();
    });
    expect(screen.getByText("Custom Subtitle")).toBeVisible();
  });

  it("calls onSubmit with form data when submitted", async () => {
    const user = userEvent.setup();

    await renderInModal(<NameAccountModal onSubmit={mockOnSubmit} />);

    await act(() => user.type(screen.getByLabelText("Account name"), "Test Account"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
