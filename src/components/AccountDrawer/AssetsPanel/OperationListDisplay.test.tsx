import { OperationListDisplay } from "./OperationListDisplay";
import { mockDelegation, mockImplicitAddress } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { mockTzktTezTransfer } from "../../../mocks/transfers";
import { TzktCombinedOperation } from "../../../utils/tezos";

describe("<OperationListDisplay />", () => {
  const OWNER = mockImplicitAddress(0).pkh;

  describe("without operations", () => {
    it('displays a "No operations found" message', () => {
      render(<OperationListDisplay operations={[]} owner={OWNER} />);

      expect(screen.getByText("No operations to show")).toBeInTheDocument();
    });

    it("does not show operation tiles", () => {
      render(<OperationListDisplay operations={[]} owner={OWNER} />);

      expect(screen.queryByTestId(/^operation-tile/)).not.toBeInTheDocument();
    });

    it("doesn't show a 'View All' link", () => {
      render(<OperationListDisplay operations={[]} owner={OWNER} />);

      expect(screen.queryByRole("link", { name: "View All" })).not.toBeInTheDocument();
    });
  });

  describe("with operations", () => {
    const transferOperations = [...Array(10)].flatMap(
      (_, i) =>
        [
          {
            ...mockTzktTezTransfer(OWNER, mockImplicitAddress(1).pkh, 1000000),
            id: i + 10,
          },
          {
            ...mockTzktTezTransfer(mockImplicitAddress(1).pkh, OWNER, 1000000),
            id: i + 20,
          },
        ] as TzktCombinedOperation[]
    );
    const delegationOperation = mockDelegation(
      0,
      6000000,
      mockImplicitAddress(2).pkh,
      "Some baker"
    ) as TzktCombinedOperation;

    it("renders all operations without view all link when <= 20 operations", () => {
      render(<OperationListDisplay operations={transferOperations} owner={OWNER} />);

      expect(screen.getAllByTestId(/^operation-tile/)).toHaveLength(20);
      expect(screen.queryByRole("link", { name: "View All" })).not.toBeInTheDocument();
    });

    it("renders top 20 tokens (in the same order as given) when > 20 tokens", () => {
      render(
        <OperationListDisplay
          operations={[...transferOperations, delegationOperation]}
          owner={OWNER}
        />
      );

      expect(screen.getAllByTestId(/^operation-tile/)).toHaveLength(20);
      expect(screen.queryByText("Delegate")).not.toBeInTheDocument();
    });

    it('renders a "View All" link when > 20 operations', () => {
      render(
        <OperationListDisplay
          operations={[...transferOperations, delegationOperation]}
          owner={OWNER}
        />
      );

      expect(screen.getByRole("link", { name: "View All" })).toHaveAttribute(
        "href",
        `#/operations?accounts=${mockImplicitAddress(0).pkh}`
      );
    });
  });
});
