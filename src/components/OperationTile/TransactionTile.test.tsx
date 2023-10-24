import { mockImplicitAccount, mockLedgerAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import store from "../../utils/redux/store";
import { TEZ, TransactionOperation } from "../../utils/tezos";
import { OperationTileContext } from "./OperationTileContext";
import { TransactionTile } from "./TransactionTile";

const fixture = (context: any, operation: TransactionOperation) => (
  <OperationTileContext.Provider value={context}>
    <TransactionTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<TransactionTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(0).address } as const,
  ])("in $mode mode", contextValue => {
    describe("sign", () => {
      it("shows '+' for incoming transactions", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockImplicitAccount(0).address.pkh },
            sender: { address: mockImplicitAccount(1).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.getByTestId("incoming-arrow")).toBeInTheDocument();
        expect(screen.queryByTestId("outgoing-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent(`+ 0.000001 ${TEZ}`);
      });

      it("shows '-' for outgoing transactions", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(1)));

        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockImplicitAccount(0).address.pkh },
            sender: { address: mockLedgerAccount(1).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent(`- 0.000001 ${TEZ}`);
      });

      it("shows '-' if sender and target are both owned", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(1)));

        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockLedgerAccount(0).address.pkh },
            sender: { address: mockLedgerAccount(1).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent(`- 0.000001 ${TEZ}`);
      });
    });

    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(
            fixture(contextValue, {
              amount: 1,
              target: { address: mockImplicitAccount(0).address.pkh },
              sender: { address: mockImplicitAccount(1).address.pkh },
              hash: "test-hash",
              counter: 1234,
              id: 56789,
              level: 4321,
              network,
              type: "transaction",
            } as TransactionOperation)
          );

          expect(screen.getByTestId("title")).toHaveAttribute(
            "href",
            `${network.tzktExplorerUrl}/test-hash/1234`
          );
        });
      });
    });

    it("displays timestamp", () => {
      render(
        fixture(contextValue, {
          amount: 1,
          target: { address: mockImplicitAccount(0).address.pkh },
          sender: { address: mockImplicitAccount(1).address.pkh },
          timestamp: "2021-01-02T00:00:00.000Z",
        } as TransactionOperation)
      );

      expect(screen.getByTestId("timestamp")).toHaveTextContent("01/02/2021");
    });
  });

  describe("page mode", () => {
    const contextValue = { mode: "page" } as const;

    describe("fee", () => {
      it("renders nothing if the fee isn't paid by the user", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockImplicitAccount(0).address.pkh },
            sender: { address: mockImplicitAccount(1).address.pkh },
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          } as TransactionOperation)
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });

      it("renders if there is any fee paid by the user", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockLedgerAccount(1).address.pkh },
            sender: { address: mockLedgerAccount(0).address.pkh },
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          } as TransactionOperation)
        );

        expect(screen.getByTestId("fee")).toHaveTextContent(`0.000123 ${TEZ}`);
      });

      it("renders nothing if the fee is absent", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockImplicitAccount(0).address.pkh },
            sender: { address: mockImplicitAccount(1).address.pkh },
            bakerFee: 0,
            storageFee: 0,
            allocationFee: 0,
          } as TransactionOperation)
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });
    });

    it("shows operation type", () => {
      render(
        fixture(contextValue, {
          amount: 1,
          target: { address: mockImplicitAccount(0).address.pkh },
          sender: { address: mockImplicitAccount(1).address.pkh },
        } as TransactionOperation)
      );

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Transaction");
    });

    describe("pills", () => {
      beforeEach(() => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
      });

      it("shows both if sender is an owned account", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockLedgerAccount(1).address.pkh },
            sender: { address: mockLedgerAccount(0).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.getByTestId("from")).toBeInTheDocument();
        expect(screen.getByTestId("to")).toBeInTheDocument();
      });

      it("shows both if target is an owned account", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockLedgerAccount(0).address.pkh },
            sender: { address: mockLedgerAccount(1).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.getByTestId("from")).toBeInTheDocument();
        expect(screen.getByTestId("to")).toBeInTheDocument();
      });

      it("shows both if sender and target are owned accounts", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockLedgerAccount(0).address.pkh },
            sender: { address: mockLedgerAccount(0).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.getByTestId("from")).toBeInTheDocument();
        expect(screen.getByTestId("to")).toBeInTheDocument();
      });
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };

    it("hides the fee", () => {
      store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
      render(
        fixture(contextValue, {
          amount: 1,
          target: { address: mockLedgerAccount(1).address.pkh },
          sender: { address: mockLedgerAccount(0).address.pkh },
          bakerFee: 100,
          storageFee: 20,
          allocationFee: 3,
        } as TransactionOperation)
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(
        fixture(contextValue, {
          amount: 1,
          target: { address: mockImplicitAccount(0).address.pkh },
          sender: { address: mockImplicitAccount(1).address.pkh },
        } as TransactionOperation)
      );

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });

    describe("pills", () => {
      beforeEach(() => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
      });

      it("hides From if it's an owned account", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockLedgerAccount(1).address.pkh },
            sender: { address: mockLedgerAccount(0).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.queryByTestId("from")).not.toBeInTheDocument();
        expect(screen.getByTestId("to")).toBeInTheDocument();
      });

      it("hides To if it's an owned account", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockLedgerAccount(0).address.pkh },
            sender: { address: mockLedgerAccount(1).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.getByTestId("from")).toBeInTheDocument();
        expect(screen.queryByTestId("to")).not.toBeInTheDocument();
      });

      it("shows only From if sender and target are owned accounts", () => {
        render(
          fixture(contextValue, {
            amount: 1,
            target: { address: mockLedgerAccount(0).address.pkh },
            sender: { address: mockLedgerAccount(0).address.pkh },
          } as TransactionOperation)
        );

        expect(screen.getByTestId("from")).toBeInTheDocument();
        expect(screen.queryByTestId("to")).not.toBeInTheDocument();
      });
    });
  });
});
