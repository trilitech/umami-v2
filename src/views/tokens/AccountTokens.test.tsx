import { mockFA12Token, mockFA2Token, mockImplicitAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { AccountTokens } from "./AccountTokens";

describe("<AccountTokens />", () => {
  it("renders the account label", () => {
    render(
      <AccountTokens account={{ ...mockImplicitAccount(0), label: "test label" }} tokens={[]} />
    );
    expect(screen.getByTestId("header")).toHaveTextContent("test label");
  });

  it("renders all tokens", () => {
    const account = mockImplicitAccount(0);
    const tokens = [mockFA2Token(0, account, 123456, 5), mockFA12Token(1, account, 123456)];
    render(<AccountTokens account={account} tokens={tokens} />);

    expect(screen.getAllByTestId("token-tile")).toHaveLength(2);

    expect(screen.getAllByTestId("token-tile")[0]).toHaveTextContent("Klondike2");
    expect(screen.getAllByTestId("token-tile")[0]).toHaveTextContent("1.23456");

    expect(screen.getAllByTestId("token-tile")[1]).toHaveTextContent("FA1.2");
    expect(screen.getAllByTestId("token-tile")[1]).toHaveTextContent("123,456");
  });
});
