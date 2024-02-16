import { AccountTile } from "./AccountTile";
import {
  mockImplicitAccount,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockNFTRaw,
  mockSocialAccount,
} from "../../mocks/factories";
import { act, render, screen, userEvent } from "../../mocks/testUtils";
import { MnemonicAccount } from "../../types/Account";
import { MAINNET } from "../../types/Network";
import { RawTokenBalance } from "../../types/TokenBalance";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import { tokensActions } from "../../utils/redux/slices/tokensSlice";
import { store } from "../../utils/redux/store";
import { SelectedAccountContext } from "../../views/home/SelectedAccountContext";

describe("<AccountTile />", () => {
  describe.each([
    {
      balance: "3",
      iconTestId: "identicon",
      account: mockMnemonicAccount(0),
      createAction: (acc: MnemonicAccount) => accountsSlice.actions.addMockMnemonicAccounts([acc]),
    },
    {
      balance: "3",
      iconTestId: "ledger-icon",
      account: mockLedgerAccount(0),
      createAction: accountsSlice.actions.addAccount,
    },
    {
      balance: "3",
      iconTestId: "social-icon",
      account: mockSocialAccount(0),
      createAction: accountsSlice.actions.addAccount,
    },
    {
      balance: "3",
      iconTestId: "key-icon",
      account: mockMultisigAccount(0),
      createAction: accountsSlice.actions.addAccount,
    },
  ])("$account.type account", ({ balance, iconTestId, createAction, account }) => {
    beforeEach(() => {
      store.dispatch(createAction(account as any));
    });

    it("renders icon", () => {
      render(<AccountTile account={account} balance={balance} />);

      expect(screen.getByTestId(iconTestId)).toBeInTheDocument();
    });

    it("renders label", () => {
      render(<AccountTile account={account} balance={balance} />);

      expect(screen.getByText(account.label)).toBeInTheDocument();
    });

    describe("account selection", () => {
      const testId = `account-tile-${account.address.pkh}`;

      it("is not selected if nothing has been selected", () => {
        render(
          <SelectedAccountContext.Provider
            value={{ selectAccount: jest.fn(), selectedAccount: null }}
          >
            <AccountTile account={account} balance={balance} />
          </SelectedAccountContext.Provider>
        );

        expect(screen.getByTestId(testId, { exact: true })).toBeInTheDocument();
        expect(screen.queryByTestId(`${testId}-selected`)).not.toBeInTheDocument();
      });

      it("is not selected if another account is selected", () => {
        render(
          <SelectedAccountContext.Provider
            value={{ selectAccount: jest.fn(), selectedAccount: mockImplicitAccount(1) }}
          >
            <AccountTile account={account} balance={balance} />
          </SelectedAccountContext.Provider>
        );

        expect(screen.getByTestId(testId, { exact: true })).toBeInTheDocument();
        expect(screen.queryByTestId(`${testId}-selected`)).not.toBeInTheDocument();
      });

      it("takes the selected account from the outer context", () => {
        render(
          <SelectedAccountContext.Provider
            value={{ selectedAccount: account, selectAccount: jest.fn() }}
          >
            <AccountTile account={account} balance={balance} />
          </SelectedAccountContext.Provider>
        );

        expect(screen.queryByTestId(testId, { exact: true })).not.toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-selected`)).toBeInTheDocument();
      });

      it('calls the "selectAccount" function from the outer context on a click', async () => {
        const user = userEvent.setup();
        const spy = jest.fn();

        render(
          <SelectedAccountContext.Provider value={{ selectedAccount: null, selectAccount: spy }}>
            <AccountTile account={account} balance={balance} />
          </SelectedAccountContext.Provider>
        );

        await act(() => user.click(screen.getByTestId("account-tile-container")));

        expect(spy).toHaveBeenCalledWith(account);
      });
    });

    describe("NFTs", () => {
      it("doesn't render NFTs if none are owned by the account", () => {
        render(<AccountTile account={account} balance={balance} />);

        expect(screen.queryByTestId("nfts-list")).not.toBeInTheDocument();
      });

      it("renders NFTs if there are any", () => {
        const balances = [
          mockNFTRaw(0, account.address.pkh, 1),
          mockNFTRaw(1, account.address.pkh, 1),
        ];
        store.dispatch(assetsActions.updateTokenBalance(balances));
        store.dispatch(
          tokensActions.addTokens({ network: MAINNET, tokens: balances.map(b => b.token) })
        );

        render(<AccountTile account={account} balance={balance} />);

        expect(screen.getByTestId("nfts-list")).toBeInTheDocument();
      });

      it("renders a show more icon if there are more than 6 NFTs", () => {
        const balances = [];

        for (let i = 0; i < 7; i++) {
          const nextTokenBalance = mockNFTRaw(0, account.address.pkh, 1);
          nextTokenBalance.token.tokenId = String(i);
          balances.push(nextTokenBalance);
        }

        store.dispatch(assetsActions.updateTokenBalance(balances));
        store.dispatch(
          tokensActions.addTokens({ network: MAINNET, tokens: balances.map(b => b.token) })
        );

        render(<AccountTile account={account} balance={balance} />);

        expect(screen.getByTestId("nfts-list")).toBeInTheDocument();
        expect(screen.getAllByTestId("nft-link")).toHaveLength(6);
        expect(screen.getByTestId("show-more-nfts-link")).toHaveAttribute(
          "href",
          `#/nfts?accounts=${account.address.pkh}`
        );
      });

      it("renders NFTs sorted by lastLevel desc", () => {
        const balances: RawTokenBalance[] = [
          { ...mockNFTRaw(0, account.address.pkh, 1), lastLevel: 1 }, // TOKEN 2
          { ...mockNFTRaw(0, account.address.pkh, 1), lastLevel: 2 }, // TOKEN 1
          { ...mockNFTRaw(0, account.address.pkh, 1), lastLevel: 3 }, // TOKEN 0
        ];

        for (let i = 0; i < balances.length; i++) {
          balances[i].token.tokenId = String(balances.length - i - 1);
        }

        store.dispatch(assetsActions.updateTokenBalance(balances));
        store.dispatch(
          tokensActions.addTokens({ network: MAINNET, tokens: balances.map(b => b.token) })
        );

        render(<AccountTile account={account} balance={balance} />);

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
