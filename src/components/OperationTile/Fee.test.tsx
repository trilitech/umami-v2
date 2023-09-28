import { render, screen } from "../../mocks/testUtils";
import { TransactionOperation } from "../../utils/tezos";
import { Fee } from "./Fee";

describe("<Fee />", () => {
  it("doesn't render if fee is 0", () => {
    render(
      <Fee operation={{ bakerFee: 0, storageFee: 0, allocationFee: 0 } as TransactionOperation} />
    );
    expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
  });

  it("sums up the fees and shows the total", () => {
    render(
      <Fee
        operation={{ bakerFee: 100, storageFee: 20, allocationFee: 3 } as TransactionOperation}
      />
    );
    expect(screen.getByTestId("fee")).toHaveTextContent("0.000123");
  });
});
