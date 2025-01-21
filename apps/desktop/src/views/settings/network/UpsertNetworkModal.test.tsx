import { type UmamiStore, makeStore, networksActions } from "@umami/state";
import { GHOSTNET, MAINNET } from "@umami/tezos";

import { UpsertNetworkModal } from "./UpsertNetworkModal";
import { act, fireEvent, render, screen, userEvent, waitFor } from "../../../mocks/testUtils";

const customNetwork = { ...GHOSTNET, name: "custom" };

let store: UmamiStore;
beforeEach(() => {
  store = makeStore();
});

describe("<UpsertNetworkModal />", () => {
  const updatedNetwork = {
    ...customNetwork,
    rpcUrl: "https://rpc.com",
    tzktApiUrl: "https://tzkt.com",
    tzktExplorerUrl: "https://explorer.com",
    buyTezUrl: "",
  };

  describe("edit mode", () => {
    beforeEach(() => {
      store.dispatch(networksActions.upsertNetwork(customNetwork));
    });

    it("doesn't render name field", async () => {
      render(<UpsertNetworkModal network={MAINNET} />, { store });

      await waitFor(() => expect(screen.queryByLabelText("Name")).not.toBeInTheDocument());
    });

    it("saves the updates", async () => {
      const user = userEvent.setup();
      render(<UpsertNetworkModal network={customNetwork} />, { store });

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
      render(<UpsertNetworkModal network={customNetwork} />, { store });

      await act(() => user.clear(screen.getByLabelText("RPC URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt API URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt Explorer URL")));
      await act(() => user.clear(screen.getByLabelText("Buy tez URL")));
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

  describe("URL fields validation", () => {
    const urlFields = [
      { label: "RPC URL", required: true },
      { label: "Tzkt API URL", required: true },
      { label: "Tzkt Explorer URL", required: true },
      { label: "Buy tez URL", required: false },
    ];

    it.each(urlFields)("validates $label field", async ({ label, required }) => {
      const user = userEvent.setup();
      render(<UpsertNetworkModal />, { store });

      await user.type(screen.getByLabelText(label), "invalid-url");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(`Enter a valid ${label}`)).toBeVisible();
      });

      await user.clear(screen.getByLabelText(label));
      await user.tab();

      if (required) {
        await waitFor(() => {
          expect(screen.getByText(`${label} is required`)).toBeVisible();
        });
      } else {
        await waitFor(() => {
          expect(screen.queryByText(`${label} is required`)).not.toBeInTheDocument();
        });
      }

      await user.type(screen.getByLabelText(label), "https://valid-url.com");
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(`Enter a valid ${label}`)).not.toBeInTheDocument();
      });
      expect(screen.queryByText(`${label} is required`)).not.toBeInTheDocument();
    });
  });

  describe("create mode", () => {
    describe("name field", () => {
      it("validates uniqueness", async () => {
        render(<UpsertNetworkModal />, { store });
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: MAINNET.name } });
        fireEvent.blur(screen.getByLabelText("Name"));
        await waitFor(() => {
          expect(screen.getByText("Network with this name already exists")).toBeInTheDocument();
        });
      });

      it("validates presence", async () => {
        render(<UpsertNetworkModal />, { store });
        fireEvent.blur(screen.getByLabelText("Name"));
        await waitFor(() => {
          expect(screen.getByText("Name is required")).toBeInTheDocument();
        });
      });
    });

    it("validates RPC URL field presence", async () => {
      render(<UpsertNetworkModal />, { store });
      fireEvent.blur(screen.getByLabelText("RPC URL"));
      await waitFor(() => {
        expect(screen.getByText("RPC URL is required")).toBeInTheDocument();
      });
    });

    it("validates Tzkt API URL field presence", async () => {
      render(<UpsertNetworkModal />, { store });
      fireEvent.blur(screen.getByLabelText("Tzkt API URL"));
      await waitFor(() => {
        expect(screen.getByText("Tzkt API URL is required")).toBeInTheDocument();
      });
    });

    it("validates Tzkt Explorer URL field presence", async () => {
      render(<UpsertNetworkModal />, { store });
      fireEvent.blur(screen.getByLabelText("Tzkt Explorer URL"));
      await waitFor(() => {
        expect(screen.getByText("Tzkt Explorer URL is required")).toBeInTheDocument();
      });
    });

    it("creates new network", async () => {
      const user = userEvent.setup();
      render(<UpsertNetworkModal />, { store });

      await act(() => user.clear(screen.getByLabelText("Name")));
      await act(() => user.clear(screen.getByLabelText("RPC URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt API URL")));
      await act(() => user.clear(screen.getByLabelText("Tzkt Explorer URL")));
      await act(() => user.clear(screen.getByLabelText("Buy tez URL")));
      await act(() => user.type(screen.getByLabelText("Name"), customNetwork.name));
      await act(() => user.type(screen.getByLabelText("RPC URL"), customNetwork.rpcUrl));
      await act(() => user.type(screen.getByLabelText("Tzkt API URL"), customNetwork.tzktApiUrl));
      await act(() =>
        user.type(screen.getByLabelText("Tzkt Explorer URL"), customNetwork.tzktExplorerUrl!)
      );
      await act(() => user.type(screen.getByLabelText("Buy tez URL"), customNetwork.buyTezUrl!));

      await waitFor(() => {
        expect(screen.getByText("Add network")).toBeEnabled();
      });

      fireEvent.click(screen.getByText("Add network"));
      await waitFor(() => {
        expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, customNetwork]);
      });
    });
  });
});
