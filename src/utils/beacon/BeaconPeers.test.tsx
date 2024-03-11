import { ExtendedPeerInfo, NetworkType } from "@airgap/beacon-wallet";

import * as beaconHelper from "./beacon";
import { BeaconPeers } from "./BeaconPeers";
import { WalletClient } from "./WalletClient";
import { mockMnemonicAccount } from "../../mocks/factories";
import { dispatchMockAccounts } from "../../mocks/helpers";
import { act, render, screen, userEvent, waitFor, within } from "../../mocks/testUtils";
import { formatPkh } from "../format";
import { beaconActions } from "../redux/slices/beaconSlice";
import { store } from "../redux/store";

const peersData: ExtendedPeerInfo[] = [
  {
    name: "dApp-1",
    publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810c",
    senderId: "2MqUhvyAJy3UY",
    type: "p2p-pairing-request",
    id: "test-id-1",
    version: "v1",
  },
  {
    name: "dApp-2",
    publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810b",
    senderId: "2UJwaEUy23W3g",
    type: "p2p-pairing-request",
    id: "test-id-2",
    version: "v1.5",
  },
  {
    name: "dApp-3",
    publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810a",
    senderId: "3obHXJP1D8QrB",
    type: "p2p-pairing-request",
    id: "test-id-3",
    version: "v2",
  },
];

beforeEach(() => {
  dispatchMockAccounts([mockMnemonicAccount(1), mockMnemonicAccount(2)]);
  jest.spyOn(beaconHelper, "usePeers").mockReturnValue({ data: peersData } as any);
});

describe("<BeaconPeers />", () => {
  const getPeerRows = async (expectedLength: number): Promise<HTMLElement[]> => {
    render(<BeaconPeers />);

    const rows = await screen.findAllByTestId("peer-row");
    expect(rows).toHaveLength(expectedLength);

    return rows;
  };

  describe("list of paired dApps", () => {
    it("shows empty state message when no paired dApps", async () => {
      jest.spyOn(beaconHelper, "usePeers").mockReturnValue({ data: [] } as any);
      render(<BeaconPeers />);

      await waitFor(() => {
        expect(screen.getByText("Your dApps will appear here")).toBeInTheDocument();
      });
      expect(screen.queryByTestId("peer-row")).not.toBeInTheDocument();
    });

    it("hides empty state message when paired dApps are present", async () => {
      await getPeerRows(3);

      expect(screen.queryByText("Your dApps will appear here")).not.toBeInTheDocument();
    });

    it("contains dApp names", async () => {
      const peerRows = await getPeerRows(3);

      expect(peerRows[0]).toHaveTextContent("dApp-1");
      expect(peerRows[1]).toHaveTextContent("dApp-2");
      expect(peerRows[2]).toHaveTextContent("dApp-3");
    });

    // TODO: shows icons / placeholder icons

    it("shows enabled delete button for each dApp", async () => {
      const peerRows = await getPeerRows(3);

      for (const peerRow of peerRows) {
        const deleteButton = within(peerRow).getByRole("button", { name: "Remove Peer" });
        expect(deleteButton).toBeEnabled();
      }
    });

    it("resolves duplicating name for diffferent dAppIds", async () => {
      jest.spyOn(beaconHelper, "usePeers").mockReturnValue({
        data: [
          {
            name: "dApp",
            publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810c",
            senderId: "2MqUhvyAJy3UY",
            type: "p2p-pairing-request",
            id: "test-id-1",
            version: "v1",
          },
          {
            name: "dApp",
            publicKey: "e15835f5b7bb7fae5a3ddbe3c71b3cdd9ee0a5ea2586f04e7669e9040f61810b",
            senderId: "2UJwaEUy23W3g",
            type: "p2p-pairing-request",
            id: "test-id-2",
            version: "v1.5",
          },
        ],
      } as any);

      await getPeerRows(2);
    });

    describe("for saved connections", () => {
      it("displays address pill with acc label if connected acc is present", async () => {
        store.dispatch(
          beaconActions.addConnection({
            dAppId: peersData[1].senderId,
            accountPkh: mockMnemonicAccount(1).address.pkh,
            networkType: NetworkType.MAINNET,
          })
        );

        const peerRows = await getPeerRows(3);

        const addressPill = within(peerRows[1]).getByTestId("address-pill-text");
        expect(addressPill).toHaveTextContent(mockMnemonicAccount(1).label);
      });

      it("displays address pill with acc pkh if connected acc was removed", async () => {
        store.dispatch(
          beaconActions.addConnection({
            dAppId: peersData[1].senderId,
            accountPkh: mockMnemonicAccount(5).address.pkh,
            networkType: NetworkType.MAINNET,
          })
        );

        const peerRows = await getPeerRows(3);

        const addressPill = within(peerRows[1]).getByTestId("address-pill-text");
        expect(addressPill).toHaveTextContent(formatPkh(mockMnemonicAccount(5).address.pkh));
      });

      it("displays network type from beacon connection request", async () => {
        store.dispatch(
          beaconActions.addConnection({
            dAppId: peersData[2].senderId,
            accountPkh: mockMnemonicAccount(1).address.pkh,
            networkType: NetworkType.OXFORDNET,
          })
        );

        const peerRows = await getPeerRows(3);

        const network = within(peerRows[2]).getByTestId("dapp-connection-network");
        expect(network).toHaveTextContent("Oxfordnet");
      });

      it("displays multiple connections for the same dApp if present", async () => {
        [
          {
            dAppId: peersData[0].senderId,
            accountPkh: mockMnemonicAccount(1).address.pkh,
            networkType: NetworkType.MAINNET,
          },
          {
            dAppId: peersData[1].senderId,
            accountPkh: mockMnemonicAccount(1).address.pkh,
            networkType: NetworkType.GHOSTNET,
          },
          {
            dAppId: peersData[1].senderId,
            accountPkh: mockMnemonicAccount(2).address.pkh,
            networkType: NetworkType.CUSTOM,
          },
        ].forEach(connection => {
          store.dispatch(beaconActions.addConnection(connection));
        });

        const peerRows = await getPeerRows(4);

        // 2nd saved connection
        expect(within(peerRows[1]).getByTestId("address-pill-text")).toHaveTextContent(
          mockMnemonicAccount(1).label
        );
        expect(within(peerRows[1]).getByTestId("dapp-connection-network")).toHaveTextContent(
          "Ghostnet"
        );
        // 3rd saved connection
        expect(within(peerRows[2]).getByTestId("address-pill-text")).toHaveTextContent(
          mockMnemonicAccount(2).label
        );
        expect(within(peerRows[2]).getByTestId("dapp-connection-network")).toHaveTextContent(
          "Custom"
        );
      });
    });

    describe("for connections without saved info", () => {
      it("hides address pill", async () => {
        const peerRows = await getPeerRows(3);

        expect(within(peerRows[0]).queryByTestId("address-pill")).not.toBeInTheDocument();
      });

      it("hides network", async () => {
        const peerRows = await getPeerRows(3);

        expect(
          within(peerRows[0]).queryByTestId("dapp-connection-network")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("deleting a peer", () => {
    beforeEach(() => {
      jest.spyOn(WalletClient, "removePeer").mockResolvedValue();
    });

    it("sends a delete request through the beacon api", async () => {
      const user = userEvent.setup();
      const peerRows = await getPeerRows(3);

      const deleteButton = within(peerRows[1]).getByRole("button", { name: "Remove Peer" });
      await act(() => user.click(deleteButton));

      expect(WalletClient.removePeer).toHaveBeenCalledWith(peersData[1]);
    });

    it("removes connection from beaconSlice", async () => {
      const user = userEvent.setup();
      [
        {
          dAppId: peersData[0].senderId,
          accountPkh: mockMnemonicAccount(1).address.pkh,
          networkType: NetworkType.MAINNET,
        },
        {
          dAppId: peersData[1].senderId,
          accountPkh: mockMnemonicAccount(1).address.pkh,
          networkType: NetworkType.GHOSTNET,
        },
        {
          dAppId: peersData[1].senderId,
          accountPkh: mockMnemonicAccount(5).address.pkh,
          networkType: NetworkType.FLORENCENET,
        },
        {
          dAppId: peersData[2].senderId,
          accountPkh: mockMnemonicAccount(2).address.pkh,
          networkType: NetworkType.CUSTOM,
        },
      ].forEach(connection => {
        store.dispatch(beaconActions.addConnection(connection));
      });
      const peerRows = await getPeerRows(4);

      const deleteButton = within(peerRows[1]).getByRole("button", {
        name: "Remove Peer",
      });
      await act(() => user.click(deleteButton));

      expect(store.getState().beacon).toEqual({
        [peersData[0].senderId]: {
          [mockMnemonicAccount(1).address.pkh]: NetworkType.MAINNET,
        },
        [peersData[2].senderId]: {
          [mockMnemonicAccount(2).address.pkh]: NetworkType.CUSTOM,
        },
      });
    });
  });
});
