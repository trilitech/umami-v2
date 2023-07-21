import { render, screen } from "@testing-library/react";
import { mockNFTToken, mockImplicitAccount, mockImplicitAddress } from "../../mocks/factories";
import { HashRouter } from "react-router-dom";
import { ReduxStore } from "../../providers/ReduxStore";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import tokensSlice from "../../utils/store/tokensSlice";
import NFTsViewBase from "./NftsView";
import { TezosNetwork } from "../../types/TezosNetwork";

const { updateTokenBalance, updateNetwork } = assetsSlice.actions;

beforeEach(() => {
  store.dispatch(accountsSlice.actions.add([mockImplicitAccount(0)]));
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
    store.dispatch(accountsSlice.actions.add([mockImplicitAccount(1), mockImplicitAccount(2)]));
    store.dispatch(updateNetwork(TezosNetwork.MAINNET));
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
        network: TezosNetwork.MAINNET,
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
