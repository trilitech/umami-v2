import { render, screen } from "@testing-library/react";
import {
  mockNFTToken,
  mockImplicitAccount,
  mockImplicitAddress,
  mockSocialOrLedgerAccount,
} from "../../mocks/factories";
import { HashRouter } from "react-router-dom";
import { ReduxStore } from "../../providers/ReduxStore";
import store from "../../utils/redux/store";
import tokensSlice from "../../utils/redux/slices/tokensSlice";
import NFTsViewBase from "./NftsView";
import assetsSlice from "../../utils/redux/slices/assetsSlice";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { MAINNET } from "../../types/Network";
import { networksActions } from "../../utils/redux/slices/networks";

const { updateTokenBalance } = assetsSlice.actions;

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addAccount([mockSocialOrLedgerAccount(0)]));
});

const fixture = () => (
  <ReduxStore>
    <HashRouter>
      <NFTsViewBase />
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
      accountsSlice.actions.addAccount([mockSocialOrLedgerAccount(1), mockSocialOrLedgerAccount(2)])
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
});
