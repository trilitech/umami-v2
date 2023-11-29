import { mockFA2Token, mockMnemonicAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { TokenNameWithIcon } from "./TokenNameWithIcon";

describe("<TokenNameWithIcon />", () => {
  it("renders the token name for unverified token", () => {
    const mockAccount = mockMnemonicAccount(0);
    const token = mockFA2Token(1, mockAccount);
    render(<TokenNameWithIcon token={token} />);

    expect(screen.getByText(token.metadata?.name as any)).toBeInTheDocument();
    expect(screen.queryByTestId("verified-icon")).not.toBeInTheDocument();
  });

  it("renders the token name and the icon for verified token", () => {
    const mockAccount = mockMnemonicAccount(0);
    const token = {
      ...mockFA2Token(1, mockAccount),
      contract: "KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o",
    };
    render(<TokenNameWithIcon token={token} />);

    expect(screen.getByText(token.metadata?.name as any)).toBeInTheDocument();
    expect(screen.getByTestId("verified-icon")).toBeInTheDocument();
  });
});
