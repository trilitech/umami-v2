import { OperationListDisplay } from "./OperationListDisplay";
import { mockImplicitAddress } from "../../../mocks/factories";
import { render, screen } from "../../../mocks/testUtils";
import { mockTzktTezTransfer } from "../../../mocks/transfers";
import { TzktCombinedOperation } from "../../../utils/tezos";

describe("<OperationListDisplay />", () => {
  const operations = [
    {
      ...mockTzktTezTransfer(mockImplicitAddress(0).pkh, mockImplicitAddress(1).pkh, 1000000),
      id: 1,
    } as TzktCombinedOperation,
    {
      ...mockTzktTezTransfer(mockImplicitAddress(1).pkh, mockImplicitAddress(0).pkh, 2000000),
      id: 2,
    } as TzktCombinedOperation,
  ];

  it('renders a "View All" link', () => {
    render(<OperationListDisplay operations={operations} owner={mockImplicitAddress(0).pkh} />);

    expect(screen.getByRole("link", { name: "View All" })).toHaveAttribute(
      "href",
      `#/operations?accounts=${mockImplicitAddress(0).pkh}`
    );
  });
});
