import { mockImplicitAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import store from "../../utils/redux/store";
import { TransactionOperation } from "../../utils/tezos";
import { Fee } from "./Fee";

describe("<Fee />", () => {
  it("doesn't render if fee is 0", () => {
    render(
      <Fee
        operation={
          {
            sender: { address: mockImplicitAccount(0).address.pkh },
            bakerFee: 0,
            storageFee: 0,
            allocationFee: 0,
          } as TransactionOperation
        }
      />
    );
    expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
  });

  it("doesn't render if the operation is not outgoing", () => {
    render(
      <Fee
        operation={
          {
            sender: { address: mockImplicitAccount(0).address.pkh },
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          } as TransactionOperation
        }
      />
    );
    expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
  });

  it("sums up the fees and shows the total", () => {
    store.dispatch(accountsSlice.actions.addAccount([mockImplicitAccount(0)]));
    render(
      <Fee
        operation={
          {
            sender: { address: mockImplicitAccount(0).address.pkh },
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          } as TransactionOperation
        }
      />
    );
    expect(screen.getByTestId("fee")).toHaveTextContent("0.000123");
  });
});
