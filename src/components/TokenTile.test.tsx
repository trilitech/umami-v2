import { render, screen } from "@testing-library/react";
import TokenTile from "./TokenTile";
import { mockFA2Token, mockImplicitAccount } from "../mocks/factories";

const mockAccount = mockImplicitAccount(0);
const mockFAToken = mockFA2Token(0, mockAccount);
const fixture = (amount: string) => <TokenTile amount={amount} token={mockFAToken} />;

describe("<TokenTile />", () => {
  it("displays pretty token amount with symbol", () => {
    render(fixture("123456789"));
    expect(screen.getByText(`12,345`)).toBeInTheDocument();
    expect(screen.getByText(`.6789`)).toBeInTheDocument();
    expect(screen.getByText(`KL2`)).toBeInTheDocument();
  });
});
