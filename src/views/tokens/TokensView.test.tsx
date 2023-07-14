import { render, screen } from "@testing-library/react";
import { hedgehoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { mockImplicitAccount, mockImplicitAddress } from "../../mocks/factories";
import { ReduxStore } from "../../providers/ReduxStore";
import accountsSlice from "../../utils/store/accountsSlice";
import assetsSlice from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import TokensView from "./TokensView";

const fixture = () => (
  <ReduxStore>
    <TokensView />
  </ReduxStore>
);

beforeEach(() => {
  store.dispatch(accountsSlice.actions.add([mockImplicitAccount(0)]));
});

afterEach(() => {
  store.dispatch(accountsSlice.actions.reset());
  store.dispatch(assetsSlice.actions.reset());
});

describe("<TokensView />", () => {
  it("a message 'no tokens found' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/no tokens found/i)).toBeInTheDocument();
  });

  it("shows all available tokens from all accounts", () => {
    store.dispatch(accountsSlice.actions.add([mockImplicitAccount(1)]));
    const tokenBalances = [
      hedgehoge(mockImplicitAddress(0)),
      hedgehoge(mockImplicitAddress(1)),
      tzBtsc(mockImplicitAddress(1)),
      uUSD(mockImplicitAddress(0)),
    ];
    store.dispatch(assetsSlice.actions.updateTokenBalance(tokenBalances));
    render(fixture());

    expect(screen.getAllByText("Hedgehoge")).toHaveLength(2);
    expect(screen.getAllByText("tzBTC")).toHaveLength(1);
    expect(screen.getAllByText("youves uUSD")).toHaveLength(1);
  });
});
