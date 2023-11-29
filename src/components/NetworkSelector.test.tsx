import { fireEvent, render, screen } from "../mocks/testUtils";
import { GHOSTNET } from "../types/Network";
import { store } from "../utils/redux/store";
import { NetworkSelector } from "./NetworkSelector";

describe("<NetworkSelector />", () => {
  it("shows the current network", () => {
    render(<NetworkSelector />);

    expect(screen.getByTestId("network-selector")).toHaveValue("mainnet");
  });

  it("changes the selected network globally", () => {
    render(<NetworkSelector />);

    fireEvent.change(screen.getByTestId("network-selector"), { target: { value: "ghostnet" } });

    expect(screen.getByTestId("network-selector")).toHaveValue("ghostnet");

    expect(store.getState().networks.current).toEqual(GHOSTNET);
  });
});
