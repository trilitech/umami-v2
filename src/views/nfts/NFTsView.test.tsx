import { render, screen } from "@testing-library/react";
import { HashRouter } from "react-router-dom";

import { NFTsView } from "./NftsView";
import {
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
  mockNFTToken,
} from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
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

const fixture = () => (
  <ReduxStore>
    <HashRouter>
      <NFTsView />
    </HashRouter>
  </ReduxStore>
);

describe("NFTsView", () => {
  it("a message 'no nfts found' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/no nfts found/i)).toBeInTheDocument();
  });

  it("displays nfts of all accounts by default", () => {
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
        mockNFTToken(2, mockImplicitAccount(2).address.pkh),
      ])
    );
    store.dispatch(
      tokensSlice.actions.addTokens({
        network: MAINNET,
        tokens: [
          mockNFTToken(1, mockImplicitAddress(1).pkh).token,
          mockNFTToken(2, mockImplicitAddress(1).pkh).token,
          mockNFTToken(1, mockImplicitAddress(2).pkh).token,
          mockNFTToken(2, mockImplicitAddress(2).pkh).token,
        ],
      })
    );

    render(fixture());

    expect(screen.getAllByTestId("nft-card")).toHaveLength(4);
    expect(screen.getAllByText("Tezzardz #10")).toHaveLength(4);
  });

  it("displays total amount of nfts", () => {
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
        mockNFTToken(2, mockImplicitAccount(2).address.pkh, 2),
      ])
    );
    store.dispatch(
      tokensSlice.actions.addTokens({
        network: MAINNET,
        tokens: [
          mockNFTToken(1, mockImplicitAddress(1).pkh).token,
          mockNFTToken(2, mockImplicitAddress(2).pkh, 2).token,
        ],
      })
    );

    render(fixture());

    expect(screen.getByTestId("nft-total-amount")).toHaveTextContent("3");
  });
});
