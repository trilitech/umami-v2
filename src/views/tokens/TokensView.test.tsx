import { render, screen } from "@testing-library/react";
import { hedgehoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { mockImplicitAddress, mockSocialOrLedgerAccount } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import store from "../../utils/redux/store";
import { tokensActions } from "../../utils/redux/slices/tokensSlice";
import TokensView from "./TokensView";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import assetsSlice from "../../utils/redux/slices/assetsSlice";
import { DefaultNetworks } from "../../types/Network";
import { networksActions } from "../../utils/redux/slices/networks";

const fixture = () => (
  <ReduxStore>
    <TokensView />
  </ReduxStore>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addNonMnemonicAccount([mockSocialOrLedgerAccount(0)]));
});

describe("<TokensView />", () => {
  it("a message 'no tokens found' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/no tokens found/i)).toBeInTheDocument();
  });

  test.each(DefaultNetworks)("shows all available tokens from all accounts on $name", network => {
    store.dispatch(networksActions.setCurrent(network));
    store.dispatch(accountsSlice.actions.addNonMnemonicAccount([mockSocialOrLedgerAccount(1)]));
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
