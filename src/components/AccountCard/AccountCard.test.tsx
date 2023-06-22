import {
  mockFA1Token,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMultisigAccount,
  mockNFTToken,
} from "../../mocks/factories";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";

import AccountCard from ".";
import { hedgeHoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { render, screen, within } from "../../mocks/testUtils";
import { mockTzktTezTransfer } from "../../mocks/transfers";
const { updateTezBalance, updateTokenBalance, updateTezTransfers } = assetsSlice.actions;
const { add } = accountsSlice.actions;

const tezBalance = "33200000000";

const selectedAccount = mockImplicitAccount(0);
const pkh = selectedAccount.address.pkh;
const mockNft = mockNFTToken(0, pkh);
beforeEach(() => {
  store.dispatch(add([selectedAccount, mockImplicitAccount(1)]));
  store.dispatch(updateTezBalance([{ pkh: pkh, tez: tezBalance }]));
  store.dispatch(
    updateTokenBalance([
      {
        pkh: selectedAccount.address.pkh,
        tokens: [
          hedgeHoge,
          tzBtsc,
          uUSD,
          mockFA1Token(1, mockImplicitAddress(1).pkh, 123),
          mockNft,
        ],
      },
    ])
  );

  store.dispatch(
    updateTokenBalance([
      {
        pkh: selectedAccount.address.pkh,
        tokens: [
          hedgeHoge,
          tzBtsc,
          uUSD,
          mockFA1Token(1, mockImplicitAddress(1).pkh, 123),
          mockNft,
        ],
      },
    ])
  );
});

afterEach(() => {
  store.dispatch(accountsSlice.actions.reset());
  store.dispatch(assetsSlice.actions.reset());
});

describe("<AccountCard />", () => {
  it("should display account name", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByRole("heading", { name: selectedAccount.label })).toBeInTheDocument();
  });

  it("accountCard displays multisig signers", () => {
    render(<AccountCard account={mockMultisigAccount(0)} />);

    expect(screen.getByTestId("multisig-tag-section")).toBeInTheDocument();
  });

  it("should display account tez balance", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByText("33200 ꜩ")).toBeInTheDocument();
  });

  it("should display assets tabs with tokens by default", () => {
    render(<AccountCard account={selectedAccount} />);
    expect(screen.getByTestId("account-card-tokens-tab")).toBeInTheDocument();
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
});
