import { render, screen } from "@testing-library/react";
import { mockNFTToken, mockPkh } from "../../mocks/factories";
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
          pkh: mockPkh(1),
          tokens: [mockNFTToken(1, mockPkh(1)), mockNFTToken(2, mockPkh(1))],
        },
      ])
    );

    store.dispatch(
      updateAssets([
        {
          pkh: mockPkh(2),
          tokens: [mockNFTToken(1, mockPkh(2)), mockNFTToken(2, mockPkh(2))],
        },
      ])
    );

    render(fixture());

    expect(screen.getAllByTestId("nft-card")).toHaveLength(4);
  });
});
