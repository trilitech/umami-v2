import { type ExtendedPeerInfo, NetworkType } from "@airgap/beacon-wallet";
import { mockMnemonicAccount } from "@umami/core";
import {
  type UmamiStore,
  WalletClient,
  addTestAccounts,
  beaconActions,
  makeStore,
  walletKit,
} from "@umami/state";
import { formatPkh } from "@umami/tezos";
import { type SessionTypes } from "@walletconnect/types";

import { GenericConnections } from "./GenericConnections";
import { act, render, screen, userEvent, within } from "../../../testUtils";

const mockDisconnectWalletConnectPeer = jest.fn();

jest.mock("@walletconnect/utils", () => ({
  getSdkError: jest.fn(),
}));

jest.mock("@umami/state", () => ({
  ...jest.requireActual("@umami/state"),
  useDisconnectWalletConnectPeer: () => mockDisconnectWalletConnectPeer,
  walletKit: {
    core: {},
    metadata: {
      name: "AppMenu test",
      description: "Umami Wallet with WalletConnect",
      url: "https://umamiwallet.com",
      icons: ["https://umamiwallet.com/assets/favicon-32-45gq0g6M.png"],
    },
    getActiveSessions: jest.fn(),
    disconnectSession: jest.fn(),
  },
  createWalletKit: jest.fn(),
}));

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

const mockWcSession = {
  topic: "wc-topic-1",
  peer: {
    metadata: {
      name: "WC dApp",
      icons: ["https://example.com/icon.png"],
    },
  },
  namespaces: {
    tezos: {
      accounts: [`tezos:mainnet:${mockMnemonicAccount(1).address.pkh}`],
      chains: ["tezos:mainnet"],
    },
  },
} as unknown as SessionTypes.Struct;

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccounts(store, [mockMnemonicAccount(1), mockMnemonicAccount(2)]);
  jest.spyOn(WalletClient, "getPeers").mockResolvedValue(peersData);
  jest.spyOn(walletKit, "getActiveSessions").mockReturnValue({
    "wc-topic-1": mockWcSession,
  });
});

describe("<GenericConnections />", () => {
  describe("list of paired dApps", () => {
    it("shows empty list when no paired dApps", () => {
      jest.spyOn(WalletClient, "getPeers").mockResolvedValue([]);
      jest.spyOn(walletKit, "getActiveSessions").mockReturnValue({});

      render(<GenericConnections />, { store });

      expect(screen.queryByTestId("peer-row")).not.toBeInTheDocument();
    });

    it("contains dApp names", async () => {
      render(<GenericConnections />, { store });

      const peerRows = await screen.findAllByTestId("peer-row");

      expect(peerRows).toHaveLength(4);
      expect(peerRows[0]).toHaveTextContent("dApp-1");
      expect(peerRows[1]).toHaveTextContent("dApp-2");
      expect(peerRows[2]).toHaveTextContent("dApp-3");
      expect(peerRows[3]).toHaveTextContent("WC dApp");
    });

    it("shows enabled delete button for each dApp", async () => {
      render(<GenericConnections />, { store });

      const peerRows = await screen.findAllByTestId("peer-row");

      for (const peerRow of peerRows) {
        const deleteButton = within(peerRow).getByRole("button", { name: "Remove Peer" });
        expect(deleteButton).toBeEnabled();
      }
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

        render(<GenericConnections />, { store });
        const peerRows = await screen.findAllByTestId("peer-row");

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

        render(<GenericConnections />, { store });
        const peerRows = await screen.findAllByTestId("peer-row");

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

        render(<GenericConnections />, { store });
        const peerRows = await screen.findAllByTestId("peer-row");

        const network = within(peerRows[2]).getByTestId("dapp-connection-network");
        expect(network).toHaveTextContent("Oxfordnet");
      });
    });

    describe("for connections without saved info", () => {
      it("hides address pill", async () => {
        render(<GenericConnections />, { store });

        const peerRows = await screen.findAllByTestId("peer-row");

        expect(within(peerRows[0]).queryByTestId("address-pill")).not.toBeInTheDocument();
      });

      it("hides network", async () => {
        render(<GenericConnections />, { store });

        const peerRows = await screen.findAllByTestId("peer-row");

        expect(
          within(peerRows[0]).queryByTestId("dapp-connection-network")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("WalletConnect peers", () => {
    beforeEach(() => {
      mockDisconnectWalletConnectPeer.mockReset();

      jest.spyOn(WalletClient, "getPeers").mockResolvedValue([]);
      jest.spyOn(walletKit, "getActiveSessions").mockReturnValue({
        "wc-topic-1": mockWcSession,
      });
    });

    it("displays WalletConnect peer info", async () => {
      render(<GenericConnections />, { store });

      const peerRows = await screen.findByTestId("peer-row");
      expect(peerRows).toHaveTextContent("WC dApp");

      const addressPill = within(peerRows).getByTestId("address-pill-text");
      expect(addressPill).toHaveTextContent(mockMnemonicAccount(1).label);

      const network = within(peerRows).getByTestId("dapp-connection-network");
      expect(network).toHaveTextContent("Mainnet");
    });

    it("handles WalletConnect peer disconnection", async () => {
      const user = userEvent.setup();

      render(<GenericConnections />, { store });

      const deleteButton = await screen.findByRole("button", { name: "Remove Peer" });
      await act(() => user.click(deleteButton));

      expect(mockDisconnectWalletConnectPeer).toHaveBeenCalledWith({
        topic: "wc-topic-1",
      });
    });
  });

  describe("empty state", () => {
    it("shows empty message when no peers are connected", async () => {
      jest.spyOn(WalletClient, "getPeers").mockResolvedValue([]);
      jest.spyOn(walletKit, "getActiveSessions").mockReturnValue({});

      render(<GenericConnections />, { store });

      expect(await screen.findByTestId("beacon-peers-empty")).toBeInTheDocument();
      expect(screen.queryByTestId("peer-row")).not.toBeInTheDocument();
    });
  });

  describe("deleting a peer", () => {
    beforeEach(() => {
      jest.spyOn(WalletClient, "removePeer").mockResolvedValue();
    });

    it("sends a delete request through the beacon api", async () => {
      const user = userEvent.setup();
      render(<GenericConnections />, { store });

      const peerRows = await screen.findAllByTestId("peer-row");

      const deleteButton = within(peerRows[1]).getByRole("button", { name: "Remove Peer" });
      await act(() => user.click(deleteButton));

      expect(WalletClient.removePeer).toHaveBeenCalledWith(peersData[1], true);
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
          dAppId: peersData[2].senderId,
          accountPkh: mockMnemonicAccount(2).address.pkh,
          networkType: NetworkType.CUSTOM,
        },
      ].forEach(connection => {
        store.dispatch(beaconActions.addConnection(connection));
      });
      render(<GenericConnections />, { store });

      const peerRows = await screen.findAllByTestId("peer-row");

      const deleteButton = within(peerRows[1]).getByRole("button", {
        name: "Remove Peer",
      });
      await act(() => user.click(deleteButton));

      expect(store.getState().beacon).toEqual({
        [peersData[0].senderId]: {
          accountPkh: mockMnemonicAccount(1).address.pkh,
          networkType: NetworkType.MAINNET,
        },
        [peersData[2].senderId]: {
          accountPkh: mockMnemonicAccount(2).address.pkh,
          networkType: NetworkType.CUSTOM,
        },
      });
    });
  });
});
