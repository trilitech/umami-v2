import { userEvent } from "@testing-library/user-event";

import { SideNavbar } from "./SideNavbar";
import { act, render, screen } from "../mocks/testUtils";

const MENU_ITEM_LABELS = [
  "Accounts",
  "NFTs",
  "Operations",
  "Tokens",
  "Batch",
  "Address Book",
  "Settings",
  "Help",
];

describe("<SideNavbar />", () => {
  it("is expanded by default", () => {
    render(<SideNavbar />);

    expect(screen.getByTestId("side-navbar")).toBeInTheDocument();
    expect(screen.queryByTestId("side-navbar-collapsed")).not.toBeInTheDocument();
  });

  it("collapses/expands when the collapse button is clicked", async () => {
    const user = userEvent.setup();
    render(<SideNavbar />);

    await act(() => user.click(screen.getByTestId("collapse-menu-button")));

    expect(screen.getByTestId("side-navbar-collapsed")).toBeInTheDocument();
    expect(screen.queryByTestId("side-navbar")).not.toBeInTheDocument();

    await act(() => user.click(screen.getByTestId("collapse-menu-button")));

    expect(screen.getByTestId("side-navbar")).toBeInTheDocument();
    expect(screen.queryByTestId("side-navbar-collapsed")).not.toBeInTheDocument();
  });

  describe("expanded", () => {
    it("renders the logo", () => {
      render(<SideNavbar />);

      expect(screen.getByTestId("maki-logo")).toBeInTheDocument();
    });

    it("renders the network selector", () => {
      render(<SideNavbar />);

      expect(screen.getByTestId("network-selector")).toBeInTheDocument();
    });

    it("renders the balance if available", () => {
      render(<SideNavbar />);

      expect(screen.getByTestId("total-balance")).toBeInTheDocument();
    });

    it("renders menu item labels", () => {
      render(<SideNavbar />);

      MENU_ITEM_LABELS.forEach(label => {
        expect(screen.getByText(label, { exact: true })).toBeInTheDocument();
      });
    });
  });

  describe("collapsed", () => {
    it("hides the logo", async () => {
      const user = userEvent.setup();
      render(<SideNavbar />);

      await act(() => user.click(screen.getByTestId("collapse-menu-button")));

      expect(screen.queryByTestId("maki-logo")).not.toBeInTheDocument();
    });

    it("hides the network selector", async () => {
      const user = userEvent.setup();
      render(<SideNavbar />);

      await act(() => user.click(screen.getByTestId("collapse-menu-button")));

      expect(screen.queryByTestId("network-selector")).not.toBeInTheDocument();
    });

    it("hides the balance", async () => {
      const user = userEvent.setup();
      render(<SideNavbar />);

      await act(() => user.click(screen.getByTestId("collapse-menu-button")));

      expect(screen.queryByTestId("total-balance")).not.toBeInTheDocument();
    });

    it("hides the menu item labels", async () => {
      const user = userEvent.setup();
      render(<SideNavbar />);

      await act(() => user.click(screen.getByTestId("collapse-menu-button")));

      MENU_ITEM_LABELS.forEach(label => {
        expect(screen.queryByText(label)).not.toBeInTheDocument();
      });
    });
  });
});
