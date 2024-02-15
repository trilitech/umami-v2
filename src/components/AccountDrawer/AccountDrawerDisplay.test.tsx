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
import {
  DelegationOperation,
  TzktCombinedOperation,
  getCombinedOperations,
  getLastDelegation,
  getRelatedTokenTransfers,
} from "../../utils/tezos";

import { AccountCard } from ".";
const { updateTezBalance, updateTokenBalance } = assetsSlice.actions;
const { addMockMnemonicAccounts } = accountsSlice.actions;

const { setMultisigs } = multisigsSlice.actions;

const selectedAccount = mockMnemonicAccount(0);

const pkh = selectedAccount.address.pkh;
const mockNft = mockNFTToken(0, pkh);

const SELECTED_ACCOUNT_BALANCE = 33200000000;
beforeEach(() => {
  store.dispatch(networksActions.setCurrent(MAINNET));
  store.dispatch(setMultisigs(multisigs));
  store.dispatch(addMockMnemonicAccounts([selectedAccount, mockMnemonicAccount(1)]));
  store.dispatch(updateTezBalance([{ address: pkh, balance: SELECTED_ACCOUNT_BALANCE }]));
  store.dispatch(
    updateTokenBalance([
      hedgehoge(selectedAccount.address),
      tzBtsc(selectedAccount.address),
      uUSD(selectedAccount.address),
      mockFA1TokenRaw(1, pkh, 123),
      mockNft,
    ])
  );
  store.dispatch(
    tokensSlice.actions.addTokens({
      network: MAINNET,
      tokens: [
        hedgehoge(selectedAccount.address).token,
        tzBtsc(selectedAccount.address).token,
        uUSD(selectedAccount.address).token,
        mockFA1TokenRaw(1, pkh, 123).token,
        mockNft.token,
      ],
    })
  );

  jest.mocked(getCombinedOperations).mockResolvedValue([
    {
      ...mockTzktTezTransfer(
        selectedAccount.address.pkh,
        mockImplicitAccount(1).address.pkh,
        1000000
      ),
      id: 1,
    } as TzktCombinedOperation,
    {
      ...mockTzktTezTransfer(
        mockImplicitAccount(2).address.pkh,
        selectedAccount.address.pkh,
        2000000
      ),
      id: 2,
    } as TzktCombinedOperation,
  ]);

  jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

  jest.mocked(getLastDelegation).mockResolvedValue(undefined);
});

describe("<AccountCard />", () => {
  it("should display account name", async () => {
    render(<AccountCard account={selectedAccount} />);
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: selectedAccount.label })).toBeInTheDocument();
    });
  });

  it("should display buy tez button", async () => {
    render(<AccountCard account={selectedAccount} />);
    await waitFor(() => {
      expect(screen.getByText(/buy tez/i)).toBeInTheDocument();
    });
  });

  it("should display account tez balance", async () => {
    render(<AccountCard account={selectedAccount} />);
    await waitFor(() => {
      expect(screen.getByText("33,200.000000 ꜩ")).toBeInTheDocument();
    });
  });

  it("should display link to tzkt according to network", async () => {
    render(<AccountCard account={selectedAccount} />);
    await waitFor(() => {
      expect(screen.getByTestId("asset-panel-tablist")).toBeInTheDocument();
    });
    const tzktLink = screen.getByTestId("asset-panel-tablist");
    const link = within(tzktLink).getByRole("link", {});
    const expectedLink = "https://tzkt.io/" + selectedAccount.address.pkh;
    expect(link).toHaveProperty("href", expectedLink);

    {
      await act(() => store.dispatch(networksActions.setCurrent(GHOSTNET)));

      expect(screen.getByTestId("asset-panel-tablist")).toBeInTheDocument();

      const tzktLink = screen.getByTestId("asset-panel-tablist");
      const link = within(tzktLink).getByRole("link", {});
      const expectedLink = "https://ghostnet.tzkt.io/" + selectedAccount.address.pkh;
      expect(link).toHaveProperty("href", expectedLink);
    }
  });

  it("should display assets tabs with tokens by default", async () => {
    render(<AccountCard account={selectedAccount} />);
    await waitFor(() => {
      expect(screen.getByTestId("account-card-tokens-tab")).toBeInTheDocument();
    });
  });

  test("tokens tab should display no tokens message if account has no tokens", async () => {
    const user = userEvent.setup();
    // Remove all assets in the store
    store.dispatch(assetsSlice.actions.reset());

    render(<AccountCard account={selectedAccount} />);

    await act(() => user.click(screen.getByTestId("account-card-tokens-tab")));
    expect(screen.getByTestId("asset-panel")).toBeInTheDocument();

    const { getByText } = within(screen.getByTestId("asset-panel"));
    expect(getByText("No tokens to show")).toBeInTheDocument();
  });

  test("tokens tab should display token infos correctly", async () => {
    render(<AccountCard account={selectedAccount} />);
    const tokenTiles = screen.getAllByTestId("token-tile");
    await waitFor(() => {
      expect(tokenTiles).toHaveLength(4);
    });

    {
      const { getByTestId } = within(tokenTiles[0]);
      expect(getByTestId("token-name")).toHaveTextContent("Hedgehoge");
      expect(getByTestId("token-balance")).toHaveTextContent("10,000.000000");
    }

    {
      const { getByTestId } = within(tokenTiles[1]);
      expect(getByTestId("token-name")).toHaveTextContent("tzBTC");
      expect(getByTestId("token-balance")).toHaveTextContent("0.00002205");
    }

    {
      const { getByTestId } = within(tokenTiles[2]);
      expect(getByTestId("token-name")).toHaveTextContent("FA1.2 token");
      expect(getByTestId("token-balance")).toHaveTextContent("123");
    }

    {
      const { getByTestId } = within(tokenTiles[3]);
      expect(getByTestId("token-name")).toHaveTextContent("youves uUSD");
      expect(getByTestId("token-balance")).toHaveTextContent("0.01921875");
    }
  });

  it("should display nfts under nfts tab", async () => {
    const user = userEvent.setup();
    render(<AccountCard account={selectedAccount} />);

    await waitFor(() => {
      expect(screen.getByTestId("account-card-nfts-tab")).toBeInTheDocument();
    });

    await act(() => user.click(screen.getByTestId("account-card-nfts-tab")));

    expect(screen.queryAllByTestId("account-card-nfts-tab")).toHaveLength(1);
  });

  it("displays accounts operations under operations tab if account has operations", async () => {
    render(<AccountCard account={selectedAccount} />);

    await waitFor(() => {
      expect(screen.getAllByTestId(/^operation-tile/)).toHaveLength(2);
    });

    expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
    const operations = screen.getAllByTestId(/^operation-tile/);
    expect(operations[0]).toHaveTextContent("- 1.000000 ꜩ");
    expect(operations[1]).toHaveTextContent("+ 2.000000 ꜩ");
  });

  it("hides operations empty state message if account has operations", async () => {
    const user = userEvent.setup();
    render(<AccountCard account={selectedAccount} />);

    await waitFor(() => {
      expect(screen.getAllByTestId(/^operation-tile/)).toHaveLength(2);
    });

    await act(() => user.click(screen.getByTestId("account-card-operations-tab")));

    const { queryByTestId } = within(screen.getByTestId("account-card-operations-tab-panel"));
    await waitFor(() => {
      expect(queryByTestId("empty-state-message")).not.toBeInTheDocument();
    });
  });

  it("displays operations empty state message if account has no operations", async () => {
    const user = userEvent.setup();
    jest.mocked(getCombinedOperations).mockResolvedValue([]);
    render(<AccountCard account={selectedAccount} />);

    await waitFor(() => {
      expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
    });

    await act(() => user.click(screen.getByTestId("account-card-operations-tab")));

    // check empty state message
    const { getByText, getByTestId } = within(
      screen.getByTestId("account-card-operations-tab-panel")
    );
    expect(getByTestId("empty-state-message")).toBeVisible();
    expect(getByText("No operations to show")).toBeVisible();
    expect(getByText("Your operations history will appear here...")).toBeVisible();
    // check View All Operations button from empty state
    const viewAllOperationsButton = screen.getByTestId("view-all-operations-button");
    expect(viewAllOperationsButton).toBeVisible();
    expect(viewAllOperationsButton).toHaveTextContent("View All Operations");
    expect(viewAllOperationsButton).toHaveAttribute("href", "#/operations");
  });

  describe("delegations", () => {
    it("shows empty state with delegate button when no delegations", async () => {
      const user = userEvent.setup();
      render(<AccountCard account={selectedAccount} />);

      await waitFor(() => {
        expect(screen.getByTestId("account-card-delegation-tab")).toBeInTheDocument();
      });

      await act(() => user.click(screen.getByTestId("account-card-delegation-tab")));

      expect(screen.getByTestId("empty-state-message")).toBeVisible();
      expect(screen.getByText("No delegations to show")).toBeVisible();
      expect(screen.getByText("Your delegation history will appear here...")).toBeVisible();

      await act(() => user.click(screen.getByTestId("delegation-empty-state-button")));

      expect(screen.getByTestId("delegate-form")).toBeVisible();
      const { getByText } = within(screen.getByTestId("delegate-form"));
      expect(getByText("Delegate")).toBeVisible();
    });

    it("displays delegation and action buttons when with active delegation", async () => {
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

      render(<AccountCard account={selectedAccount} />);
      await waitFor(() => {
        expect(screen.getByTestId("account-card-delegation-tab")).toBeInTheDocument();
      });

      await act(() => user.click(screen.getByTestId("account-card-delegation-tab")));

      const { getByTestId } = within(screen.getByTestId("asset-panel"));
      expect(getByTestId(/initial balance/i)).toHaveTextContent("6.000000 ꜩ");
      expect(getByTestId(/current balance/i)).toHaveTextContent(
        prettyTezAmount(SELECTED_ACCOUNT_BALANCE.toString())
      );
      expect(getByTestId(/duration/i)).toHaveTextContent("Since 06/24/2020");
      expect(getByTestId(/baker/i)).toHaveTextContent("tz1ik...Cc43D");

      const changeDelegateBtn = screen.getByText(/change baker/i);
      const removeDelegateBtn = screen.getByText(/end delegation/i);
      expect(removeDelegateBtn).toBeInTheDocument();

      await act(() => user.click(changeDelegateBtn));

      const modal = screen.getByRole("dialog");
      expect(modal).toHaveTextContent(/Change Baker/i);
    });
  });

  describe("multisig", () => {
    const multisigAccount = multisigToAccount(multisigs[2], "my multisig");
    test("multisig accounts don't display a buy tez button", async () => {
      render(<AccountCard account={multisigAccount} />);

      await waitFor(() => {
        expect(screen.queryByText(/buy tez/i)).not.toBeInTheDocument();
      });
    });

    test("multisig accounts display pending operations if any", async () => {
      store.dispatch(multisigActions.setMultisigs(multisigs));
      store.dispatch(multisigActions.setPendingOperations([multisigOperation]));

      render(<AccountCard account={multisigAccount} />);
      await waitFor(() => {
        expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
      });

      const { getAllByTestId } = within(screen.getByTestId("account-card-pending-tab-panel"));
      const pendingOps = getAllByTestId(/multisig-pending-operation/i);
      expect(pendingOps).toHaveLength(1);
      expect(pendingOps[0]).toHaveTextContent(/-0.100000 ꜩ/i);
      expect(pendingOps[0]).toHaveTextContent(/Send to :tz1UN...oBUB3/i);
    });

    test("multisig accounts display should not have pending operations tab if there are none", async () => {
      const multisigWithNoOps: Multisig = {
        ...multisigs[2],
        pendingOperationsBigmapId: 0,
      };
      store.dispatch(setMultisigs([multisigWithNoOps]));

      render(<AccountCard account={multisigAccount} />);

      await waitFor(() => {
        // wait for the component to load
        expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
      });

      expect(screen.queryByTestId("account-card-pending-tab-panel")).not.toBeInTheDocument();
    });

    it("multisig account display operations under operations tab if any", async () => {
      jest.mocked(getCombinedOperations).mockResolvedValue([
        {
          ...mockTzktTezTransfer(
            mockImplicitAccount(0).address.pkh,
            multisigAccount.address.pkh,
            1000000
          ),
          id: 1,
        } as TzktCombinedOperation,
        {
          ...mockTzktTezTransfer(
            multisigAccount.address.pkh,
            mockImplicitAccount(5).address.pkh,
            2000000
          ),
          id: 2,
        } as TzktCombinedOperation,
      ]);

      render(<AccountCard account={multisigAccount} />);
      await waitFor(() => {
        expect(screen.getAllByTestId(/^operation-tile/)).toHaveLength(2);
      });

      expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
      const operations = screen.getAllByTestId(/^operation-tile/);
      expect(operations[0]).toHaveTextContent("- 1.000000 ꜩ");
      expect(operations[1]).toHaveTextContent("- 2.000000 ꜩ");
    });

    it("multisig accounts display multisig signers", async () => {
      render(<AccountCard account={multisigAccount} />);
      await waitFor(() => {
        expect(screen.getByTestId("multisig-tag-section")).toBeInTheDocument();
      });

      const signers = screen.getByTestId("multisig-tag-section");
      expect(signers).toBeInTheDocument();
      const { getByText } = within(signers);

      expect(getByText(formatPkh(multisigAccount.signers[0].pkh))).toBeTruthy();
    });
  });
});
