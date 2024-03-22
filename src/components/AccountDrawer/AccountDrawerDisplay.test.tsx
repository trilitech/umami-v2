import { hedgehoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import {
  mockDelegation,
  mockFA1TokenRaw,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
  mockNFTToken,
} from "../../mocks/factories";
import { multisigOperation, multisigs } from "../../mocks/multisig";
import { act, render, screen, userEvent, waitFor, within } from "../../mocks/testUtils";
import { mockTzktTezTransfer } from "../../mocks/transfers";
import { GHOSTNET, MAINNET } from "../../types/Network";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { multisigToAccount } from "../../utils/multisig/helpers";
import { Multisig } from "../../utils/multisig/types";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { assetsSlice } from "../../utils/redux/slices/assetsSlice";
import { multisigActions, multisigsSlice } from "../../utils/redux/slices/multisigsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { tokensSlice } from "../../utils/redux/slices/tokensSlice";
import { store } from "../../utils/redux/store";
import { DelegationOperation, TzktCombinedOperation, getLastDelegation } from "../../utils/tezos";
import * as useGetOperationsModule from "../../views/operations/useGetOperations";

import { AccountCard } from ".";

const { updateTezBalance, updateTokenBalance } = assetsSlice.actions;
const { addMockMnemonicAccounts } = accountsSlice.actions;
const { setMultisigs } = multisigsSlice.actions;

const selectedAccount = mockMnemonicAccount(0);
const pkh = selectedAccount.address.pkh;

beforeEach(() => {
  jest.spyOn(useGetOperationsModule, "useGetOperations").mockReturnValue({
    operations: [
      {
        ...mockTzktTezTransfer(pkh, mockImplicitAccount(1).address.pkh, 1000000),
        id: 1,
      },
      {
        ...mockTzktTezTransfer(mockImplicitAccount(2).address.pkh, pkh, 2000000),
        id: 2,
      },
    ] as TzktCombinedOperation[],
    hasMore: false,
    isFirstLoad: false,
    isLoading: false,
    loadMore: jest.fn(),
  });
  store.dispatch(networksActions.setCurrent(MAINNET));
  store.dispatch(addMockMnemonicAccounts([selectedAccount, mockMnemonicAccount(1)]));
});

describe("<AccountCard />", () => {
  it("displays account name", async () => {
    render(<AccountCard accountPkh={pkh} />);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: selectedAccount.label })).toBeVisible()
    );
  });

  it('displays "Buy Tez" button', async () => {
    render(<AccountCard accountPkh={pkh} />);

    await waitFor(() => expect(screen.getByText("Buy Tez")).toBeVisible());
  });

  it("displays account tez balance", async () => {
    store.dispatch(updateTezBalance([{ address: pkh, balance: 1234554321 }]));

    render(<AccountCard accountPkh={pkh} />);

    await waitFor(() => expect(screen.getByText("1,234.554321 ꜩ")).toBeVisible());
  });

  describe("tzkt link", () => {
    beforeEach(() => {
      store.dispatch(networksActions.setCurrent(GHOSTNET));
    });

    it("is displayed", async () => {
      render(<AccountCard accountPkh={pkh} />);
      await waitFor(() => expect(screen.getByTestId("asset-panel-tablist")).toBeVisible());

      const tzktLink = within(screen.getByTestId("asset-panel-tablist")).getByRole("link", {
        name: "View on Tzkt",
      });
      expect(tzktLink).toBeVisible();
    });

    it("opens correct page according to selected network", async () => {
      render(<AccountCard accountPkh={pkh} />);
      await waitFor(() => expect(screen.getByTestId("asset-panel-tablist")).toBeVisible());

      const tzktLink = within(screen.getByTestId("asset-panel-tablist")).getByRole("link", {
        name: "View on Tzkt",
      });
      const expectedLink = "https://ghostnet.tzkt.io/" + pkh;
      expect(tzktLink).toHaveProperty("href", expectedLink);
    });

    it("is updated on network change", async () => {
      render(<AccountCard accountPkh={pkh} />);
      await waitFor(() => expect(screen.getByTestId("asset-panel-tablist")).toBeVisible());

      await act(() => store.dispatch(networksActions.setCurrent(MAINNET)));

      const tzktLink = within(screen.getByTestId("asset-panel-tablist")).getByRole("link", {
        name: "View on Tzkt",
      });
      const expectedLink = "https://tzkt.io/" + pkh;
      expect(tzktLink).toHaveProperty("href", expectedLink);
    });
  });

  describe("Rename", () => {
    it("updates account name", async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />);
      await waitFor(() => expect(screen.getByTestId("asset-panel-tablist")).toBeVisible());

      await act(() => user.click(screen.getByTestId("popover-cta")));
      await act(() => user.click(screen.getByText("Rename")));
      await act(() => user.clear(screen.getByLabelText("Account name")));
      await act(() => user.type(screen.getByLabelText("Account name"), "New account name"));
      await act(() => user.click(screen.getByRole("button", { name: "Save" })));

      await waitFor(() =>
        expect(screen.queryByRole("heading", { name: "Edit Name" })).not.toBeInTheDocument()
      );
      expect(screen.getByRole("heading", { name: "New account name" })).toBeVisible();
    });
  });

  describe("Operations tab", () => {
    it("is selected by default", async () => {
      render(<AccountCard accountPkh={pkh} />);

      await screen.findByTestId("account-card-operations-tab");

      expect(screen.getByTestId("account-card-operations-tab-panel")).toBeVisible();
    });

    it("contains correct operations data", async () => {
      render(<AccountCard accountPkh={pkh} />);

      const operations = await screen.findAllByTestId(/^operation-tile/);
      expect(operations).toHaveLength(2);
      expect(operations[0]).toHaveTextContent("- 1.000000 ꜩ");
      expect(operations[1]).toHaveTextContent("+ 2.000000 ꜩ");
    });
  });

  describe("Delegation tab", () => {
    const SELECTED_ACCOUNT_BALANCE = 33200000000;

    beforeEach(() => {
      store.dispatch(updateTezBalance([{ address: pkh, balance: SELECTED_ACCOUNT_BALANCE }]));
    });

    it("is not selected by default", async () => {
      render(<AccountCard accountPkh={pkh} />);

      await screen.findByTestId("account-card-delegation-tab");

      expect(screen.getByTestId("account-card-delegation-tab-panel")).not.toBeVisible();
    });

    it('opens on "Delegation" tab click', async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />);
      await screen.findByTestId("account-card-delegation-tab");

      await act(() => user.click(screen.getByTestId("account-card-delegation-tab")));

      expect(screen.getByTestId("account-card-delegation-tab-panel")).toBeVisible();
    });

    it("displays correct delegation data", async () => {
      const user = userEvent.setup();
      jest
        .mocked(getLastDelegation)
        .mockResolvedValue(
          mockDelegation(
            0,
            6000000,
            mockImplicitAddress(2).pkh,
            "Some baker",
            new Date(2020, 5, 24)
          ) as DelegationOperation
        );

      render(<AccountCard accountPkh={pkh} />);
      await screen.findByTestId("account-card-delegation-tab");
      await act(() => user.click(screen.getByTestId("account-card-delegation-tab")));

      const { getByTestId } = within(screen.getByTestId("asset-panel"));
      expect(getByTestId("Initial Balance:")).toHaveTextContent("6.000000 ꜩ");
      expect(getByTestId("Current Balance:")).toHaveTextContent(
        prettyTezAmount(SELECTED_ACCOUNT_BALANCE.toString())
      );
      expect(getByTestId("Duration:")).toHaveTextContent("Since 06/24/2020");
      expect(getByTestId("Baker:")).toHaveTextContent(formatPkh(mockImplicitAddress(2).pkh));
    });
  });

  describe("NFTs tab", () => {
    const mockNft = mockNFTToken(0, pkh);

    beforeEach(() => {
      store.dispatch(updateTokenBalance([mockNft]));
      store.dispatch(
        tokensSlice.actions.addTokens({
          network: MAINNET,
          tokens: [mockNft.token],
        })
      );
    });

    it("is not selected by default", async () => {
      render(<AccountCard accountPkh={pkh} />);
      await screen.findByTestId("account-card-nfts-tab");

      expect(screen.getByTestId("account-card-nfts-tab-panel")).not.toBeVisible();
    });

    it('opens on "NFTs" tab click', async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />);
      await screen.findByTestId("account-card-nfts-tab");

      await act(() => user.click(screen.getByTestId("account-card-nfts-tab")));

      expect(screen.getByTestId("account-card-nfts-tab-panel")).toBeVisible();
    });

    it("contains correct NFTs data", async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />);
      await screen.findByTestId("account-card-nfts-tab");

      await act(() => user.click(screen.getByTestId("account-card-nfts-tab")));

      expect(screen.queryAllByTestId("account-card-nfts-tab")).toHaveLength(1);
    });
  });

  describe("Tokens tab", () => {
    const tokens = [
      hedgehoge(selectedAccount.address),
      tzBtsc(selectedAccount.address),
      uUSD(selectedAccount.address),
      mockFA1TokenRaw(1, pkh, 123),
    ];
    const expectedTokensAttributes = [
      { name: "Hedgehoge", balance: "10,000.000000" },
      { name: "tzBTC", balance: "0.00002205" },
      { name: "FA1.2 token", balance: "123" },
      { name: "youves uUSD", balance: "0.01921875" },
    ];

    beforeEach(() => {
      store.dispatch(updateTokenBalance(tokens));
      store.dispatch(
        tokensSlice.actions.addTokens({
          network: MAINNET,
          tokens: tokens.map(t => t.token),
        })
      );
    });

    it("is not selected by default", async () => {
      render(<AccountCard accountPkh={pkh} />);
      await screen.findByTestId("account-card-tokens-tab");

      expect(screen.getByTestId("account-card-tokens-tab-panel")).not.toBeVisible();
    });

    it('opens on "Tokens" tab click', async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />);
      await screen.findByTestId("account-card-tokens-tab");

      await act(() => user.click(screen.getByTestId("account-card-tokens-tab")));

      expect(screen.getByTestId("account-card-tokens-tab-panel")).toBeVisible();
    });

    it("contains correct tokens data", async () => {
      render(<AccountCard accountPkh={pkh} />);

      const tokenTiles = screen.getAllByTestId("token-tile");
      await waitFor(() => expect(tokenTiles).toHaveLength(expectedTokensAttributes.length));
      for (let i = 0; i < expectedTokensAttributes.length; i++) {
        const { getByTestId } = within(tokenTiles[i]);
        expect(getByTestId("token-name")).toHaveTextContent(expectedTokensAttributes[i].name);
        expect(getByTestId("token-balance")).toHaveTextContent(expectedTokensAttributes[i].balance);
      }
    });
  });

  describe("for multisig account", () => {
    beforeEach(() => {
      store.dispatch(setMultisigs(multisigs));
    });

    const multisigAccount = multisigToAccount(multisigs[2], "my multisig");

    it('hides "Buy Tez" button', async () => {
      render(<AccountCard accountPkh={multisigAccount.address.pkh} />);

      await waitFor(() => expect(screen.queryByText("Buy Tez")).not.toBeInTheDocument());
    });

    it("displays signers", async () => {
      render(<AccountCard accountPkh={multisigAccount.address.pkh} />);
      await screen.findByTestId("multisig-tag-section");

      const signers = screen.getByTestId("multisig-tag-section");
      expect(signers).toBeInTheDocument();
      const { getByText } = within(signers);

      expect(getByText(formatPkh(multisigAccount.signers[0].pkh))).toBeInTheDocument();
    });

    it("displays pending operation if any", async () => {
      store.dispatch(multisigActions.setMultisigs(multisigs));
      store.dispatch(multisigActions.setPendingOperations([multisigOperation]));

      render(<AccountCard accountPkh={multisigAccount.address.pkh} />);
      await screen.findByTestId("account-card-pending-tab-panel");

      const { getAllByTestId } = within(screen.getByTestId("account-card-pending-tab-panel"));
      const pendingOps = getAllByTestId(/multisig-pending-operation/i);
      expect(pendingOps).toHaveLength(1);
      expect(pendingOps[0]).toHaveTextContent(/-0.100000 ꜩ/i);
      expect(pendingOps[0]).toHaveTextContent(/Send to:tz1UN...oBUB3/i);
    });

    it("hides pending operations tab if there are none", async () => {
      const multisigWithNoOps: Multisig = {
        ...multisigs[2],
        pendingOperationsBigmapId: 0,
      };
      store.dispatch(setMultisigs([multisigWithNoOps]));

      render(<AccountCard accountPkh={multisigAccount.address.pkh} />);
      await screen.findByTestId("account-card-operations-tab");

      expect(screen.queryByTestId("account-card-pending-tab-panel")).not.toBeInTheDocument();
    });

    it("displays operations under operations tab if any", async () => {
      render(<AccountCard accountPkh={multisigAccount.address.pkh} />);

      expect(screen.getByTestId("account-card-operations-tab")).toBeVisible();
      const operations = await screen.findAllByTestId(/^operation-tile/);
      expect(operations).toHaveLength(2);
      expect(operations[0]).toHaveTextContent("+ 1.000000 ꜩ");
      expect(operations[1]).toHaveTextContent("+ 2.000000 ꜩ");
    });
  });
});
