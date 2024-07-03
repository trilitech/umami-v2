import { mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore } from "@umami/state";
import { type TransactionOperation } from "@umami/tzkt";

import { Fee } from "./Fee";
import { OperationTileContext } from "./OperationTileContext";
import { render, screen } from "../../mocks/testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

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
      />,
      { store }
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
      />,
      { store }
    );
    expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
  });

  it("sums up the fees and shows the total", () => {
    addTestAccount(store, mockMnemonicAccount(0));
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
      />,
      { store }
    );
    expect(screen.getByTestId("fee")).toHaveTextContent("0.000123");
  });

  it("doesn't render in drawer mode", () => {
    addTestAccount(store, mockMnemonicAccount(0));

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
      </OperationTileContext.Provider>,
      { store }
    );
    expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
  });
});
