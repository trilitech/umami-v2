import { InternalPrefix } from "./InternalPrefix";
import {
  delegationFixture,
  originationFixture,
  tokenTransferFixture,
  transactionFixture,
} from "./testUtils";
import { mockImplicitAccount, mockLedgerAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { render, screen } from "../../mocks/testUtils";

describe("<InternalPrefix />", () => {
  describe.each([
    {
      operation: transactionFixture({}),
      sender: mockImplicitAccount(1),
      target: mockImplicitAccount(0),
    },
    {
      operation: tokenTransferFixture({}),
      sender: mockImplicitAccount(0),
      target: mockImplicitAccount(1),
    },
    { operation: delegationFixture({}), sender: mockLedgerAccount(0) },
    { operation: originationFixture({}), sender: mockLedgerAccount(0) },
  ])("for $operation.type", ({ operation, sender, target }) => {
    it('renders "Internal" if neither sender nor receiver is owned', () => {
      render(<InternalPrefix operation={operation} />);

      expect(screen.getByText("Internal:")).toBeVisible();
    });

    it("renders nothing if the sender is owned", () => {
      addAccount(sender);

      render(<InternalPrefix operation={operation} />);

      expect(screen.queryByText("Internal:")).not.toBeInTheDocument();
    });

    it("renders nothing if the receiver is owned", () => {
      if (!target) {
        return;
      }
      addAccount(target);

      render(<InternalPrefix operation={operation} />);

      expect(screen.queryByText("Internal:")).not.toBeInTheDocument();
    });

    it("renders nothing if both sender and receiver are owned", () => {
      if (!target) {
        return;
      }
      addAccount(sender);
      addAccount(target);

      render(<InternalPrefix operation={operation} />);

      expect(screen.queryByText("Internal:")).not.toBeInTheDocument();
    });
  });
});
