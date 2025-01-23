import { logout } from "@umami/state";

import { LogoutModal } from "./LogoutModal";
import { renderInModal, screen, userEvent, waitFor } from "../../testUtils";
import { persistor } from "../../utils/persistor";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  logout: jest.fn(),
}));

describe("<LogoutModal />", () => {
  it("renders correctly", async () => {
    await renderInModal(<LogoutModal />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Log out" })).toBeVisible();
    });

    expect(
      screen.getByText(
        "Before you log out, ensure your mnemonic phrase is securely saved. Without it, you may permanently lose access to your account and data."
      )
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Log out" })).toBeVisible();
  });

  it("calls logout function with persistor when logout button is clicked", async () => {
    const user = userEvent.setup();
    await renderInModal(<LogoutModal />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    expect(logout).toHaveBeenCalledWith(persistor);
  });
});
