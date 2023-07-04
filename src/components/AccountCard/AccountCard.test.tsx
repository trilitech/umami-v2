import {
  mockFA1Token,
  mockImplicitAccount,
  mockImplicitAddress,
  mockNFTToken,
} from "../../mocks/factories";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";

import { TezosNetwork } from "@airgap/tezos";
import AccountCard from ".";
import { mockDelegationOperation } from "../../mocks/delegations";
import { hedgehoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { multisigOperation, multisigs } from "../../mocks/multisig";
import { act, fireEvent, render, screen, within } from "../../mocks/testUtils";
import { mockTzktTezTransfer } from "../../mocks/transfers";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { multisigToAccount } from "../../utils/multisig/helpers";
import { Multisig } from "../../utils/multisig/types";
import multisigsSlice, { multisigActions } from "../../utils/store/multisigsSlice";
const {
  updateTezBalance,
  updateTokenBalance,
  updateTezTransfers,
  updateNetwork,
  updateDelegations,
} = assetsSlice.actions;
const { add } = accountsSlice.actions;

const { setMultisigs } = multisigsSlice.actions;

const selectedAccount = mockImplicitAccount(0);

const pkh = selectedAccount.address.pkh;
const mockNft = mockNFTToken(0, pkh);

const SELECTED_ACCOUNT_BALANCE = 33200000000;
beforeEach(() => {
  store.dispatch(setMultisigs(multisigs));
  store.dispatch(add([selectedAccount, mockImplicitAccount(1)]));
  store.dispatch(updateTezBalance([{ address: pkh, balance: SELECTED_ACCOUNT_BALANCE }]));
  store.dispatch(
    updateTokenBalance([
      hedgehoge(selectedAccount.address),
      tzBtsc(selectedAccount.address),
      uUSD(selectedAccount.address),
      mockFA1Token(1, pkh, 123),
      mockNft,
    ])
  );
});

afterEach(() => {
  store.dispatch(accountsSlice.actions.reset());
  store.dispatch(assetsSlice.actions.reset());
  store.dispatch(multisigsSlice.actions.reset());
});

describe("<AccountCard />", () => {
  it("should display account name", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByRole("heading", { name: selectedAccount.label })).toBeInTheDocument();
  });

  it("should display buy tez button", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByText(/buy tez/i)).toBeInTheDocument();
  });

  it("should display account tez balance", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByText("33200 ꜩ")).toBeInTheDocument();
  });

  it("should display link to tzkt according to network", async () => {
    render(<AccountCard account={selectedAccount} />);
    const tzktLink = screen.getByTestId("asset-panel-tablist");
    const link = within(tzktLink).getByRole("link", {});
    const expectedLink = "https://tzkt.io/" + selectedAccount.address.pkh;
    expect(link).toHaveProperty("href", expectedLink);

    {
      act(() => store.dispatch(updateNetwork(TezosNetwork.GHOSTNET)));

      const tzktLink = screen.getByTestId("asset-panel-tablist");
      const link = within(tzktLink).getByRole("link", {});
      const expectedLink = "https://ghostnet.tzkt.io/" + selectedAccount.address.pkh;
      expect(link).toHaveProperty("href", expectedLink);
    }
  });

  it("should display assets tabs with tokens by default", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByTestId("account-card-tokens-tab")).toBeInTheDocument();
  });

  test("tokens tab should display no tokens message if account has no tokens", () => {
    // Remove all assets in the store
    store.dispatch(assetsSlice.actions.reset());

    render(<AccountCard account={selectedAccount} />);

    screen.getByTestId("account-card-tokens-tab").click();

    const { getByText } = within(screen.getByTestId("asset-panel"));
    expect(getByText(/no tokens found/i)).toBeInTheDocument();
  });

  test("tokens tab should display token infos correctly", () => {
    render(<AccountCard account={selectedAccount} />);
    const tokenTiles = screen.getAllByTestId("token-tile");
    expect(tokenTiles).toHaveLength(4);

    {
      const { getByTestId } = within(tokenTiles[0]);
      expect(getByTestId("token-name")).toHaveTextContent("Hedgehoge");
      expect(getByTestId("token-balance")).toHaveTextContent("10000");
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
      expect(getByTestId("token-balance")).toHaveTextContent("0.0123");
      expect(getByTestId("token-symbol")).toHaveTextContent("FA1.2");
    }

    {
      const { getByTestId } = within(tokenTiles[3]);
      expect(getByTestId("token-name")).toHaveTextContent("youves uUSD");
      expect(getByTestId("token-balance")).toHaveTextContent("0.01921875");
      expect(getByTestId("token-symbol")).toHaveTextContent("uUSD");
    }
  });

  it("should display nfts under nfts tab", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByTestId("account-card-nfts-tab")).toBeInTheDocument();
    screen.getByTestId("account-card-nfts-tab").click();
    expect(screen.queryAllByTestId("account-card-nfts-tab")).toHaveLength(1);
    expect(screen.getByText(mockNft.token?.metadata?.name as string)).toBeInTheDocument();
  });

  it("should display accounts operations under operations tab if any", () => {
    store.dispatch(
      updateTezTransfers([
        {
          pkh: selectedAccount.address.pkh,
          transfers: [
            mockTzktTezTransfer(
              selectedAccount.address.pkh,
              mockImplicitAccount(1).address.pkh,
              1000000
            ),
            mockTzktTezTransfer(
              mockImplicitAccount(2).address.pkh,
              selectedAccount.address.pkh,
              2000000
            ),
          ],
        },
        {
          pkh: mockImplicitAccount(1).address.pkh,
          transfers: [
            mockTzktTezTransfer(
              mockImplicitAccount(1).address.pkh,
              mockImplicitAccount(1).address.pkh,
              5000000
            ),
          ],
        },
      ])
    );

    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
    screen.getByTestId("account-card-operations-tab").click();
    const operations = screen.getAllByTestId("operation-tile");
    expect(operations).toHaveLength(2);
    expect(operations[0]).toHaveTextContent("-1 ꜩ");
    expect(operations[1]).toHaveTextContent("+2 ꜩ");
  });

  it("should display no operations if account has no operations", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
    screen.getByTestId("account-card-operations-tab").click();
    const { getByText } = within(screen.getByTestId("asset-panel"));
    expect(getByText(/no operations/i)).toBeTruthy();
  });
  describe("delegations", () => {
    it("Given an account has no delegations, it should display a message saying so and a CTA button to delegate", () => {
      render(<AccountCard account={selectedAccount} />);
      screen.getByTestId("account-card-delegation-tab").click();
      const { getByText } = within(screen.getByTestId("asset-panel"));
      expect(getByText(/Currently not delegating/i)).toBeTruthy();
      const btn = screen.getByText(/start delegating/i);
      fireEvent.click(btn);
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveTextContent(/delegate/i);
    });

    it("Given an account has an active delegation, it show display the delegation and CTA buttons to change delegate or undelegate", () => {
      store.dispatch(
        updateDelegations([
          {
            pkh: selectedAccount.address.pkh,
            delegation: mockDelegationOperation(
              selectedAccount.address.pkh,
              mockImplicitAddress(2).pkh,
              6000000
            ),
          },
          {
            pkh: mockImplicitAccount(3).address.pkh,
            delegation: mockDelegationOperation(
              mockImplicitAccount(2).address.pkh,
              mockImplicitAddress(3).pkh,
              8000000
            ),
          },
        ])
      );

      render(<AccountCard account={selectedAccount} />);
      screen.getByTestId("account-card-delegation-tab").click();
      const { getByTestId } = within(screen.getByTestId("asset-panel"));

      expect(getByTestId(/initial balance/i)).toHaveTextContent("6 ꜩ");
      expect(getByTestId(/current balance/i)).toHaveTextContent(
        prettyTezAmount(SELECTED_ACCOUNT_BALANCE.toString())
      );
      expect(getByTestId(/duration/i)).toHaveTextContent("Since 05/24/2020");
      expect(getByTestId(/baker/i)).toHaveTextContent("tz1ik...Cc43D");

      const changeDelegateBtn = screen.getByText(/change baker/i);
      const removeDelegateBtn = screen.getByText(/end delegation/i);
      expect(removeDelegateBtn).toBeInTheDocument();

      fireEvent.click(changeDelegateBtn);
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveTextContent(/delegate/i);
    });
  });

  describe("multisig", () => {
    const multisigAccount = multisigToAccount(multisigs[2], "my multisig");
    test("multisig accounts don't display a buy tez button", () => {
      render(<AccountCard account={multisigAccount} />);
      expect(screen.queryByText(/buy tez/i)).not.toBeInTheDocument();
    });

    test("multisig accounts display pending operations if any", () => {
      store.dispatch(multisigActions.setMultisigs(multisigs));
      store.dispatch(multisigActions.setPendingOperations([multisigOperation]));

      render(<AccountCard account={multisigAccount} />);
      const { getAllByTestId } = within(screen.getByTestId("account-card-pending-tab-panel"));
      const pendingOps = getAllByTestId("multisig-pending-operations");
      expect(pendingOps).toHaveLength(1);
      expect(pendingOps[0]).toHaveTextContent(/-0.1 ꜩ/i);
      expect(pendingOps[0]).toHaveTextContent(/Send to :tz1UN...oBUB3/i);
    });

    test("multisig accounts display no pending operations message if there are none", () => {
      const multisigWithNoOps: Multisig = {
        ...multisigs[2],
        pendingOperationsBigmapId: 0,
      };
      store.dispatch(setMultisigs([multisigWithNoOps]));
      render(<AccountCard account={multisigAccount} />);
      const { queryAllByTestId, getByText } = within(
        screen.getByTestId("account-card-pending-tab-panel")
      );
      const pendingOps = queryAllByTestId("multisig-pending-operations");
      expect(pendingOps).toHaveLength(0);
      expect(getByText(/No multisig pending operations/i)).toBeInTheDocument();
    });

    it("multisig account display operations under operations tab if any", () => {
      store.dispatch(
        updateTezTransfers([
          {
            pkh: multisigAccount.address.pkh,
            transfers: [
              mockTzktTezTransfer(
                multisigAccount.address.pkh,
                mockImplicitAccount(1).address.pkh,
                1000000
              ),
              mockTzktTezTransfer(
                mockImplicitAccount(2).address.pkh,
                multisigAccount.address.pkh,
                2000000
              ),
            ],
          },
        ])
      );

      render(<AccountCard account={multisigAccount} />);
      expect(screen.getByTestId("account-card-operations-tab")).toBeInTheDocument();
      screen.getByTestId("account-card-operations-tab").click();
      const operations = screen.getAllByTestId("operation-tile");
      expect(operations).toHaveLength(2);
      expect(operations[0]).toHaveTextContent(/-1 ꜩ/i);
      expect(operations[1]).toHaveTextContent(/\+2 ꜩ/i);
    });

    it("multisig accounts display multisig signers", () => {
      render(<AccountCard account={multisigAccount} />);

      const signers = screen.getByTestId("multisig-tag-section");
      expect(signers).toBeInTheDocument();
      const { getByText } = within(signers);

      expect(getByText(formatPkh(multisigAccount.signers[0].pkh))).toBeTruthy();
    });
  });
});
