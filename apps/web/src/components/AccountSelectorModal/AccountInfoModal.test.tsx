import { mockImplicitAccount } from "@umami/core";

import { AccountInfoModal } from "./AccountInfoModal";
import { act, render, screen, userEvent, waitFor } from "../../testUtils";

const mockAccount = mockImplicitAccount(0);

describe("<AccountInfoModal />", () => {
  it("renders correctly with initial values", async () => {
    render(<AccountInfoModal account={mockAccount} />);

    await waitFor(() => expect(screen.getByText("Account Info")).toBeVisible());
    expect(
      screen.getByText(
        "You can receive tez or other digital assets by scanning or sharing this QR code"
      )
    ).toBeVisible();
    expect(screen.getByText(mockAccount.label)).toBeVisible();
    expect(screen.getByText(mockAccount.address.pkh)).toBeVisible();
  });

  it("displays 'Copied!' message in popover when button is clicked", async () => {
    const user = userEvent.setup();

    render(<AccountInfoModal account={mockAccount} />);

    await act(() => user.click(screen.getByRole("button", { name: "Copy Wallet Address" })));

    await waitFor(() => expect(screen.getByText("Copied!")).toBeVisible());
  });
});
