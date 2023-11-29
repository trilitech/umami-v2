import { Modal } from "@chakra-ui/react";
import { ReactElement } from "react";

import { UpsertNetworkModal } from "./UpsertNetworkModal";
import { fireEvent, render, screen, waitFor } from "../../../mocks/testUtils";
import { GHOSTNET, MAINNET } from "../../../types/Network";
import { networksActions } from "../../../utils/redux/slices/networks";
import { store } from "../../../utils/redux/store";

const fixture = (element: ReactElement) => (
  <Modal isOpen={true} onClose={() => {}}>
    {element}
  </Modal>
);

const customNetwork = { ...GHOSTNET, name: "custom" };

describe("<UpsertNetworkModal />", () => {
  describe("edit mode", () => {
    beforeEach(() => {
      store.dispatch(networksActions.upsertNetwork(customNetwork));
    });

    it("doesn't render name field", async () => {
      render(fixture(<UpsertNetworkModal network={MAINNET} />));
      await waitFor(() => {
        expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
      });
    });

    it("saves the updates", async () => {
      render(fixture(<UpsertNetworkModal network={customNetwork} />));
      const updatedNetwork = {
        ...customNetwork,
        rpcUrl: "https://rpc",
        tzktApiUrl: "https://tzkt",
        tzktExplorerUrl: "https://explorer",
        buyTezUrl: "",
      };

      fireEvent.change(screen.getByLabelText("RPC URL"), {
        target: { value: updatedNetwork.rpcUrl },
      });
      fireEvent.change(screen.getByLabelText("Tzkt API URL"), {
        target: { value: updatedNetwork.tzktApiUrl },
      });
      fireEvent.change(screen.getByLabelText("Tzkt Explorer URL"), {
        target: { value: updatedNetwork.tzktExplorerUrl },
      });
      fireEvent.change(screen.getByLabelText("Buy Tez URL"), {
        target: { value: "" },
      });

      await waitFor(() => {
        expect(screen.getByText("Save changes")).toBeEnabled();
      });

      fireEvent.click(screen.getByText("Save changes"));
      await waitFor(() => {
        expect(store.getState().networks.available).toEqual([MAINNET, GHOSTNET, updatedNetwork]);
      });
    });
  });

  describe("create mode", () => {
    describe("name field", () => {
      it("validates uniqueness", async () => {
        render(fixture(<UpsertNetworkModal />));
        fireEvent.change(screen.getByLabelText("Name"), { target: { value: MAINNET.name } });
        fireEvent.blur(screen.getByLabelText("Name"));
        await waitFor(() => {
          expect(screen.getByText("Network with this name already exists")).toBeInTheDocument();
        });
      });

      it("validates presence", async () => {
        render(fixture(<UpsertNetworkModal />));
        fireEvent.blur(screen.getByLabelText("Name"));
        await waitFor(() => {
          expect(screen.getByText("Name is required")).toBeInTheDocument();
        });
      });
    });

    it("validates RPC URL field presence", async () => {
      render(fixture(<UpsertNetworkModal />));
      fireEvent.blur(screen.getByLabelText("RPC URL"));
      await waitFor(() => {
        expect(screen.getByText("RPC URL is required")).toBeInTheDocument();
      });
    });

    it("validates Tzkt API URL field presence", async () => {
      render(fixture(<UpsertNetworkModal />));
      fireEvent.blur(screen.getByLabelText("Tzkt API URL"));
      await waitFor(() => {
        expect(screen.getByText("Tzkt API URL is required")).toBeInTheDocument();
      });
    });

    it("validates Tzkt Explorer URL field presence", async () => {
      render(fixture(<UpsertNetworkModal />));
      fireEvent.blur(screen.getByLabelText("Tzkt Explorer URL"));
      await waitFor(() => {
        expect(screen.getByText("Tzkt Explorer URL is required")).toBeInTheDocument();
      });
    });

    it("creates new network", async () => {
      render(fixture(<UpsertNetworkModal />));
      fireEvent.change(screen.getByLabelText("Name"), { target: { value: customNetwork.name } });
      fireEvent.change(screen.getByLabelText("RPC URL"), {
        target: { value: customNetwork.rpcUrl },
      });
      fireEvent.change(screen.getByLabelText("Tzkt API URL"), {
        target: { value: customNetwork.tzktApiUrl },
      });
      fireEvent.change(screen.getByLabelText("Tzkt Explorer URL"), {
        target: { value: customNetwork.tzktExplorerUrl },
      });
      fireEvent.change(screen.getByLabelText("Buy Tez URL"), {
        target: { value: customNetwork.buyTezUrl },
      });

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
