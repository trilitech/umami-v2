import { mockImplicitAccount, mockNFTRaw } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
  tokensActions,
} from "@umami/state";
import { MAINNET, mockImplicitAddress } from "@umami/tezos";

import { NFTs } from "./NFTs";
import { render, screen } from "../../testUtils";

let store: UmamiStore;
const account = mockImplicitAccount(0);
beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(account.address.pkh));
});

describe("<NFTs />", () => {
  it("renders an empty message if the account has no NFTs", () => {
    render(<NFTs />, { store });

    const emptyMessage = screen.getByTestId("empty-state-message");

    expect(emptyMessage).toBeVisible();
    expect(emptyMessage).toHaveTextContent("Your NFTs will appear here...");
  });

  it("renders the total count of NFTs", () => {
    const nftBalances = [
      mockNFTRaw(0, account.address.pkh, { balance: 1 }),
      mockNFTRaw(1, account.address.pkh, { balance: 5 }),
    ];
    store.dispatch(assetsActions.updateTokenBalance(nftBalances));
    store.dispatch(
      tokensActions.addTokens({ network: MAINNET, tokens: nftBalances.map(b => b.token) })
    );

    render(<NFTs />, { store });

    expect(screen.getByTestId("total-count")).toHaveTextContent("6");
  });

  it("renders all NFTs for the current account", () => {
    const nftBalances = [
      mockNFTRaw(0, account.address.pkh, { balance: 1 }),
      mockNFTRaw(1, account.address.pkh, { balance: 5 }),
      mockNFTRaw(2, mockImplicitAddress(2).pkh, { balance: 100 }),
    ];
    store.dispatch(assetsActions.updateTokenBalance(nftBalances));
    store.dispatch(
      tokensActions.addTokens({ network: MAINNET, tokens: nftBalances.map(b => b.token) })
    );

    render(<NFTs />, { store });

    expect(screen.getAllByTestId("nft-card")).toHaveLength(2);
  });
});
