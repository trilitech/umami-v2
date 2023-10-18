import {
  mockFA1TokenRaw,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
  mockNFTToken,
} from "../../mocks/factories";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import assetsSlice from "../../utils/redux/slices/assetsSlice";
import store from "../../utils/redux/store";

import AccountCard from ".";
import { hedgehoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { multisigOperation, multisigs } from "../../mocks/multisig";
import { act, fireEvent, render, screen, waitFor, within } from "../../mocks/testUtils";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { multisigToAccount } from "../../utils/multisig/helpers";
import { Multisig } from "../../utils/multisig/types";
import multisigsSlice, { multisigActions } from "../../utils/redux/slices/multisigsSlice";
import tokensSlice from "../../utils/redux/slices/tokensSlice";
import { GHOSTNET, MAINNET } from "../../types/Network";
import { networksActions } from "../../utils/redux/slices/networks";
import {
  DelegationOperation,
  TzktCombinedOperation,
  getCombinedOperations,
  getLastDelegation,
  getTokenTransfers,
} from "../../utils/tezos";
import { mockTzktTezTransfer } from "../../mocks/transfers";
import { mockDelegation } from "../../mocks/factories";
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

  jest.mocked(getTokenTransfers).mockResolvedValue([]);

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
      act(() => store.dispatch(networksActions.setCurrent(GHOSTNET)));
      await waitFor(() => {
        expect(screen.getByTestId("asset-panel-tablist")).toBeInTheDocument();
      });
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
    // Remove all assets in the store
    store.dispatch(assetsSlice.actions.reset());

    render(<AccountCard account={selectedAccount} />);

    fireEvent.click(screen.getByTestId("account-card-tokens-tab"));
    await waitFor(() => {
      expect(screen.getByTestId("asset-panel")).toBeInTheDocument();
    });
    const { getByText } = within(screen.getByTestId("asset-panel"));
    expect(getByText(/no tokens found/i)).toBeInTheDocument();
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
      expect(getByTestId("token-symbol")).toHaveTextContent("HEH");
    }

    {
      const { getByTestId } = within(tokenTiles[1]);
      expect(getByTestId("token-name")).toHaveTextContent("tzBTC");
      expect(getByTestId("token-balance")).toHaveTextContent("0.00002205");
      expect(getByTestId("token-symbol")).toHaveTextContent("tzBTC");
    }

    {
      const { getByTestId } = within(tokenTiles[2]);
      expect(getByTestId("token-name")).toHaveTextContent("FA1.2 token");
      expect(getByTestId("token-balance")).toHaveTextContent("123");
      expect(getByTestId("token-symbol")).toHaveTextContent("FA1.2");
    }

    {
      const { getByTestId } = within(tokenTiles[3]);
      expect(getByTestId("token-name")).toHaveTextContent("youves uUSD");
      expect(getByTestId("token-balance")).toHaveTextContent("0.01921875");
      expect(getByTestId("token-symbol")).toHaveTextContent("uUSD");
    }
  });

  it("should display nfts under nfts tab", async () => {
    render(<AccountCard account={selectedAccount} />);
    await waitFor(() => {
      expect(screen.getByTestId("account-card-nfts-tab")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("account-card-nfts-tab"));
    expect(screen.queryAllByTestId("account-card-nfts-tab")).toHaveLength(1);
  });

  it("should display accounts operations under operations tab if any", async () => {
    render(<AccountCard account={selectedAccount} />);
    await waitFor(() => {
      expect(screen.getAllByTestId("operation-tile")).toHaveLength(2);
    });
    expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
    const operations = screen.getAllByTestId("operation-tile");
    expect(operations[0]).toHaveTextContent("- 1.000000 ꜩ");
    expect(operations[1]).toHaveTextContent("+ 2.000000 ꜩ");
  });

  it("should display no operations if account has no operations", async () => {
    jest.mocked(getCombinedOperations).mockResolvedValue([]);
    render(<AccountCard account={selectedAccount} />);
    await waitFor(() => {
      expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
    });
    const { getByText } = within(screen.getByTestId("asset-panel"));
    await waitFor(() => {
      expect(getByText(/no operations/i)).toBeTruthy();
    });
  });

  describe("delegations", () => {
    it("Given an account has no delegations, it should display a message saying so and a CTA button to delegate", async () => {
      render(<AccountCard account={selectedAccount} />);
      await waitFor(() => {
        expect(screen.getByTestId("account-card-delegation-tab")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId("account-card-delegation-tab"));
      const { getByText } = within(screen.getByTestId("asset-panel"));
      expect(getByText(/Currently not delegating/i)).toBeTruthy();
      const btn = screen.getByText(/start delegating/i);
      fireEvent.click(btn);
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveTextContent(/delegate/i);
    });

    it("Given an account has an active delegation, it show display the delegation and CTA buttons to change delegate or undelegate", async () => {
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
      fireEvent.click(screen.getByTestId("account-card-delegation-tab"));
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

      fireEvent.click(changeDelegateBtn);
      await waitFor(() => {
        const modal = screen.getByRole("dialog");
        expect(modal).toHaveTextContent(/Change Baker/i);
      });
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

    test("multisig accounts display no pending operations message if there are none", async () => {
      const multisigWithNoOps: Multisig = {
        ...multisigs[2],
        pendingOperationsBigmapId: 0,
      };
      store.dispatch(setMultisigs([multisigWithNoOps]));
      render(<AccountCard account={multisigAccount} />);
      await waitFor(() => {
        expect(screen.getByTestId("account-card-pending-tab-panel")).toBeInTheDocument();
      });
      const { queryAllByTestId, getByText } = within(
        screen.getByTestId("account-card-pending-tab-panel")
      );
      const pendingOps = queryAllByTestId(/multisig-pending-operations/i);
      expect(pendingOps).toHaveLength(0);
      expect(getByText(/No multisig pending operations/i)).toBeInTheDocument();
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
        expect(screen.getAllByTestId("operation-tile")).toHaveLength(2);
      });
      expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
      const operations = screen.getAllByTestId("operation-tile");
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
