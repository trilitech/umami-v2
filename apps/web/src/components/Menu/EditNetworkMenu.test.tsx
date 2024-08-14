import { type UmamiStore, makeStore, networksActions } from "@umami/state";
import { GHOSTNET, MAINNET } from "@umami/tezos";

import { EditNetworkMenu } from "./EditNetworkMenu";
import { act, fireEvent, renderInDrawer, screen, userEvent, waitFor } from "../../testUtils";

const customNetwork = { ...GHOSTNET, name: "custom" };

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("<EditNetworkMenu />", () => {
  describe("edit mode", () => {
    beforeEach(() => {
      store.dispatch(networksActions.upsertNetwork(customNetwork));
    });

    it("doesn't render name field", async () => {
      await renderInDrawer(<EditNetworkMenu network={MAINNET} />, store);

      await waitFor(() => expect(screen.queryByLabelText("Name")).not.toBeInTheDocument());
    });

    it("saves the updates", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<EditNetworkMenu network={customNetwork} />, store);

      const updatedNetwork = {
        ...customNetwork,
        rpcUrl: "https://rpc",
        tzktApiUrl: "https://tzkt",
        tzktExplorerUrl: "https://explorer",
        buyTezUrl: "",
      };

      await act(() => user.clear(screen.getByLabelText("RPC URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt API URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt Explorer URL")));
      await act(() => user.clear(screen.getByLabelText("Buy Tez URL")));
      await act(() => user.type(screen.getByLabelText("RPC URL"), updatedNetwork.rpcUrl));
      await act(() => user.type(screen.getByLabelText("Tzkt API URL"), updatedNetwork.tzktApiUrl));
      await act(() =>
        user.type(screen.getByLabelText("Tzkt Explorer URL"), updatedNetwork.tzktExplorerUrl)
      );

      expect(screen.getByText("Save changes")).toBeEnabled();

      await act(() => user.click(screen.getByText("Save changes")));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, updatedNetwork]);
    });

    it("ignores trailing slashes", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<EditNetworkMenu network={customNetwork} />, store);

      const updatedNetwork = {
        ...customNetwork,
        rpcUrl: "https://rpc",
        tzktApiUrl: "https://tzkt",
        tzktExplorerUrl: "https://explorer",
        buyTezUrl: "",
      };

      await act(() => user.clear(screen.getByLabelText("RPC URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt API URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt Explorer URL")));
      await act(() => user.clear(screen.getByLabelText("Buy Tez URL")));
      await act(() => user.type(screen.getByLabelText("RPC URL"), updatedNetwork.rpcUrl + "///"));
      await act(() =>
        user.type(screen.getByLabelText("Tzkt API URL"), updatedNetwork.tzktApiUrl + "///")
      );
      await act(() =>
        user.type(
          screen.getByLabelText("Tzkt Explorer URL"),
          updatedNetwork.tzktExplorerUrl + "/////"
        )
      );

      expect(screen.getByText("Save changes")).toBeEnabled();

      await act(() => user.click(screen.getByText("Save changes")));
      expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, updatedNetwork]);
    });
  });

  describe("create mode", () => {
    describe("name field", () => {
      it("validates uniqueness", async () => {
        await renderInDrawer(<EditNetworkMenu />, store);
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: MAINNET.name } });
        fireEvent.blur(screen.getByLabelText("Name"));
        await waitFor(() => {
          expect(screen.getByText("Network with this name already exists")).toBeInTheDocument();
        });
      });

      it("validates presence", async () => {
        await renderInDrawer(<EditNetworkMenu />, store);
        fireEvent.blur(screen.getByLabelText("Name"));
        await waitFor(() => {
          expect(screen.getByText("Name is required")).toBeInTheDocument();
        });
      });
    });

    it("validates RPC URL field presence", async () => {
      await renderInDrawer(<EditNetworkMenu />, store);
      fireEvent.blur(screen.getByLabelText("RPC URL"));
      await waitFor(() => {
        expect(screen.getByText("RPC URL is required")).toBeInTheDocument();
      });
    });

    it("validates Tzkt API URL field presence", async () => {
      await renderInDrawer(<EditNetworkMenu />, store);
      fireEvent.blur(screen.getByLabelText("Tzkt API URL"));
      await waitFor(() => {
        expect(screen.getByText("Tzkt API URL is required")).toBeInTheDocument();
      });
    });

    it("validates Tzkt Explorer URL field presence", async () => {
      await renderInDrawer(<EditNetworkMenu />, store);
      fireEvent.blur(screen.getByLabelText("Tzkt Explorer URL"));
      await waitFor(() => {
        expect(screen.getByText("Tzkt Explorer URL is required")).toBeInTheDocument();
      });
    });

    it("creates new network", async () => {
      const user = userEvent.setup();
      await renderInDrawer(<EditNetworkMenu />, store);

      await act(() => user.clear(screen.getByLabelText("Name")));
      await act(() => user.clear(screen.getByLabelText("RPC URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt API URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt Explorer URL")));
      await act(() => user.clear(screen.getByLabelText("Buy Tez URL")));
      await act(() => user.type(screen.getByLabelText("Name"), customNetwork.name));
      await act(() => user.type(screen.getByLabelText("RPC URL"), customNetwork.rpcUrl));
      await act(() => user.type(screen.getByLabelText("Tzkt API URL"), customNetwork.tzktApiUrl));
      await act(() =>
        user.type(screen.getByLabelText("Tzkt Explorer URL"), customNetwork.tzktExplorerUrl!)
      );
      await act(() => user.type(screen.getByLabelText("Buy Tez URL"), customNetwork.buyTezUrl!));

      await waitFor(() => {
        expect(screen.getByText("Add network")).toBeEnabled();
      });

      await user.click(screen.getByText("Add network"));
      await waitFor(() => {
        expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, customNetwork]);
      });
    });
  });
});
