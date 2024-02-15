import { userEvent } from "@testing-library/user-event";

import { NetworkSelector } from "./NetworkSelector";
import { act, render, screen, waitFor } from "../mocks/testUtils";
import { GHOSTNET } from "../types/Network";
import { store } from "../utils/redux/store";

describe("<NetworkSelector />", () => {
  it("shows the current network", () => {
    render(<NetworkSelector />);

    expect(screen.getByTestId("network-selector")).toHaveTextContent("Mainnet");
  });

  it("changes the selected network globally", async () => {
    const user = userEvent.setup();
    render(<NetworkSelector />);

    await act(() => user.click(screen.getByTestId("network-selector")));
    await act(() => user.click(screen.getByText("Ghostnet")));

    await waitFor(() => {
      expect(screen.getByTestId("network-selector")).toHaveTextContent("Ghostnet");
    });

    expect(store.getState().networks.current).toEqual(GHOSTNET);
  });
});
