import { mockImplicitAccount, mockMnemonicAccount, mockNFTToken } from "@umami/core";
import {
  type UmamiStore,
  addTestAccount,
  assetsSlice,
  makeStore,
  networksActions,
  tokensActions,
} from "@umami/state";
import { MAINNET, mockImplicitAddress } from "@umami/tezos";

import { NFTsView } from "./NftsView";
import { act, render, screen, userEvent } from "../../mocks/testUtils";

const { updateTokenBalance } = assetsSlice.actions;

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockMnemonicAccount(0));
});

describe("NFTsView", () => {
  describe("without NFTs", () => {
    it("display empty state", () => {
      render(<NFTsView />, { store });

      expect(screen.getByTestId("empty-state-message")).toBeVisible();
      expect(screen.getByText("No NFTs to show")).toBeInTheDocument();
      expect(screen.getByText("Your NFT collection will appear here...")).toBeInTheDocument();
      // check Buy NFT button from empty state
      const buyNftButton = screen.getByTestId("buy-nft-button");
      expect(buyNftButton).toBeVisible();
      expect(buyNftButton).toHaveTextContent("Buy your first NFT");
      expect(buyNftButton).toHaveAttribute("href", "https://objkt.com");
    });
  });

  describe("with NFTs", () => {
    beforeEach(() => {
      [mockMnemonicAccount(1), mockMnemonicAccount(2)].forEach(account =>
        addTestAccount(store, account)
      );
      store.dispatch(networksActions.setCurrent(MAINNET));
      store.dispatch(
        updateTokenBalance([
          mockNFTToken(1, mockImplicitAccount(1).address.pkh),
          mockNFTToken(2, mockImplicitAccount(1).address.pkh),
          mockNFTToken(1, mockImplicitAccount(2).address.pkh),
          mockNFTToken(2, mockImplicitAccount(2).address.pkh, { balance: "2" }),
        ])
      );
      store.dispatch(
        tokensActions.addTokens({
          network: MAINNET,
          tokens: [
            mockNFTToken(1, mockImplicitAddress(1).pkh).token,
            mockNFTToken(2, mockImplicitAddress(1).pkh).token,
            mockNFTToken(1, mockImplicitAddress(2).pkh).token,
            mockNFTToken(2, mockImplicitAddress(2).pkh, { balance: "2" }).token,
          ],
        })
      );
    });

    it("hides empty state message", () => {
      render(<NFTsView />, { store });

      expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
      expect(screen.queryByTestId("buy-nft-button")).not.toBeInTheDocument();
    });

    it("displays nfts of all accounts by default", () => {
      render(<NFTsView />, { store });

      expect(screen.getAllByTestId("nft-card")).toHaveLength(4);
      expect(screen.getAllByText("Tezzardz #10")).toHaveLength(4);
    });

    it("displays total amount of nfts", () => {
      render(<NFTsView />, { store });

      expect(screen.getByTestId("nft-total-amount")).toHaveTextContent("5");
    });
  });

  describe("selected NFT", () => {
    beforeEach(() => {
      store.dispatch(updateTokenBalance([mockNFTToken(1, mockMnemonicAccount(0).address.pkh)]));
      store.dispatch(
        tokensActions.addTokens({
          network: MAINNET,
          tokens: [mockNFTToken(1, mockMnemonicAccount(0).address.pkh).token],
        })
      );
    });

    it("doesn't open the drawer if there is no NFT selected", () => {
      render(<NFTsView />, { store });

      expect(screen.queryByTestId("nft-drawer-body")).not.toBeInTheDocument();
    });

    it("opens the drawer when an NFT is clicked", async () => {
      const user = userEvent.setup();

      render(<NFTsView />, { store });

      await act(() => user.click(screen.getByTestId("nft-card")));

      await screen.findByTestId("nft-drawer-body");
    });
  });
});
