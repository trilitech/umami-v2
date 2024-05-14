import { TokenTile } from "./TokenTile";
import { mockFA2Token, mockImplicitAccount } from "../mocks/factories";
import { render, screen } from "../mocks/testUtils";
import { FA12TokenBalance, FA2TokenBalance } from "../types/TokenBalance";

const mockAccount = mockImplicitAccount(0);
const mockFAToken = mockFA2Token(0, mockAccount);
const fixture = (amount: string, token: FA12TokenBalance | FA2TokenBalance) => (
  <TokenTile amount={amount} token={token} />
);

describe("<TokenTile />", () => {
  describe("amount", () => {
    it("displays pretty token amount with 0 decimals", () => {
      const token = {
        ...mockFAToken,
        metadata: { ...mockFAToken.metadata, decimals: undefined },
      };
      render(fixture("123456789", token));
      expect(screen.getByText("123,456,789")).toBeInTheDocument();
      expect(screen.getByText("KL2")).toBeInTheDocument();
    });

    it("displays pretty default token amount with no symbol", () => {
      const token = {
        ...mockFAToken,
        metadata: { ...mockFAToken.metadata, symbol: undefined },
      };
      render(fixture("123456789", token));
      expect(screen.getByText("12,345")).toBeInTheDocument();
      expect(screen.getByText(".6789")).toBeInTheDocument();
      expect(screen.getByText("FA2")).toBeInTheDocument();
    });

    it("displays pretty token amount with symbol and decimals", () => {
      render(fixture("123456789", mockFAToken));
      expect(screen.getByText("12,345")).toBeInTheDocument();
      expect(screen.getByText(".6789")).toBeInTheDocument();
      expect(screen.getByText("KL2")).toBeInTheDocument();
    });
  });
});
