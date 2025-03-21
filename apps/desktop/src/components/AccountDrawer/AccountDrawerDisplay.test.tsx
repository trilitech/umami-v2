import {
  mockFA1TokenRaw,
  mockImplicitAccount,
  mockMnemonicAccount,
  mockMultisigAccount,
  mockNFTToken,
  rawAccountFixture,
} from "@umami/core";
import { useGetOperations } from "@umami/data-polling";
import { type Multisig, multisigOperationFixture, multisigsFixture } from "@umami/multisig";
import {
  type UmamiStore,
  addTestAccount,
  assetsSlice,
  makeStore,
  multisigsActions,
  networksActions,
  tokensActions,
} from "@umami/state";
import { hedgehoge, tzBtsc, uUSD } from "@umami/test-utils";
import { GHOSTNET, MAINNET, formatPkh } from "@umami/tezos";
import { type TzktCombinedOperation, mockTzktTezTransfer } from "@umami/tzkt";

import { act, render, screen, userEvent, waitFor, within } from "../../mocks/testUtils";

import { AccountCard } from ".";

const { updateAccountStates, updateTokenBalance } = assetsSlice.actions;

const selectedAccount = mockMnemonicAccount(0);
const pkh = selectedAccount.address.pkh;

let store: UmamiStore;

jest.mock("@umami/data-polling");

beforeEach(() => {
  store = makeStore();
  jest.mocked(useGetOperations).mockReturnValue({
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
    triggerRef: { current: null },
  });
  store.dispatch(networksActions.setCurrent(MAINNET));
  addTestAccount(store, selectedAccount);
  addTestAccount(store, mockMnemonicAccount(1));
});

describe("<AccountDrawerDisplay />", () => {
  it("displays account name", async () => {
    render(<AccountCard accountPkh={pkh} />, { store });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: selectedAccount.label })).toBeVisible()
    );
  });

  it('displays "Buy Tez" button', async () => {
    render(<AccountCard accountPkh={pkh} />, { store });

    await waitFor(() => expect(screen.getByText("Buy Tez")).toBeVisible());
  });

  it("displays account tez balance", async () => {
    store.dispatch(updateAccountStates([rawAccountFixture({ address: pkh, balance: 1234554321 })]));

    render(<AccountCard accountPkh={pkh} />, { store });

    await waitFor(() => expect(screen.getByText("1,234.554321 XTZ")).toBeVisible());
  });

  describe("tzkt link", () => {
    beforeEach(() => store.dispatch(networksActions.setCurrent(GHOSTNET)));

    it("is displayed", async () => {
      render(<AccountCard accountPkh={pkh} />, { store });
      await waitFor(() => expect(screen.getByTestId("asset-panel-tablist")).toBeVisible());

      const tzktLink = within(screen.getByTestId("asset-panel-tablist")).getByRole("link", {
        name: "View on TzKT",
      });
      expect(tzktLink).toBeVisible();
    });

    it("opens correct page according to selected network", async () => {
      render(<AccountCard accountPkh={pkh} />, { store });
      await waitFor(() => expect(screen.getByTestId("asset-panel-tablist")).toBeVisible());

      const tzktLink = within(screen.getByTestId("asset-panel-tablist")).getByRole("link", {
        name: "View on TzKT",
      });
      const expectedLink = "https://ghostnet.tzkt.io/" + pkh;
      expect(tzktLink).toHaveProperty("href", expectedLink);
    });

    it("is updated on network change", async () => {
      render(<AccountCard accountPkh={pkh} />, { store });
      await waitFor(() => expect(screen.getByTestId("asset-panel-tablist")).toBeVisible());

      await act(() => store.dispatch(networksActions.setCurrent(MAINNET)));

      const tzktLink = within(screen.getByTestId("asset-panel-tablist")).getByRole("link", {
        name: "View on TzKT",
      });
      const expectedLink = "https://tzkt.io/" + pkh;
      expect(tzktLink).toHaveProperty("href", expectedLink);
    });
  });

  describe("Rename", () => {
    it("updates account name", async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />, { store });
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
      render(<AccountCard accountPkh={pkh} />, { store });

      await screen.findByTestId("account-card-operations-tab");

      expect(screen.getByTestId("account-card-operations-tab-panel")).toBeVisible();
    });

    it("contains correct operations data", async () => {
      render(<AccountCard accountPkh={pkh} />, { store });

      const operations = await screen.findAllByTestId(/^operation-tile/);
      expect(operations).toHaveLength(2);
      expect(operations[0]).toHaveTextContent("- 1.000000 XTZ");
      expect(operations[1]).toHaveTextContent("+ 2.000000 XTZ");
    });
  });

  describe("Delegation tab", () => {
    const SELECTED_ACCOUNT_BALANCE = 33200000000;

    beforeEach(() =>
      store.dispatch(
        updateAccountStates([
          rawAccountFixture({ address: pkh, balance: SELECTED_ACCOUNT_BALANCE }),
        ])
      )
    );

    it("is not selected by default", async () => {
      render(<AccountCard accountPkh={pkh} />, { store });

      await screen.findByTestId("account-card-earn-tab");

      expect(screen.getByTestId("account-card-earn-tab-panel")).not.toBeVisible();
    });

    it('opens on "Delegation" tab click', async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />, { store });
      await screen.findByTestId("account-card-earn-tab");

      await act(() => user.click(screen.getByTestId("account-card-earn-tab")));

      expect(screen.getByTestId("account-card-earn-tab-panel")).toBeVisible();
    });
  });

  describe("NFTs tab", () => {
    const mockNft = mockNFTToken(0, pkh);

    beforeEach(() => {
      store.dispatch(updateTokenBalance([mockNft]));
      store.dispatch(
        tokensActions.addTokens({
          network: MAINNET,
          tokens: [mockNft.token],
        })
      );
    });

    it("is not selected by default", async () => {
      render(<AccountCard accountPkh={pkh} />, { store });
      await screen.findByTestId("account-card-nfts-tab");

      expect(screen.getByTestId("account-card-nfts-tab-panel")).not.toBeVisible();
    });

    it('opens on "NFTs" tab click', async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />, { store });
      await screen.findByTestId("account-card-nfts-tab");

      await act(() => user.click(screen.getByTestId("account-card-nfts-tab")));

      expect(screen.getByTestId("account-card-nfts-tab-panel")).toBeVisible();
    });

    it("contains correct NFTs data", async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />, { store });
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
        tokensActions.addTokens({
          network: MAINNET,
          tokens: tokens.map(t => t.token),
        })
      );
    });

    it("is not selected by default", async () => {
      render(<AccountCard accountPkh={pkh} />, { store });
      await screen.findByTestId("account-card-tokens-tab");

      expect(screen.getByTestId("account-card-tokens-tab-panel")).not.toBeVisible();
    });

    it('opens on "Tokens" tab click', async () => {
      const user = userEvent.setup();
      render(<AccountCard accountPkh={pkh} />, { store });
      await screen.findByTestId("account-card-tokens-tab");

      await act(() => user.click(screen.getByTestId("account-card-tokens-tab")));

      expect(screen.getByTestId("account-card-tokens-tab-panel")).toBeVisible();
    });

    it("contains correct tokens data", async () => {
      render(<AccountCard accountPkh={pkh} />, { store });

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
    const multisigAccount = { ...mockMultisigAccount(0), ...multisigsFixture[2] };

    beforeEach(() => {
      jest.mocked(useGetOperations).mockReturnValue({
        operations: [
          {
            ...mockTzktTezTransfer(pkh, multisigAccount.address.pkh, 1000000),
            id: 1,
          },
          {
            ...mockTzktTezTransfer(multisigAccount.address.pkh, pkh, 2000000),
            id: 2,
          },
        ] as TzktCombinedOperation[],
        hasMore: false,
        isFirstLoad: false,
        isLoading: false,
        loadMore: jest.fn(),
        triggerRef: { current: null },
      });
      multisigsFixture.forEach(account => addTestAccount(store, account));
    });

    it('hides "Buy Tez" button', async () => {
      render(<AccountCard accountPkh={multisigAccount.address.pkh} />, { store });

      await waitFor(() => expect(screen.queryByText("Buy Tez")).not.toBeInTheDocument());
    });

    it("displays signers", async () => {
      render(<AccountCard accountPkh={multisigAccount.address.pkh} />, { store });
      await screen.findByTestId("multisig-tag-section");

      const signers = screen.getByTestId("multisig-tag-section");
      expect(signers).toBeInTheDocument();
      const { getByText } = within(signers);

      expect(getByText(formatPkh(multisigAccount.signers[0].pkh))).toBeInTheDocument();
    });

    it("displays pending operation if any", async () => {
      multisigsFixture.forEach(account => addTestAccount(store, account));
      store.dispatch(multisigsActions.setPendingOperations([multisigOperationFixture]));

      render(<AccountCard accountPkh={multisigAccount.address.pkh} />, { store });
      await screen.findByTestId("account-card-pending-tab-panel");

      const { getAllByTestId } = within(screen.getByTestId("account-card-pending-tab-panel"));
      const pendingOps = getAllByTestId(/multisig-pending-operation/i);
      expect(pendingOps).toHaveLength(1);
      expect(pendingOps[0]).toHaveTextContent(/-0.100000 XTZ/i);
      expect(pendingOps[0]).toHaveTextContent(/Send to:tz1UN...oBUB3/i);
    });

    it("hides pending operations tab if there are none", async () => {
      const multisigWithNoOps: Multisig = {
        ...multisigsFixture[2],
        pendingOperationsBigmapId: 0,
      };
      addTestAccount(store, multisigWithNoOps);

      render(<AccountCard accountPkh={multisigAccount.address.pkh} />, { store });
      await screen.findByTestId("account-card-operations-tab");

      expect(screen.queryByTestId("account-card-pending-tab-panel")).not.toBeInTheDocument();
    });

    it("displays operations under operations tab if any", async () => {
      render(<AccountCard accountPkh={multisigAccount.address.pkh} />, { store });

      expect(screen.getByTestId("account-card-operations-tab")).toBeVisible();
      const operations = await screen.findAllByTestId(/^operation-tile/);
      expect(operations).toHaveLength(2);
      expect(operations[0]).toHaveTextContent("- 1.000000 XTZ");
      expect(operations[1]).toHaveTextContent("- 2.000000 XTZ");
    });
  });
});
