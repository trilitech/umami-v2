import { type UmamiStore, makeStore, networksActions } from "@umami/state";
import { GHOSTNET, MAINNET } from "@umami/tezos";

import { EditNetworkMenu } from "./EditNetworkMenu";
import { NetworkMenu } from "./NetworkMenu";
import {
  dynamicDrawerContextMock,
  renderInDrawer,
  screen,
  userEvent,
  within,
} from "../../testUtils";

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useAppDispatch: () => jest.fn(),
  networksActions: {
    ...jest.requireActual("@umami/state").networksActions,
    removeNetwork: jest.fn(),
  },
}));

describe("<NetworkMenu />", () => {
  const customNetwork = { ...GHOSTNET, name: "custom" };
  let store: UmamiStore;

  beforeEach(() => {
    store = makeStore();
    store.dispatch(networksActions.upsertNetwork(customNetwork));
  });

  it.each([MAINNET, GHOSTNET, customNetwork])("renders $name network", async network => {
    await renderInDrawer(<NetworkMenu />, store);

    expect(screen.getByTestId(`network-${network.name}`)).toHaveTextContent(network.name);
    expect(screen.getByTestId(`network-${network.name}`)).toHaveTextContent(network.rpcUrl);
  });

  it("renders popover menu only for custom networks", async () => {
    const user = userEvent.setup();
    await renderInDrawer(<NetworkMenu />, store);

    const element = screen.getByTestId("network-custom");
    expect(within(element).getByTestId("popover-menu")).toBeInTheDocument();

    await user.click(screen.getByTestId("popover-menu"));

    expect(screen.getByTestId("popover-content")).toHaveTextContent("Edit");
    expect(screen.getByTestId("popover-content")).toHaveTextContent("Remove");

    [MAINNET, GHOSTNET].forEach(network => {
      const element = screen.getByTestId(`network-${network.name}`);
      expect(within(element).queryByTestId("popover-menu")).not.toBeInTheDocument();
    });
  });

  it("opens add network modal on add button click", async () => {
    const user = userEvent.setup();
    await renderInDrawer(<NetworkMenu />, store);

    const { openWith } = dynamicDrawerContextMock;

    await user.click(screen.getByRole("button", { name: "Add New" }));

    expect(openWith).toHaveBeenCalledWith(<EditNetworkMenu />);
  });

  it("opens edit network modal on edit button click", async () => {
    const user = userEvent.setup();
    await renderInDrawer(<NetworkMenu />, store);

    const { openWith } = dynamicDrawerContextMock;

    await user.click(screen.getByTestId("popover-menu"));
    await user.click(screen.getByTestId("edit-network"));

    expect(openWith).toHaveBeenCalledWith(<EditNetworkMenu network={customNetwork} />);
  });

  it("removes network on remove button click", async () => {
    const mockRemoveNetwork = jest.fn();
    jest.mocked(networksActions.removeNetwork).mockImplementation(mockRemoveNetwork);

    const user = userEvent.setup();
    await renderInDrawer(<NetworkMenu />, store);

    await user.click(screen.getByTestId("popover-menu"));
    await user.click(screen.getByTestId("remove-network"));

    expect(mockRemoveNetwork).toHaveBeenCalledWith(customNetwork);
  });
});
