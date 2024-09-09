import { MasterPasswordModal } from "./MasterPasswordModal";
import { renderInModal, screen, userEvent } from "../../testUtils";

const mockOnSubmit = jest.fn();

describe("<MasterPasswordModal />", () => {
  it("calls onSubmit with entered password when form is submitted", async () => {
    const user = userEvent.setup();
    await renderInModal(<MasterPasswordModal onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText("Password"), "testpassword");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockOnSubmit).toHaveBeenCalledWith({ password: "testpassword" });
  });

  it("shows validation error when submitting without a password", async () => {
    const user = userEvent.setup();
    await renderInModal(<MasterPasswordModal onSubmit={mockOnSubmit} />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
