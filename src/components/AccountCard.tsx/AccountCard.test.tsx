import {
  mockAccount,
  mockFA1Token,
  mockFA2Token,
  mockNFTToken,
} from "../../mocks/factories";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";

import BigNumber from "bignumber.js";
import AccountCard from ".";
import { render, screen } from "../../mocks/testUtils";
const { updateAssets } = assetsSlice.actions;
const { add, setSelected } = accountsSlice.actions;

const tezBalance = new BigNumber(33200000000);

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
          mockFA2Token(0, pkh, 30000, 3, "KL2", "Klondike 2"),
          mockFA2Token(1, pkh, 200000, 2, "FT", "Foo token"),
          mockFA1Token(0, pkh),
          mockNft,
        ],
      },
    ])
  );
});

describe("<AccountCard />", () => {
  it("should display account name", () => {
    render(<AccountCard />);
    expect(
      screen.getByRole("heading", { name: account.label })
    ).toBeInTheDocument();
  });

  it("should display account tez balance", () => {
    render(<AccountCard />);
    expect(screen.getByText("33200 ꜩ")).toBeInTheDocument();
  });

  it("should display assets tabs with tokens by default", () => {
    render(<AccountCard />);
    const tokenTiles = screen.getAllByTestId("token-tile");
    expect(tokenTiles[0]).toHaveTextContent("FA1");
    expect(tokenTiles[1]).toHaveTextContent("KL2");
    expect(tokenTiles[2]).toHaveTextContent("FT");
  });

  it("should display nfts under nfts tab", () => {
    render(<AccountCard />);
    expect(screen.getByTestId("account-card-nfts-tab")).toBeInTheDocument();
    screen.getByTestId("account-card-nfts-tab").click();
    expect(screen.queryAllByTestId("account-card-nfts-tab")).toHaveLength(1);
    expect(
      screen.getByText(mockNft.token?.metadata?.name as string)
    ).toBeInTheDocument();
  });
});
