import { mockImplicitAccount, mockSocialOrLedgerAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import store from "../../utils/redux/store";
import { TransactionOperation } from "../../utils/tezos";
import { Fee } from "./Fee";
import { OperationTileContext } from "./OperationTileContext";

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
    store.dispatch(accountsSlice.actions.addNonMnemonicAccount([mockSocialOrLedgerAccount(0)]));
    render(
      <Fee
        operation={
          {
            sender: { address: mockSocialOrLedgerAccount(0).address.pkh },
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          } as TransactionOperation
        }
      />
    );
    expect(screen.getByTestId("fee")).toHaveTextContent("0.000123");
  });

  it("doesn't render in drawer mode", () => {
    store.dispatch(accountsSlice.actions.addNonMnemonicAccount([mockSocialOrLedgerAccount(0)]));

    render(
      <OperationTileContext.Provider value={{ mode: "drawer" } as any}>
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
      </OperationTileContext.Provider>
    );
    expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
  });
});
