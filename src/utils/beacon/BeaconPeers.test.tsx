import { NetworkType, getSenderId } from "@airgap/beacon-wallet";
import { userEvent } from "@testing-library/user-event";

import * as beaconHelper from "./beacon";
import { BeaconPeers } from "./BeaconPeers";
import { ProvidedPeerInfo } from "./types";
import { mockMnemonicAccount } from "../../mocks/factories";
import { dispatchMockAccounts } from "../../mocks/helpers";
import { render, screen, waitFor, within } from "../../mocks/testUtils";
import { formatPkh } from "../format";
import { beaconActions } from "../redux/slices/beaconSlice";
import { store } from "../redux/store";

const peersData: ProvidedPeerInfo[] = [
  {
    name: "dApp-1",
    publicKey: "dApp-pkh1",
    type: "p2p-pairing-request",
    id: "test-id-1",
    version: "v1",
  },
  {
    name: "dApp-2",
    publicKey: "dApp-pkh2",
    type: "p2p-pairing-request",
    id: "test-id-2",
    version: "v1.5",
  },
  {
    name: "dApp-3",
    publicKey: "dApp-pkh3",
    type: "p2p-pairing-request",
    id: "test-id-3",
    version: "v2",
  },
];
let senderIds: string[];

beforeEach(async () => {
  dispatchMockAccounts([mockMnemonicAccount(1), mockMnemonicAccount(2)]);
  jest.spyOn(beaconHelper, "usePeers").mockReturnValue({ data: peersData } as any);
  senderIds = await Promise.all(peersData.map(peer => getSenderId(peer.publicKey)));
});

describe("<BeaconPeers />", () => {
  const getPeerRows = async (): Promise<HTMLElement[]> => {
    render(<BeaconPeers />);
    let rows;
    await waitFor(() => {
      rows = screen.getAllByTestId("peer-row");
      expect(rows).toHaveLength(3);
    });
    return rows!;
  };

  describe("list of paired dApps", () => {
    it("contains dApp names", async () => {
      const peerRows = await getPeerRows();

      expect(peerRows[0]).toHaveTextContent("dApp-1");
      expect(peerRows[1]).toHaveTextContent("dApp-2");
      expect(peerRows[2]).toHaveTextContent("dApp-3");
    });

    // TODO: shows icons / placeholder icons

    it("shows enabled delete button for each dApp", async () => {
      const peerRows = await getPeerRows();

      for (const peerRow of peerRows) {
        const deleteButton = within(peerRow).getByRole("button", { name: "Remove Peer" });
        expect(deleteButton).toBeEnabled();
      }
    });

    describe("for saved connections", () => {
      it("displays address pill with acc label if connected acc is present", async () => {
        store.dispatch(
          beaconActions.addConnection({
            dAppId: senderIds[1],
            accountPkh: mockMnemonicAccount(1).address.pkh,
            networkType: NetworkType.MAINNET,
          })
        );

        const peerRows = await getPeerRows();

        const addressPill = within(peerRows[0]).getByTestId("address-pill-text");
        expect(addressPill).toHaveTextContent(mockMnemonicAccount(1).label);
      });

      it("displays address pill with acc pkh if connected acc was removed", async () => {
        store.dispatch(
          beaconActions.addConnection({
            dAppId: senderIds[1],
            accountPkh: mockMnemonicAccount(5).address.pkh,
            networkType: NetworkType.MAINNET,
          })
        );

        const peerRows = await getPeerRows();

        const addressPill = within(peerRows[0]).getByTestId("address-pill-text");
        expect(addressPill).toHaveTextContent(formatPkh(mockMnemonicAccount(5).address.pkh));
      });

      it("displays network type from beacon connection request", async () => {
        store.dispatch(
          beaconActions.addConnection({
            dAppId: senderIds[1],
            accountPkh: mockMnemonicAccount(1).address.pkh,
            networkType: NetworkType.OXFORDNET,
          })
        );

        const peerRows = await getPeerRows();

        const network = within(peerRows[0]).getByTestId("dapp-connection-network");
        expect(network).toHaveTextContent("Oxfordnet");
      });
    });

    describe("for connections without saved info", () => {
      it("hides address pill", async () => {
        const peerRows = await getPeerRows();

        expect(within(peerRows[0]).queryByTestId("address-pill")).not.toBeInTheDocument();
      });

      it("hides network", async () => {
        const peerRows = await getPeerRows();

        expect(
          within(peerRows[0]).queryByTestId("dapp-connection-network")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("deleting a peer", () => {
    beforeEach(() => {
      jest.spyOn(beaconHelper.walletClient, "removePeer").mockReturnValue(Promise.resolve());
    });

    it("sends a delete request through the beacon api", async () => {
      const user = userEvent.setup();
      const peerRows = await getPeerRows();

      const deleteButton = within(peerRows[1]).getByRole("button", { name: "Remove Peer" });
      user.click(deleteButton);

      await waitFor(() => {
        expect(beaconHelper.walletClient.removePeer).toHaveBeenCalledWith({
          ...peersData[1],
          senderId: senderIds[1],
        });
      });
    });

    it("removes connection from beaconSlice", async () => {
      const user = userEvent.setup();
      [
        {
          dAppId: senderIds[0],
          accountPkh: mockMnemonicAccount(1).address.pkh,
          networkType: NetworkType.MAINNET,
        },
        {
          dAppId: senderIds[1],
          accountPkh: mockMnemonicAccount(1).address.pkh,
          networkType: NetworkType.GHOSTNET,
        },
        {
          dAppId: senderIds[2],
          accountPkh: mockMnemonicAccount(2).address.pkh,
          networkType: NetworkType.CUSTOM,
        },
      ].forEach(connection => {
        store.dispatch(beaconActions.addConnection(connection));
      });
      const peerRows = await getPeerRows();

      const deleteButton = within(peerRows[1]).getByRole("button", {
        name: "Remove Peer",
      });
      user.click(deleteButton);

      await waitFor(() => {
        expect(store.getState().beacon).toEqual({
          [senderIds[0]]: {
            accountPkh: mockMnemonicAccount(1).address.pkh,
            networkType: NetworkType.MAINNET,
          },
          [senderIds[2]]: {
            accountPkh: mockMnemonicAccount(2).address.pkh,
            networkType: NetworkType.CUSTOM,
          },
        });
      });
    });
  });
});
