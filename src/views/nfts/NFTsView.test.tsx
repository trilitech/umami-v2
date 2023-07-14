import { render, screen } from "@testing-library/react";
import { mockNFTToken, mockImplicitAccount } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import NFTsViewBase from "./NftsView";

const { updateTokenBalance } = assetsSlice.actions;

beforeEach(() => {
  store.dispatch(accountsSlice.actions.add([mockImplicitAccount(0)]));
});

afterEach(() => {
  store.dispatch(accountsSlice.actions.reset());
  store.dispatch(assetsSlice.actions.reset());
});

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
    store.dispatch(accountsSlice.actions.add([mockImplicitAccount(1), mockImplicitAccount(2)]));
    store.dispatch(
      updateTokenBalance([
        mockNFTToken(1, mockImplicitAccount(1).address.pkh),
        mockNFTToken(2, mockImplicitAccount(1).address.pkh),
        mockNFTToken(1, mockImplicitAccount(2).address.pkh),
        mockNFTToken(2, mockImplicitAccount(2).address.pkh),
      ])
    );

    render(fixture());

    expect(screen.getAllByTestId("nft-card")).toHaveLength(4);
  });
});
