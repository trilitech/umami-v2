import { render, screen } from "@testing-library/react";
import { mockNFTToken, mockImplicitAddress } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import NFTsViewBase from "./NftsView";

const { updateAssets } = assetsSlice.actions;

const fixture = () => (
  <ReduxStore>
    <NFTsViewBase />
  </ReduxStore>
);

describe("NFTsView", () => {
  it("a message 'no nfts found' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/no nfts found/i)).toBeInTheDocument();
  });

  it("displays nfts of all accounts by default", () => {
    store.dispatch(
      updateAssets([
        {
          pkh: mockImplicitAddress(1).pkh,
          tokens: [
            mockNFTToken(1, mockImplicitAddress(1).pkh),
            mockNFTToken(2, mockImplicitAddress(1).pkh),
          ],
        },
      ])
    );

    store.dispatch(
      updateAssets([
        {
          pkh: mockImplicitAddress(2).pkh,
          tokens: [
            mockNFTToken(1, mockImplicitAddress(2).pkh),
            mockNFTToken(2, mockImplicitAddress(2).pkh),
          ],
        },
      ])
    );

    render(fixture());

    expect(screen.getAllByTestId("nft-card")).toHaveLength(4);
  });
});
