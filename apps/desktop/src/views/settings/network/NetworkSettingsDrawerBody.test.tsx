import { type UmamiStore, makeStore, networksActions } from "@umami/state";
import { MAINNET, SHADOWNET } from "@umami/tezos";

import { NetworkSettingsDrawerBody } from "./NetworkSettingsDrawerBody";
import { render, screen, within } from "../../../mocks/testUtils";

describe("<NetworkSettingsDrawerBody />", () => {
  const customNetwork = { ...SHADOWNET, name: "custom" };
  let store: UmamiStore;

  beforeEach(() => {
    store = makeStore();
    store.dispatch(networksActions.upsertNetwork(customNetwork));
  });

  it.each([MAINNET, SHADOWNET, customNetwork])("renders $name network", network => {
    render(<NetworkSettingsDrawerBody />, { store });

    expect(screen.getByTestId(`network-${network.name}`)).toHaveTextContent(network.name);
    expect(screen.getByTestId(`network-${network.name}`)).toHaveTextContent(network.rpcUrl);
  });

  it("renders popover menu only for custom networks", () => {
    render(<NetworkSettingsDrawerBody />, { store });

    const element = screen.getByTestId("network-custom");
    expect(within(element).getByTestId("popover-menu")).toBeInTheDocument();

    [MAINNET, SHADOWNET].forEach(network => {
      const element = screen.getByTestId(`network-${network.name}`);
      expect(within(element).queryByTestId("popover-menu")).not.toBeInTheDocument();
    });
  });
});
