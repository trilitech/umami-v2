import { store } from "@umami/state";
import { GHOSTNET } from "@umami/tezos";

import { NetworkSelector } from "./NetworkSelector";
import { act, render, screen, userEvent } from "../mocks/testUtils";

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

    expect(screen.getByTestId("network-selector")).toHaveTextContent("Ghostnet");
    expect(store.getState().networks.current).toEqual(GHOSTNET);
  });
});
