import { OperationView } from "./OperationView";
import { hedgehoge } from "../../mocks/fa12Tokens";
import { uUSD } from "../../mocks/fa2Tokens";
import {
  mockDelegationOperation,
  mockFA12Operation,
  mockFA2Operation,
  mockImplicitAddress,
  mockTezOperation,
  mockUndelegationOperation,
} from "../../mocks/factories";
import { ghostnetThezard } from "../../mocks/nftTokens";
import { render, screen } from "../../mocks/testUtils";
import { parseContractPkh } from "../../types/Address";
import { MAINNET } from "../../types/Network";
import { FA12Transfer, FA2Transfer } from "../../types/Operation";
import { tokensActions } from "../../utils/redux/slices/tokensSlice";
import { store } from "../../utils/redux/store";
import { TEZ } from "../../utils/tezos";

describe("Batch <OperationView />", () => {
  it("displays tez transfer operation", () => {
    render(<OperationView operation={mockTezOperation(1)} />);

    expect(screen.getByRole("heading", { name: `0.000001 ${TEZ}` })).toBeInTheDocument();
    expect(screen.getByTestId("outgoing-arrow-icon")).toBeInTheDocument();
  });

  it("displays delegation operation", () => {
    render(<OperationView operation={mockDelegationOperation(0)} />);

    expect(screen.getByRole("heading", { name: "Delegate" })).toBeInTheDocument();
    expect(screen.getByTestId("baker-icon")).toBeInTheDocument();
  });

  it("displays undelegation operation", () => {
    render(<OperationView operation={mockUndelegationOperation(0)} />);

    expect(screen.getByRole("heading", { name: "End Delegation" })).toBeInTheDocument();
    expect(screen.getByTestId("baker-icon")).toBeInTheDocument();
  });

  describe("for tokens", () => {
    it("displays unknown token operation", () => {
      render(<OperationView operation={{ ...mockFA12Operation(2), amount: "1234" }} />);

      expect(screen.getByRole("heading", { name: "1234 Unknown Token" })).toBeInTheDocument();
      expect(screen.getByTestId("outgoing-arrow-icon")).toBeInTheDocument();
      expect(screen.getByTestId("link")).not.toHaveAttribute("href");
    });

    it("displays fa1.2 operation", () => {
      const token = hedgehoge(mockImplicitAddress(0));
      store.dispatch(tokensActions.addTokens({ network: MAINNET, tokens: [token.token] }));
      const operation: FA12Transfer = {
        ...mockFA12Operation(2),
        contract: parseContractPkh(token.token.contract.address),
        amount: "1234",
      };

      render(<OperationView operation={operation} />);

      expect(screen.getByRole("heading", { name: "0.001234 Hedgehoge" })).toBeInTheDocument();
      expect(screen.getByTestId("outgoing-arrow-icon")).toBeInTheDocument();
      expect(screen.getByTestId("link")).toHaveAttribute(
        "href",
        "https://tzkt.io/KT1G1cCRNBgQ48mVDjopHjEmTN5Sbtar8nn9/tokens/0"
      );
    });

    it("displays fa2 operation", () => {
      const token = uUSD(mockImplicitAddress(0));
      token.token.standard = "fa2";
      token.token.tokenId = "5";
      store.dispatch(tokensActions.addTokens({ network: MAINNET, tokens: [token.token] }));
      const operation: FA2Transfer = {
        ...mockFA2Operation(2),
        contract: parseContractPkh(token.token.contract.address),
        tokenId: token.token.tokenId,
        amount: "1234",
      };

      render(<OperationView operation={operation} />);

      expect(
        screen.getByRole("heading", { name: "0.000000001234 youves uUSD" })
      ).toBeInTheDocument();
      expect(screen.getByTestId("outgoing-arrow-icon")).toBeInTheDocument();
      expect(screen.getByTestId("link")).toHaveAttribute(
        "href",
        "https://tzkt.io/KT1QTcAXeefhJ3iXLurRt81WRKdv7YqyYFmo/tokens/5"
      );
    });

    it("displays nft operation", () => {
      const token = ghostnetThezard;
      token.token.standard = "fa2";
      token.token.tokenId = "15";
      store.dispatch(tokensActions.addTokens({ network: MAINNET, tokens: [token.token] }));
      const operation: FA2Transfer = {
        ...mockFA2Operation(2),
        contract: parseContractPkh(token.token.contract.address),
        tokenId: token.token.tokenId,
        amount: "12345",
      };

      render(<OperationView operation={operation} />);

      expect(screen.getByRole("heading", { name: "x12345" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Tezzardz #24" })).toBeInTheDocument();
      expect(screen.getByTestId("outgoing-arrow-icon")).toBeInTheDocument();

      expect(screen.getByTestId("link")).toHaveAttribute(
        "href",
        "https://tzkt.io/KT1GVhG7dQNjPAt4FNBNmc9P9zpiQex4Mxob/tokens/15"
      );
    });
  });
});
