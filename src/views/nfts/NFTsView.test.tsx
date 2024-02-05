import { userEvent } from "@testing-library/user-event";

import { NFTsView } from "./NftsView";
import {
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
  mockNFTToken,
} from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { MAINNET } from "../../types/Network";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { assetsSlice } from "../../utils/redux/slices/assetsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { tokensSlice } from "../../utils/redux/slices/tokensSlice";
import { store } from "../../utils/redux/store";

const { updateTokenBalance } = assetsSlice.actions;

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
});

describe("NFTsView", () => {
  describe("without NFTs", () => {
    it("display empty state", () => {
      render(<NFTsView />);

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
      store.dispatch(
        accountsSlice.actions.addMockMnemonicAccounts([
          mockMnemonicAccount(1),
          mockMnemonicAccount(2),
        ])
      );
      store.dispatch(networksActions.setCurrent(MAINNET));
      store.dispatch(
        updateTokenBalance([
          mockNFTToken(1, mockImplicitAccount(1).address.pkh),
          mockNFTToken(2, mockImplicitAccount(1).address.pkh),
          mockNFTToken(1, mockImplicitAccount(2).address.pkh),
          mockNFTToken(2, mockImplicitAccount(2).address.pkh, 2),
        ])
      );
      store.dispatch(
        tokensSlice.actions.addTokens({
          network: MAINNET,
          tokens: [
            mockNFTToken(1, mockImplicitAddress(1).pkh).token,
            mockNFTToken(2, mockImplicitAddress(1).pkh).token,
            mockNFTToken(1, mockImplicitAddress(2).pkh).token,
            mockNFTToken(2, mockImplicitAddress(2).pkh, 2).token,
          ],
        })
      );
    });

    it("hides empty state message", () => {
      render(<NFTsView />);

      expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
      expect(screen.queryByTestId("buy-nft-button")).not.toBeInTheDocument();
    });

    it("displays nfts of all accounts by default", () => {
      render(<NFTsView />);

      expect(screen.getAllByTestId("nft-card")).toHaveLength(4);
      expect(screen.getAllByText("Tezzardz #10")).toHaveLength(4);
    });

    it("displays total amount of nfts", () => {
      render(<NFTsView />);

      expect(screen.getByTestId("nft-total-amount")).toHaveTextContent("5");
    });
  });

  describe("selected NFT", () => {
    beforeEach(() => {
      store.dispatch(updateTokenBalance([mockNFTToken(1, mockMnemonicAccount(0).address.pkh)]));
      store.dispatch(
        tokensSlice.actions.addTokens({
          network: MAINNET,
          tokens: [mockNFTToken(1, mockMnemonicAccount(0).address.pkh).token],
        })
      );
    });

    it("doesn't open the drawer if there is no NFT selected", () => {
      render(<NFTsView />);

      expect(screen.queryByTestId("nft-drawer-body")).not.toBeInTheDocument();
    });

    it("opens the drawer when an NFT is clicked", async () => {
      const user = userEvent.setup();

      render(<NFTsView />);

      user.click(screen.getByTestId("nft-card"));

      await screen.findByTestId("nft-drawer-body");
    });
  });
});
