import { TokensPage } from "./TokensPage";
import { hedgehoge, tzBtsc } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import { mockImplicitAddress, mockMnemonicAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks, MAINNET, Network } from "../../types/Network";
import { assetsSlice } from "../../utils/redux/slices/assetsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { tokensActions } from "../../utils/redux/slices/tokensSlice";
import { store } from "../../utils/redux/store";

const fixture = () => <TokensPage />;

beforeEach(() => addAccount(mockMnemonicAccount(0)));

describe("<TokensView />", () => {
  describe("without tokens", () => {
    it("displays empty state message", () => {
      render(fixture());

      expect(screen.getByTestId("empty-state-message")).toBeVisible();
      expect(screen.getByText("No tokens to show")).toBeInTheDocument();
      expect(screen.getByText("All of your tokens will appear here...")).toBeInTheDocument();
    });
  });

  describe("with tokens", () => {
    const setupTokens = (network: Network) => {
      store.dispatch(networksActions.setCurrent(network));
      addAccount(mockMnemonicAccount(1));
      const tokenBalances = [
        hedgehoge(mockImplicitAddress(0)),
        hedgehoge(mockImplicitAddress(1)),
        tzBtsc(mockImplicitAddress(1)),
        uUSD(mockImplicitAddress(0)),
      ];
      store.dispatch(assetsSlice.actions.updateTokenBalance(tokenBalances));
      store.dispatch(
        tokensActions.addTokens({ network, tokens: tokenBalances.map(tb => tb.token) })
      );
    };

    it("hides empty state message", () => {
      setupTokens(MAINNET);

      render(fixture());

      expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
    });

    it.each(DefaultNetworks)("shows all available tokens from all accounts on $name", network => {
      setupTokens(network);

      render(fixture());

      expect(screen.getAllByText("Hedgehoge")).toHaveLength(2);
      expect(screen.getAllByText("tzBTC")).toHaveLength(1);
      expect(screen.getAllByText("youves uUSD")).toHaveLength(1);
    });
  });
});
