import "@testing-library/jest-dom";

import { mockMnemonicAccount, mockSocialAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";

import { ErrorPage } from "./ErrorPage";
import { act, dynamicModalContextMock, render, screen, userEvent } from "../../testUtils";
import { LogoutModal } from "../Menu/LogoutModal";
import { SetupPassword } from "../Onboarding/SetupPassword";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("ErrorPage", () => {
  describe("for logged out user", () => {
    it("renders the error message and buttons", () => {
      render(<ErrorPage />, { store });

      expect(screen.getByText("Oops! Something went wrong!")).toBeVisible();
      expect(
        screen.getByText("Please refresh the page or use one of the following options:")
      ).toBeVisible();

      const actionButtons = screen.getAllByRole("button");
      expect(actionButtons.map(button => button.textContent)).toEqual(["Report error"]);
      actionButtons.forEach(button => expect(button).toBeVisible());
    });

    it("renders the feedback email link correctly", () => {
      render(<ErrorPage />, { store });

      const emailLink = screen.getByRole("link", { name: "Report error" });
      expect(emailLink).toHaveAttribute(
        "href",
        expect.stringContaining("mailto:umami-support@trili.tech")
      );
    });
  });

  describe("for unverified user", () => {
    beforeEach(() => {
      addTestAccount(store, mockMnemonicAccount(0, { isVerified: false }));
    });

    it("renders the error message and buttons", () => {
      render(<ErrorPage />, { store });

      expect(screen.getByText("Oops! Something went wrong!")).toBeVisible();
      expect(
        screen.getByText("Please refresh the page or use one of the following options:")
      ).toBeVisible();

      const actionButtons = screen.getAllByRole("button");
      expect(actionButtons.map(button => button.textContent)).toEqual(["Report error", "Log out"]);
      actionButtons.forEach(button => expect(button).toBeVisible());
    });

    it("opens LogoutModal when 'Logout' button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      render(<ErrorPage />, { store });

      const offboardButton = screen.getByRole("button", { name: "Log out" });
      await act(() => user.click(offboardButton));

      expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
    });

    it("renders the feedback email link correctly", () => {
      render(<ErrorPage />, { store });

      const emailLink = screen.getByRole("link", { name: "Report error" });
      expect(emailLink).toHaveAttribute(
        "href",
        expect.stringContaining("mailto:umami-support@trili.tech")
      );
    });
  });

  describe("for logged in user", () => {
    beforeEach(() => {
      addTestAccount(store, mockMnemonicAccount(0, { isVerified: false }));
      addTestAccount(store, mockSocialAccount(1));
    });

    it("renders the error message and buttons", () => {
      render(<ErrorPage />, { store });

      expect(screen.getByText("Oops! Something went wrong!")).toBeVisible();
      expect(
        screen.getByText("Please refresh the page or use one of the following options:")
      ).toBeVisible();

      const actionButtons = screen.getAllByRole("button");
      expect(actionButtons.map(button => button.textContent)).toEqual([
        "Save backup",
        "Report error",
        "Log out",
      ]);
      actionButtons.forEach(button => expect(button).toBeVisible());
    });

    it("calls saveBackup function when 'Save Backup' button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      render(<ErrorPage />, { store });

      const saveBackupButton = screen.getByRole("button", { name: "Save backup" });
      await act(() => user.click(saveBackupButton));

      expect(openWith).toHaveBeenCalledWith(<SetupPassword mode="save_backup" />);
    });

    it("opens LogoutModal when 'Logout' button is clicked", async () => {
      const { openWith } = dynamicModalContextMock;
      const user = userEvent.setup();
      render(<ErrorPage />, { store });

      const offboardButton = screen.getByRole("button", { name: "Log out" });
      await act(() => user.click(offboardButton));

      expect(openWith).toHaveBeenCalledWith(<LogoutModal />);
    });

    it("renders the feedback email link correctly", () => {
      render(<ErrorPage />, { store });

      const emailLink = screen.getByRole("link", { name: "Report error" });
      expect(emailLink).toHaveAttribute(
        "href",
        expect.stringContaining("mailto:umami-support@trili.tech")
      );
    });
  });
});
