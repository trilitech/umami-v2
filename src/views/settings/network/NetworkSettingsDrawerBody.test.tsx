import { NetworkSettingsDrawerBody } from "./NetworkSettingsDrawerBody";
import { render, screen, within } from "../../../mocks/testUtils";
import { GHOSTNET, MAINNET } from "../../../types/Network";
import { networksActions } from "../../../utils/redux/slices/networks";
import { store } from "../../../utils/redux/store";

describe("<NetworkSettingsDrawerBody />", () => {
  const customNetwork = { ...GHOSTNET, name: "custom" };

  beforeEach(() => {
    store.dispatch(networksActions.upsertNetwork(customNetwork));
  });

  it.each([MAINNET, GHOSTNET, customNetwork])("renders $name network", network => {
    render(<NetworkSettingsDrawerBody />);

    expect(screen.getByTestId(`network-${network.name}`)).toHaveTextContent(network.name);
    expect(screen.getByTestId(`network-${network.name}`)).toHaveTextContent(network.rpcUrl);
  });

  it("renders popover menu only for custom networks", () => {
    render(<NetworkSettingsDrawerBody />);

    const element = screen.getByTestId("network-custom");
    expect(within(element).getByTestId("popover-menu")).toBeInTheDocument();

    [MAINNET, GHOSTNET].forEach(network => {
      const element = screen.getByTestId(`network-${network.name}`);
      expect(within(element).queryByTestId("popover-menu")).not.toBeInTheDocument();
    });
  });
});
