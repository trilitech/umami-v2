import { TokensPage } from "./TokensPage";
import { hedgehoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { mockImplicitAddress, mockMnemonicAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { assetsSlice } from "../../utils/redux/slices/assetsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { tokensActions } from "../../utils/redux/slices/tokensSlice";
import { store } from "../../utils/redux/store";

const fixture = () => <TokensPage />;

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
});

describe("<TokensView />", () => {
  it("renders 'no tokens found' when there are no tokens", () => {
    render(fixture());
    expect(screen.getByText("No tokens to show")).toBeInTheDocument();
  });

  it.each(DefaultNetworks)("shows all available tokens from all accounts on $name", network => {
    store.dispatch(networksActions.setCurrent(network));
    store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(1)]));
    const tokenBalances = [
      hedgehoge(mockImplicitAddress(0)),
      hedgehoge(mockImplicitAddress(1)),
      tzBtsc(mockImplicitAddress(1)),
      uUSD(mockImplicitAddress(0)),
    ];
    store.dispatch(assetsSlice.actions.updateTokenBalance(tokenBalances));
    store.dispatch(tokensActions.addTokens({ network, tokens: tokenBalances.map(tb => tb.token) }));
    render(fixture());

    expect(screen.getAllByText("Hedgehoge")).toHaveLength(2);
    expect(screen.getAllByText("tzBTC")).toHaveLength(1);
    expect(screen.getAllByText("youves uUSD")).toHaveLength(1);
  });
});
