import { TezosNetwork } from "@airgap/tezos";
import { render, screen } from "@testing-library/react";
import { mockNFTToken, mockImplicitAddress } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import tokensSlice from "../../utils/store/tokensSlice";
import NFTsViewBase from "./NftsView";

const { updateTokenBalance, updateNetwork } = assetsSlice.actions;

const fixture = () => (
  <ReduxStore>
    <NFTsViewBase />
  </ReduxStore>
);

afterEach(() => {
  store.dispatch(tokensSlice.actions.reset());
  store.dispatch(assetsSlice.actions.reset());
});

describe("NFTsView", () => {
  it("a message 'no nfts found' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/no nfts found/i)).toBeInTheDocument();
  });

  it("displays nfts of all accounts by default", () => {
    store.dispatch(updateNetwork(TezosNetwork.MAINNET));
    store.dispatch(
      updateTokenBalance([
        mockNFTToken(1, mockImplicitAddress(1).pkh),
        mockNFTToken(2, mockImplicitAddress(1).pkh),
        mockNFTToken(1, mockImplicitAddress(2).pkh),
        mockNFTToken(2, mockImplicitAddress(2).pkh),
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
  });
});
