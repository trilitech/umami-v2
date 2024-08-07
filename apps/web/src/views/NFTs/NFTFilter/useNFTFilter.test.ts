import { mockImplicitAccount, mockNFTToken } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  assetsActions,
  makeStore,
  tokensActions,
} from "@umami/state";
import { MAINNET } from "@umami/tezos";

import { useNFTFilter } from "./useNFTFilter";
import { renderHook } from "../../../testUtils";

let store: UmamiStore;

const account = mockImplicitAccount(0);
const address = account.address.pkh;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, account);
  store.dispatch(accountsActions.setCurrent(address));
});

describe("useNFTFilter", () => {
  it("returns sorted nfts", () => {
    const nfts = [
      mockNFTToken(2, address, { lastLevel: 2 }),
      mockNFTToken(0, address, { lastLevel: 0 }),
      mockNFTToken(1, address, { lastLevel: 1 }),
    ];
    store.dispatch(assetsActions.updateTokenBalance(nfts));
    store.dispatch(
      tokensActions.addTokens({ tokens: nfts.map(nft => nft.token), network: MAINNET })
    );

    const {
      result: {
        current: { nfts: sortedNfts },
      },
    } = renderHook(() => useNFTFilter(), { store });

    expect(sortedNfts).toEqual([
      expect.objectContaining({ contract: nfts[0].token.contract.address }),
      expect.objectContaining({ contract: nfts[2].token.contract.address }),
      expect.objectContaining({ contract: nfts[1].token.contract.address }),
    ]);
  });

  it("returns sorted checkbox options", () => {
    const nfts = [
      mockNFTToken(2, address, { lastLevel: 2 }),
      mockNFTToken(0, address, { lastLevel: 0 }),
      mockNFTToken(1, address, { lastLevel: 1 }),
    ];
    nfts[1].token.contract.alias = "Contract NAME";
    store.dispatch(assetsActions.updateTokenBalance(nfts));
    store.dispatch(
      tokensActions.addTokens({ tokens: nfts.map(nft => nft.token), network: MAINNET })
    );

    const {
      result: {
        current: { options },
      },
    } = renderHook(() => useNFTFilter(), { store });

    expect(options).toEqual([
      ["Contract NAME", nfts[1].token.contract.address],
      [nfts[2].token.contract.address, nfts[2].token.contract.address],
      [nfts[0].token.contract.address, nfts[0].token.contract.address],
    ]);
  });
});
