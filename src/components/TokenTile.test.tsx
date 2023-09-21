import { render, screen } from "@testing-library/react";
import TokenTile from "./TokenTile";
import { mockFA2Token, mockImplicitAccount } from "../mocks/factories";
import { FATokenBalance } from "./SendFlow/Token/FormPage";

const mockAccount = mockImplicitAccount(0);
const mockFAToken = mockFA2Token(0, mockAccount);
const fixture = (amount: string, token: FATokenBalance) => (
  <TokenTile amount={amount} token={token} />
);

describe("<TokenTile />", () => {
  describe("amount", () => {
    it("displays pretty token amount with 0 decimals", () => {
      const token: FATokenBalance = {
        ...mockFAToken,
        metadata: { ...mockFAToken.metadata, decimals: undefined },
      };
      render(fixture("123456789", token));
      expect(screen.getByText(`123,456,789`)).toBeInTheDocument();
      expect(screen.getByText(`KL2`)).toBeInTheDocument();
    });

    it("displays pretty default token amount with no symbol", () => {
      const token: FATokenBalance = {
        ...mockFAToken,
        metadata: { ...mockFAToken.metadata, symbol: undefined },
      };
      render(fixture("123456789", token));
      expect(screen.getByText(`12,345`)).toBeInTheDocument();
      expect(screen.getByText(`.6789`)).toBeInTheDocument();
      expect(screen.getByText(`FA2`)).toBeInTheDocument();
    });

    it("displays pretty token amount with symbol and decimals", () => {
      render(fixture("123456789", mockFAToken));
      expect(screen.getByText(`12,345`)).toBeInTheDocument();
      expect(screen.getByText(`.6789`)).toBeInTheDocument();
      expect(screen.getByText(`KL2`)).toBeInTheDocument();
    });
  });
});
