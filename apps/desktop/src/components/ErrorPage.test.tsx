import { ErrorPage } from "./ErrorPage";
import "@testing-library/jest-dom";
import { act, render, screen, userEvent } from "../mocks/testUtils";

const mockSaveBackup = jest.fn();
const mockOnOpenOffboarding = jest.fn();

jest.mock("../utils/useSaveBackup", () => ({
  useSaveBackup: () => ({
    content: <div>Save Backup Modal</div>,
    onOpen: mockSaveBackup,
  }),
}));

jest.mock("./Offboarding/useOffboardingModal", () => ({
  useOffboardingModal: () => ({
    modalElement: <div>Logout Modal</div>,
    onOpen: mockOnOpenOffboarding,
  }),
}));

describe("ErrorPage", () => {
  it("renders the error message and buttons", () => {
    render(<ErrorPage />);

    expect(screen.getByText("Oops! Something went wrong!")).toBeInTheDocument();
    expect(
      screen.getByText("Please refresh the app or use one of the following options:")
    ).toBeInTheDocument();
    // Refresh link
    expect(screen.getByRole("heading", { name: /Refresh/i })).toBeInTheDocument();
    // Action buttons
    expect(screen.getByRole("button", { name: /Report Error/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save Backup/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Off-board Wallet/i })).toBeInTheDocument();
  });

  it("calls saveBackup function when 'Save Backup' button is clicked", async () => {
    const user = userEvent.setup();
    render(<ErrorPage />);

    const saveBackupButton = screen.getByRole("button", { name: /Save Backup/i });
    await act(() => user.click(saveBackupButton));

    expect(mockSaveBackup).toHaveBeenCalledTimes(1);
  });

  it("opens LogoutModal when 'Off-board Wallet' button is clicked", async () => {
    const user = userEvent.setup();
    render(<ErrorPage />);

    const offboardButton = screen.getByRole("button", { name: /Off-board Wallet/i });
    await act(() => user.click(offboardButton));

    expect(mockOnOpenOffboarding).toHaveBeenCalledTimes(1);
  });

  it("renders the feedback email link correctly", () => {
    render(<ErrorPage />);

    const emailLink = screen.getByRole("link", { name: /Report Error/i });
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:umami-support@trili.tech")
    );
  });

  it("refreshes the page when 'Refresh' link is clicked", async () => {
    const user = userEvent.setup();
    delete (window as any).location;
    window.location = { href: "", hash: "" } as any;

    render(<ErrorPage />);

    const refreshLink = screen.getByRole("heading", { name: /Refresh/i });
    await act(() => user.click(refreshLink));

    expect(window.location.href).toBe("/");
  });
});
