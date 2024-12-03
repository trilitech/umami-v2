import { ErrorPage } from "./ErrorPage";
import "@testing-library/jest-dom";
import { act, dynamicModalContextMock, render, screen, userEvent } from "../../testUtils";
import { LogoutModal } from "../Menu/LogoutModal";
import { SetupPassword } from "../Onboarding/SetupPassword";

describe("ErrorPage", () => {
  it("renders the error message and buttons", () => {
    render(<ErrorPage />);

    expect(screen.getByText("Oops! Something went wrong!")).toBeVisible();
    expect(
      screen.getByText("Please refresh the page or use one of the following options:")
    ).toBeVisible();
    
    const actionButtons = screen.getAllByRole("button");
    expect(actionButtons.map(button => button.textContent)).toEqual(["Save Backup", "Report Error", "Logout"]);
    actionButtons.forEach(button => expect(button).toBeVisible());
  });

  it("calls saveBackup function when 'Save Backup' button is clicked", async () => {
    const { openWith } = dynamicModalContextMock;
    const user = userEvent.setup();
    render(<ErrorPage />);

    const saveBackupButton = screen.getByRole("button", { name: "Save Backup" });
    await act(() => user.click(saveBackupButton));

    expect(openWith).toHaveBeenCalledWith(<SetupPassword mode="save_backup" />);
  });

  it("opens LogoutModal when 'Off-board Wallet' button is clicked", async () => {
    const { openWith } = dynamicModalContextMock;
    const user = userEvent.setup();
    render(<ErrorPage />);

    const offboardButton = screen.getByRole("button", { name: "Logout" });
    await act(() => user.click(offboardButton));

    expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
  });

  it("renders the feedback email link correctly", () => {
    render(<ErrorPage />);

    const emailLink = screen.getByRole("link", { name: "Report Error" });
    expect(emailLink).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:umami-support@trili.tech")
    );
  });
});
