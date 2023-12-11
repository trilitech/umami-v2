import { getSenderId } from "@airgap/beacon-wallet";
import userEvent from "@testing-library/user-event";

import * as beaconApi from "./beacon";
import { BeaconPeers } from "./BeaconPeers";
import { ProvidedPeerInfo } from "./types";
import { mockMnemonicAccount } from "../../mocks/factories";
import { dispatchMockAccounts } from "../../mocks/helpers";
import { render, screen, waitFor, within } from "../../mocks/testUtils";
import { beaconActions } from "../redux/slices/beaconSlice";
import { store } from "../redux/store";

const peersData: ProvidedPeerInfo[] = [
  { name: "dApp-1", publicKey: "dApp-pkh1", version: "v1" },
  { name: "dApp-2", publicKey: "dApp-pkh2", version: "v1.5" },
  { name: "dApp-3", publicKey: "dApp-pkh3", version: "v2" },
];
let senderIds: string[];

beforeEach(async () => {
  dispatchMockAccounts([mockMnemonicAccount(1), mockMnemonicAccount(2)]);
  jest.spyOn(beaconApi, "usePeers").mockReturnValue({ data: peersData } as any);
  senderIds = await Promise.all(peersData.map(async peer => await getSenderId(peer.publicKey)));
});

describe("<BeaconPeers />", () => {
  const renderBeaconPeers = async () => {
    render(<BeaconPeers />);
    await waitFor(() => {
      expect(screen.getAllByTestId("peer-row")).toHaveLength(3);
    });
  };

  describe("list of paired dApps", () => {
    it("contains dApp names", async () => {
      await renderBeaconPeers();
      const peerRows = screen.getAllByTestId("peer-row");

      expect(peerRows[0]).toHaveTextContent("dApp-1");
      expect(peerRows[1]).toHaveTextContent("dApp-2");
      expect(peerRows[2]).toHaveTextContent("dApp-3");
    });

    // TODO: shows icons / placeholder icons

    // TODO: displays address pill with connected acc for saved connections

    // TODO: shows ??? instead of address pill if connection was not saved

    it("shows enabled delete button for each dApp", async () => {
      await renderBeaconPeers();
      const peerRows = screen.getAllByTestId("peer-row");

      for (const peerRow of peerRows) {
        const deleteButton = within(peerRow).getByRole("button", { name: "Remove Peer" });
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toBeEnabled();
      }
    });
  });

  describe("deleting a peer", () => {
    beforeEach(() => {
      jest.spyOn(beaconApi.walletClient, "removePeer").mockReturnValue(Promise.resolve());
    });

    it("sends delete request through beacon api", async () => {
      const user = userEvent.setup();
      await renderBeaconPeers();

      const deleteButton = within(screen.getAllByTestId("peer-row")[1]).getByRole("button", {
        name: "Remove Peer",
      });
      await waitFor(() => {
        user.click(deleteButton);
      });

      await waitFor(() => {
        expect(beaconApi.walletClient.removePeer).toHaveBeenCalledWith({
          ...peersData[1],
          senderId: senderIds[1],
        });
      });
    });

    it("removes connection from beaconSlice", async () => {
      const user = userEvent.setup();
      store.dispatch(
        beaconActions.addConnection({
          dAppId: senderIds[0],
          accountPkh: mockMnemonicAccount(1).address.pkh,
        })
      );
      store.dispatch(
        beaconActions.addConnection({
          dAppId: senderIds[1],
          accountPkh: mockMnemonicAccount(1).address.pkh,
        })
      );
      store.dispatch(
        beaconActions.addConnection({
          dAppId: senderIds[2],
          accountPkh: mockMnemonicAccount(2).address.pkh,
        })
      );
      await renderBeaconPeers();

      const deleteButton = within(screen.getAllByTestId("peer-row")[1]).getByRole("button", {
        name: "Remove Peer",
      });
      await waitFor(() => {
        user.click(deleteButton);
      });

      await waitFor(() => {
        expect(store.getState().beacon).toEqual({
          [senderIds[0]]: mockMnemonicAccount(1).address.pkh,
          [senderIds[2]]: mockMnemonicAccount(2).address.pkh,
        });
      });
    });
  });
});
