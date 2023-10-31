import { render, screen, waitFor, within } from "../../../mocks/testUtils";
import { GHOSTNET, MAINNET } from "../../../types/Network";
import { networksActions } from "../../../utils/redux/slices/networks";
import store from "../../../utils/redux/store";
import { NetworkSettingsDrawerBody } from "./NetworkSettingsDrawerBody";

describe("<NetworkSettingsDrawerBody />", () => {
  const customNetwork = { ...GHOSTNET, name: "custom" };

  beforeEach(() => {
    store.dispatch(networksActions.upsertNetwork(customNetwork));
  });

  it.each([MAINNET, GHOSTNET, customNetwork])("renders $name network", async network => {
    render(<NetworkSettingsDrawerBody />);
    await waitFor(() => {
      expect(screen.getByTestId(`network-${network.name}`)).toHaveTextContent(network.name);
    });
    expect(screen.getByTestId(`network-${network.name}`)).toHaveTextContent(network.rpcUrl);
  });

  it("renders popover menu only for custom networks", async () => {
    render(<NetworkSettingsDrawerBody />);
    await waitFor(() => {
      const element = screen.getByTestId("network-custom");
      expect(within(element).getByTestId("popover-menu")).toBeInTheDocument();
    });
    [MAINNET, GHOSTNET].forEach(network => {
      const element = screen.getByTestId(`network-${network.name}`);
      expect(within(element).queryByTestId("popover-menu")).not.toBeInTheDocument();
    });
  });
});
