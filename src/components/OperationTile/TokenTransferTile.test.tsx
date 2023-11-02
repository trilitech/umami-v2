import { mockLedgerAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import { Token, fromRaw } from "../../types/Token";
import { TokenTransfer } from "../../types/Transfer";
import { formatPkh } from "../../utils/formatPkh";
import accountsSlice from "../../utils/redux/slices/accountsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import store from "../../utils/redux/store";
import { TEZ, TransactionOperation } from "../../utils/tezos";
import { OperationTileContext } from "./OperationTileContext";
import { TokenTransferTile } from "./TokenTransferTile";
import { tokenTransferFixture, transactionFixture } from "./testUtils";

const fixture = (context: any, operation: TransactionOperation, tokenTransfer: TokenTransfer) => (
  <OperationTileContext.Provider value={context}>
    <TokenTransferTile
      operation={operation}
      tokenTransfer={tokenTransfer}
      token={fromRaw(tokenTransfer.token) as Token}
    />
  </OperationTileContext.Provider>
);

describe("<TokenTransferTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(0).address } as const,
  ])("in $mode mode", contextValue => {
    describe("sign", () => {
      it("shows '+' for incoming transactions", () => {
        render(fixture(contextValue, transactionFixture({}), tokenTransferFixture({})));

        expect(screen.getByTestId("incoming-arrow")).toBeInTheDocument();
        expect(screen.queryByTestId("outgoing-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent(`+0.000000000500 uUSD`);
      });

      it("shows '-' for outgoing transactions", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(1)));

        render(
          fixture(
            contextValue,
            transactionFixture({ sender: { address: mockLedgerAccount(1).address.pkh } }),
            tokenTransferFixture({})
          )
        );

        expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent(`-0.000000000500 uUSD`);
      });

      it("shows '-' if sender and target are both owned", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(1)));

        render(
          fixture(
            contextValue,
            transactionFixture({
              target: { address: mockLedgerAccount(0).address.pkh },
              sender: { address: mockLedgerAccount(1).address.pkh },
            }),
            tokenTransferFixture({})
          )
        );

        expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent(`-0.000000000500 uUSD`);
      });
    });

    describe("amount", () => {
      test("without decimals", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(1)));
        const tokenTransfer = tokenTransferFixture({});
        delete tokenTransfer.token.metadata.decimals;

        render(
          fixture(
            contextValue,
            transactionFixture({ sender: { address: mockLedgerAccount(1).address.pkh } }),
            tokenTransfer
          )
        );

        expect(screen.getByTestId("title")).toHaveTextContent(`-500 uUSD`);
      });

      test("with decimals", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(1)));
        const tokenTransfer = tokenTransferFixture({});
        tokenTransfer.token.metadata.decimals = 2;

        render(
          fixture(
            contextValue,
            transactionFixture({ sender: { address: mockLedgerAccount(1).address.pkh } }),
            tokenTransfer
          )
        );

        expect(screen.getByTestId("title")).toHaveTextContent(`-5.00 uUSD`);
      });
    });

    describe("token name", () => {
      describe("NFT", () => {
        it("shows the token name", () => {
          const tokenTransfer = tokenTransferFixture({});
          tokenTransfer.token.metadata = {
            ...tokenTransfer.token.metadata,
            name: "some-name",
            decimals: undefined,
            displayUri: "some-uri",
          };
          render(fixture(contextValue, transactionFixture({}), tokenTransfer));

          expect(screen.getByTestId("title")).toHaveTextContent("some-name");
        });

        it("shows the default token name if the token name is empty", () => {
          const tokenTransfer = tokenTransferFixture({});
          tokenTransfer.token.metadata = {
            ...tokenTransfer.token.metadata,
            name: undefined,
            decimals: undefined,
            displayUri: "some-uri",
          };

          render(fixture(contextValue, transactionFixture({}), tokenTransfer));

          expect(screen.getByTestId("title")).toHaveTextContent("NFT");
        });
      });

      describe.each([
        { standard: "fa1.2", defaultSymbol: "FA1.2" },
        { standard: "fa2", defaultSymbol: "FA2" },
      ])("$standard", ({ standard, defaultSymbol }) => {
        const tokenTransfer = tokenTransferFixture({});
        tokenTransfer.token.standard = standard;
        tokenTransfer.token.metadata.name = "some-name";

        it("shows the token symbol", () => {
          render(fixture(contextValue, transactionFixture({}), tokenTransfer));

          expect(screen.getByTestId("title")).toHaveTextContent("uUSD");
        });

        it("shows the default token symbol if the token symbol is empty and name is present", () => {
          tokenTransfer.token.metadata.symbol = undefined;
          tokenTransfer.token.metadata.name = undefined;
          render(fixture(contextValue, transactionFixture({}), tokenTransfer));

          expect(screen.getByTestId("title")).toHaveTextContent(defaultSymbol);
        });
      });
    });

    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, transactionFixture({}), tokenTransferFixture({})));

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
          }),
          tokenTransferFixture({})
        )
      );

      expect(screen.getByTestId("timestamp")).toHaveTextContent("2 Jan 2021");
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
            }),
            tokenTransferFixture({})
          )
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });

      it("renders if there is any fee paid by the user", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
        render(
          fixture(
            contextValue,
            transactionFixture({
              sender: { address: mockLedgerAccount(0).address.pkh },
              bakerFee: 100,
              storageFee: 20,
              allocationFee: 3,
            }),
            tokenTransferFixture({})
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
            }),
            tokenTransferFixture({})
          )
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });
    });

    it("shows operation type", () => {
      render(fixture(contextValue, transactionFixture({}), tokenTransferFixture({})));

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Token Transfer");
    });

    describe("pills", () => {
      beforeEach(() => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
      });

      it("shows both if sender is an owned account", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              amount: 1,
              target: { address: mockLedgerAccount(1).address.pkh },
              sender: { address: mockLedgerAccount(0).address.pkh },
            }),
            tokenTransferFixture({
              from: { address: mockLedgerAccount(0).address.pkh },
              to: { address: mockLedgerAccount(1).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("from")).toHaveTextContent("Account 0 ledger");
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
            }),
            tokenTransferFixture({
              to: { address: mockLedgerAccount(0).address.pkh },
              from: { address: mockLedgerAccount(1).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("from")).toHaveTextContent(
          formatPkh(mockLedgerAccount(1).address.pkh)
        );
        expect(screen.getByTestId("to")).toHaveTextContent("Account 0 ledger");
      });

      it("shows both if sender and target are owned accounts", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              amount: 1,
              target: { address: mockLedgerAccount(0).address.pkh },
              sender: { address: mockLedgerAccount(0).address.pkh },
            }),
            tokenTransferFixture({
              to: { address: mockLedgerAccount(0).address.pkh },
              from: { address: mockLedgerAccount(0).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("from")).toHaveTextContent("Account 0 ledger");
        expect(screen.getByTestId("to")).toHaveTextContent("Account 0 ledger");
      });
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };

    beforeEach(() => {
      store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
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
          }),
          tokenTransferFixture({ from: { address: mockLedgerAccount(0).address.pkh } })
        )
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, transactionFixture({}), tokenTransferFixture({})));

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });

    describe("pills", () => {
      it("hides From if it's an owned account", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              amount: 1,
              target: { address: mockLedgerAccount(1).address.pkh },
              sender: { address: mockLedgerAccount(0).address.pkh },
            }),
            tokenTransferFixture({
              from: { address: mockLedgerAccount(0).address.pkh },
              to: { address: mockLedgerAccount(1).address.pkh },
            })
          )
        );

        expect(screen.queryByTestId("from")).not.toBeInTheDocument();
        expect(screen.getByTestId("to")).toHaveTextContent(
          formatPkh(mockLedgerAccount(1).address.pkh)
        );
      });

      it("hides To if it's an owned account", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              amount: 1,
              target: { address: mockLedgerAccount(0).address.pkh },
              sender: { address: mockLedgerAccount(1).address.pkh },
            }),
            tokenTransferFixture({
              from: { address: mockLedgerAccount(1).address.pkh },
              to: { address: mockLedgerAccount(0).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("from")).toHaveTextContent(
          formatPkh(mockLedgerAccount(1).address.pkh)
        );
        expect(screen.queryByTestId("to")).not.toBeInTheDocument();
      });

      it("shows only To if sender and target are owned accounts", () => {
        render(
          fixture(
            contextValue,
            transactionFixture({
              amount: 1,
              target: { address: mockLedgerAccount(0).address.pkh },
              sender: { address: mockLedgerAccount(0).address.pkh },
            }),
            tokenTransferFixture({
              from: { address: mockLedgerAccount(0).address.pkh },
              to: { address: mockLedgerAccount(0).address.pkh },
            })
          )
        );

        expect(screen.queryByTestId("from")).not.toBeInTheDocument();
        expect(screen.getByTestId("to")).toHaveTextContent(mockLedgerAccount(0).label);
      });
    });
  });
});
