import { OperationTileContext } from "./OperationTileContext";
import { transactionFixture } from "./testUtils";
import { TransactionTile } from "./TransactionTile";
import { mockImplicitAddress, mockLedgerAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import { formatPkh } from "../../utils/format";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";
import { TEZ, TransactionOperation } from "../../utils/tezos";

const fixture = (context: any, operation: TransactionOperation) => (
  <OperationTileContext.Provider value={context}>
    <TransactionTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<TransactionTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(1).address } as const,
  ])("in $mode mode", contextValue => {
    describe("sign", () => {
      it("shows '+' for incoming transactions", () => {
        addAccount(mockLedgerAccount(1));
        render(
          fixture(
            contextValue,
            transactionFixture({
              sender: { address: mockImplicitAddress(0).pkh },
              target: { address: mockLedgerAccount(1).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("incoming-arrow")).toBeInTheDocument();
        expect(screen.queryByTestId("outgoing-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent(`+ 0.000001 ${TEZ}`);
      });

      it("shows '-' for outgoing transactions", () => {
        addAccount(mockLedgerAccount(1));

        render(
          fixture(
            contextValue,
            transactionFixture({
              sender: { address: mockLedgerAccount(1).address.pkh },
              target: { address: mockImplicitAddress(2).pkh },
            })
          )
        );

        expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent(`- 0.000001 ${TEZ}`);
      });

      it("shows '-' if sender and target are both owned", () => {
        addAccount(mockLedgerAccount(0));
        addAccount(mockLedgerAccount(1));

        render(
          fixture(
            contextValue,
            transactionFixture({
              target: { address: mockLedgerAccount(0).address.pkh },
              sender: { address: mockLedgerAccount(1).address.pkh },
            })
          )
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

          render(fixture(contextValue, transactionFixture({})));

          expect(screen.getByTestId("title")).toHaveAttribute(
            "href",
            `${network.tzktExplorerUrl}/test-hash/1234`
          );
        });
      });
    });

    it("displays timestamp", () => {
      render(
        fixture(
          contextValue,
          transactionFixture({
            timestamp: "2021-01-02T00:00:00.000Z",
          })
        )
      );

      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });

    describe("pills", () => {
      beforeEach(() => {
        addAccount(mockLedgerAccount(0));
      });

      it("shows both if sender is an owned account", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              amount: 1,
              target: { address: mockLedgerAccount(1).address.pkh },
              sender: { address: mockLedgerAccount(0).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("from")).toHaveTextContent("Account");
        expect(screen.getByTestId("to")).toHaveTextContent(
          formatPkh(mockLedgerAccount(1).address.pkh)
        );
      });

      it("shows both if target is an owned account", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              amount: 1,
              target: { address: mockLedgerAccount(0).address.pkh },
              sender: { address: mockLedgerAccount(1).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("from")).toHaveTextContent(
          formatPkh(mockLedgerAccount(1).address.pkh)
        );
        expect(screen.getByTestId("to")).toHaveTextContent("Account");
      });

      it("shows both if sender and target are owned accounts", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              amount: 1,
              target: { address: mockLedgerAccount(0).address.pkh },
              sender: { address: mockLedgerAccount(0).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("from")).toHaveTextContent("Account");
        expect(screen.getByTestId("to")).toHaveTextContent("Account");
      });
    });
  });

  describe("page mode", () => {
    const contextValue = { mode: "page" } as const;

    describe("fee", () => {
      it("renders nothing if the fee isn't paid by the user", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              bakerFee: 100,
              storageFee: 20,
              allocationFee: 3,
            })
          )
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });

      it("renders if there is any fee paid by the user", () => {
        addAccount(mockLedgerAccount(0));
        render(
          fixture(
            contextValue,
            transactionFixture({
              sender: { address: mockLedgerAccount(0).address.pkh },
              bakerFee: 100,
              storageFee: 20,
              allocationFee: 3,
            })
          )
        );

        expect(screen.getByTestId("fee")).toHaveTextContent(`0.000123 ${TEZ}`);
      });

      it("renders nothing if the fee is absent", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              sender: { address: mockLedgerAccount(0).address.pkh },
              bakerFee: 0,
              storageFee: 0,
              allocationFee: 0,
            })
          )
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });
    });

    it("shows operation type", () => {
      render(fixture(contextValue, transactionFixture({})));

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Transaction");
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };

    beforeEach(() => {
      addAccount(mockLedgerAccount(0));
    });

    it("hides the fee", () => {
      render(
        fixture(
          contextValue,
          transactionFixture({
            sender: { address: mockLedgerAccount(0).address.pkh },
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          })
        )
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, transactionFixture({})));

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
