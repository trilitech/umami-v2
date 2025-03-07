import { logout } from "@umami/state";

import { LogoutModal } from "./LogoutModal";
import { renderInModal, screen, userEvent, waitFor } from "../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  logout: jest.fn(),
}));
jest.mock("../../utils/persistor", () => ({
  persistor: jest.fn(),
  setupPersistor: jest.fn(),
}));

describe("<LogoutModal />", () => {
  it("renders correctly", async () => {
    await renderInModal(<LogoutModal />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Log out" })).toBeVisible();
    });

    expect(
      screen.getByText(
        "Make sure your mnemonic phrase is securely saved. Losing this phrase could result in permanent loss of access to your data."
      )
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Log out" })).toBeVisible();
  });

  it("calls logout function with persistor when logout button is clicked", async () => {
    const user = userEvent.setup();
    await renderInModal(<LogoutModal />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(logout).toHaveBeenCalled();
  });
});
