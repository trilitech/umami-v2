import {
  mockImplicitAccount,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockNFTRaw,
  mockSocialAccount,
} from "@umami/core";
import {
  type UmamiStore,
  addTestAccount,
  assetsActions,
  makeStore,
  tokensActions,
} from "@umami/state";
import { MAINNET } from "@umami/tezos";
import { type RawTzktTokenBalance } from "@umami/tzkt";

import { AccountTile } from "./AccountTile";
import { act, render, screen, userEvent } from "../../mocks/testUtils";
import { SelectedAccountContext } from "../../views/home/SelectedAccountContext";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<AccountTile />", () => {
  describe.each([
    {
      iconTestId: "identicon",
      account: mockMnemonicAccount(0),
    },
    {
      iconTestId: "ledger-icon",
      account: mockLedgerAccount(0),
    },
    {
      iconTestId: "google-icon",
      account: mockSocialAccount(0),
    },
    {
      iconTestId: "key-icon",
      account: mockMultisigAccount(0),
    },
  ])("$account.type account", ({ iconTestId, account }) => {
    beforeEach(() => addTestAccount(store, account));

    it("renders icon", () => {
      render(<AccountTile account={account} />, { store });

      expect(screen.getByTestId(iconTestId)).toBeInTheDocument();
    });

    it("renders label", () => {
      render(<AccountTile account={account} />, { store });

      expect(screen.getByText(account.label)).toBeInTheDocument();
    });

    describe("account selection", () => {
      const testId = `account-tile-${account.address.pkh}`;

      it("is not selected if nothing has been selected", () => {
        render(
          <SelectedAccountContext.Provider
            value={{ selectAccount: jest.fn(), selectedAccount: null }}
          >
            <AccountTile account={account} />
          </SelectedAccountContext.Provider>,
          { store }
        );

        expect(screen.getByTestId(testId, { exact: true })).toBeInTheDocument();
        expect(screen.queryByTestId(`${testId}-selected`)).not.toBeInTheDocument();
      });

      it("is not selected if another account is selected", () => {
        render(
          <SelectedAccountContext.Provider
            value={{ selectAccount: jest.fn(), selectedAccount: mockImplicitAccount(1) }}
          >
            <AccountTile account={account} />
          </SelectedAccountContext.Provider>,
          { store }
        );

        expect(screen.getByTestId(testId, { exact: true })).toBeInTheDocument();
        expect(screen.queryByTestId(`${testId}-selected`)).not.toBeInTheDocument();
      });

      it("takes the selected account from the outer context", () => {
        render(
          <SelectedAccountContext.Provider
            value={{ selectedAccount: account, selectAccount: jest.fn() }}
          >
            <AccountTile account={account} />
          </SelectedAccountContext.Provider>,
          { store }
        );

        expect(screen.queryByTestId(testId, { exact: true })).not.toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-selected`)).toBeInTheDocument();
      });

      it('calls the "selectAccount" function from the outer context on a click', async () => {
        const user = userEvent.setup();
        const spy = jest.fn();

        render(
          <SelectedAccountContext.Provider value={{ selectedAccount: null, selectAccount: spy }}>
            <AccountTile account={account} />
          </SelectedAccountContext.Provider>,
          { store }
        );

        await act(() => user.click(screen.getByTestId("account-tile-container")));

        expect(spy).toHaveBeenCalledWith(account);
      });
    });

    describe("NFTs", () => {
      it("doesn't render NFTs if none are owned by the account", () => {
        render(<AccountTile account={account} />, { store });

        expect(screen.queryByTestId("nfts-list")).not.toBeInTheDocument();
      });

      it("renders NFTs if there are any", () => {
        const balances = [mockNFTRaw(0, account.address.pkh), mockNFTRaw(1, account.address.pkh)];
        store.dispatch(assetsActions.updateTokenBalance(balances));
        store.dispatch(
          tokensActions.addTokens({ network: MAINNET, tokens: balances.map(b => b.token) })
        );

        render(<AccountTile account={account} />, { store });

        expect(screen.getByTestId("nfts-list")).toBeInTheDocument();
      });

      it("renders a show more icon if there are more than 6 NFTs", () => {
        const balances = [];

        for (let i = 0; i < 7; i++) {
          const nextTokenBalance = mockNFTRaw(0, account.address.pkh);
          nextTokenBalance.token.tokenId = String(i);
          balances.push(nextTokenBalance);
        }

        store.dispatch(assetsActions.updateTokenBalance(balances));
        store.dispatch(
          tokensActions.addTokens({ network: MAINNET, tokens: balances.map(b => b.token) })
        );

        render(<AccountTile account={account} />, { store });

        expect(screen.getByTestId("nfts-list")).toBeInTheDocument();
        expect(screen.getAllByTestId("nft-link")).toHaveLength(6);
        expect(screen.getByTestId("show-more-nfts-link")).toHaveAttribute(
          "href",
          `#/nfts?accounts=${account.address.pkh}`
        );
      });

      it("renders NFTs sorted by lastLevel desc", () => {
        const balances: RawTzktTokenBalance[] = [
          mockNFTRaw(0, account.address.pkh, { lastLevel: 1 }), // TOKEN 2
          mockNFTRaw(0, account.address.pkh, { lastLevel: 2 }), // TOKEN 1
          mockNFTRaw(0, account.address.pkh, { lastLevel: 3 }), // TOKEN 0
        ];

        for (let i = 0; i < balances.length; i++) {
          balances[i].token.tokenId = String(balances.length - i - 1);
        }

        store.dispatch(assetsActions.updateTokenBalance(balances));
        store.dispatch(
          tokensActions.addTokens({ network: MAINNET, tokens: balances.map(b => b.token) })
        );

        render(<AccountTile account={account} />, { store });

        expect(screen.getByTestId("nfts-list")).toBeInTheDocument();
        const urlPrefix = `#/home/${account.address.pkh}/${balances[0].token.contract.address}`;
        expect(screen.getAllByTestId("nft-link").map(el => el.getAttribute("href"))).toEqual([
          `${urlPrefix}:0`,
          `${urlPrefix}:1`,
          `${urlPrefix}:2`,
        ]);
      });
    });
  });
});
