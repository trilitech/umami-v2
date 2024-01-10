import { TokenList } from "./TokenList";
import { hedgehoge } from "../../../mocks/fa12Tokens";
import { mockFA12Token, mockFA2Token, mockMnemonicAccount } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { FA2TokenBalance, fromRaw } from "../../../types/TokenBalance";

describe("<TokenList />", () => {
  const ACCOUNT = mockMnemonicAccount(0);

  describe("with no tokens", () => {
    it('displays a "No tokens found" message', () => {
      render(<TokenList owner={ACCOUNT.address.pkh} tokens={[]} />);

      expect(screen.getByText("No tokens found")).toBeInTheDocument();
    });

    it("does not show tokens", () => {
      render(<TokenList owner={ACCOUNT.address.pkh} tokens={[]} />);

      expect(screen.queryByTestId("token-tile")).not.toBeInTheDocument();
    });

    it("doesn't show a 'View All' link", () => {
      render(<TokenList owner={ACCOUNT.address.pkh} tokens={[]} />);

      expect(screen.queryByRole("link", { name: "View All" })).not.toBeInTheDocument();
    });
  });

  describe("with tokens", () => {
    it("renders a list of tokens in the same order as given", () => {
      const tokens = [
        mockFA2Token(0, ACCOUNT, 123456, 5, "T1", "Token 1"),
        mockFA12Token(1, ACCOUNT, 123456),
        fromRaw(hedgehoge(ACCOUNT.address))! as FA2TokenBalance,
      ];

      render(<TokenList owner={ACCOUNT.address.pkh} tokens={tokens} />);

      const tokenTiles = screen.getAllByTestId("token-tile");
      expect(tokenTiles).toHaveLength(3);

      expect(tokenTiles[0]).toHaveTextContent("Token 1");
      expect(tokenTiles[0]).toHaveTextContent("1.23456");

      expect(tokenTiles[1]).toHaveTextContent("FA1.2");
      expect(tokenTiles[1]).toHaveTextContent("123,456");

      expect(tokenTiles[2]).toHaveTextContent("Hedgehoge");
      expect(tokenTiles[2]).toHaveTextContent("10,000.000000");
    });

    it("renders 'verified' icons for verified tokens", () => {
      const token = {
        ...mockFA2Token(1, ACCOUNT),
        contract: "KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o",
      };

      render(<TokenList owner={ACCOUNT.address.pkh} tokens={[token]} />);

      expect(screen.getByTestId("verified-icon")).toBeInTheDocument();
    });

    it('renders a "View All" link', () => {
      const tokens = [mockFA2Token(0, ACCOUNT), mockFA12Token(1, ACCOUNT)];

      render(<TokenList owner={ACCOUNT.address.pkh} tokens={tokens} />);

      expect(screen.getByRole("link", { name: "View All" })).toHaveAttribute(
        "href",
        `#/tokens?accounts=${ACCOUNT.address.pkh}`
      );
    });
  });
});
