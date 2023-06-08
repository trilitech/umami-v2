import {
  mockAccount,
  mockFA1Token,
  mockNFTToken,
  mockPkh,
} from "../../mocks/factories";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";

import AccountCard from ".";
import { uUSD } from "../../mocks/fa2Tokens";
import { render, screen, within } from "../../mocks/testUtils";
import { hedgeHoge, tzBtsc } from "../../mocks/fa12Tokens";
import { AccountType, MultisigAccount } from "../../types/Account";
const { updateAssets } = assetsSlice.actions;
const { add, setSelected } = accountsSlice.actions;

const tezBalance = "33200000000";

const account = mockAccount(0);
const pkh = account.pkh;
const mockNft = mockNFTToken(0, pkh);
beforeAll(() => {
  store.dispatch(add([account]));
  store.dispatch(setSelected(pkh));
  store.dispatch(updateAssets([{ pkh: pkh, tez: tezBalance }]));
  store.dispatch(
    updateAssets([
      {
        pkh: mockAccount(0).pkh,
        tokens: [
          hedgeHoge,
          tzBtsc,
          uUSD,
          mockFA1Token(1, mockPkh(1), 123),
          mockNft,
        ],
      },
    ])
  );
});

describe("<AccountCard />", () => {
  it("should display account name", () => {
    render(<AccountCard account={account} />);
    expect(
      screen.getByRole("heading", { name: account.label })
    ).toBeInTheDocument();
  });

  it("accountCard displays multisig signers", () => {
    const mockMultisigAccount = {
      type: AccountType.MULTISIG,
      pkh: "pkh",
      label: "label",
      threshold: 1,
      signers: ["signers2"],
      balance: "1",
      operations: [],
    } as MultisigAccount;

    render(<AccountCard account={mockMultisigAccount} />);

    expect(screen.getByTestId("multisig-tag-section")).toBeInTheDocument();
  });

  it("should display account tez balance", () => {
    render(<AccountCard account={account} />);
    expect(screen.getByText("33200 ꜩ")).toBeInTheDocument();
  });

  it("should display assets tabs with tokens by default", () => {
    render(<AccountCard account={account} />);
    expect(screen.getByTestId("account-card-tokens-tab")).toBeInTheDocument();
  });

  test("tokens tab should display token infos correctly", () => {
    render(<AccountCard account={account} />);
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
    render(<AccountCard account={account} />);
    expect(screen.getByTestId("account-card-nfts-tab")).toBeInTheDocument();
    screen.getByTestId("account-card-nfts-tab").click();
    expect(screen.queryAllByTestId("account-card-nfts-tab")).toHaveLength(1);
    expect(
      screen.getByText(mockNft.token?.metadata?.name as string)
    ).toBeInTheDocument();
  });
});
