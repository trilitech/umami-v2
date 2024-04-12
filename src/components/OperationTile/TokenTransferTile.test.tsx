import { OperationTileContext } from "./OperationTileContext";
import { tokenTransferFixture, transactionFixture } from "./testUtils";
import { TokenTransferTile } from "./TokenTransferTile";
import * as operationDestinationModule from "./useGetOperationDestination";
import { mockImplicitAddress, mockLedgerAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { ghostnetThezard } from "../../mocks/nftTokens";
import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import { Token, fromRaw } from "../../types/Token";
import { formatPkh } from "../../utils/format";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";
import { TEZ, TokenTransferOperation, TransactionOperation } from "../../utils/tezos";

const fixture = (
  context: any,
  tokenTransfer: TokenTransferOperation,
  operation?: TransactionOperation
) => (
  <OperationTileContext.Provider value={context}>
    <TokenTransferTile
      operation={operation}
      token={fromRaw(tokenTransfer.token) as Token}
      tokenTransfer={tokenTransfer}
    />
  </OperationTileContext.Provider>
);

describe("<TokenTransferTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(1).address } as const,
  ])("in $mode mode", contextValue => {
    describe("sign", () => {
      it("shows '+' for incoming transactions", () => {
        addAccount(mockLedgerAccount(1));

        render(fixture(contextValue, tokenTransferFixture({})));

        expect(screen.getByTestId("incoming-arrow")).toBeInTheDocument();
        expect(screen.queryByTestId("outgoing-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent("+0.000000000500 uUSD");
      });

      it("shows '-' for outgoing transactions", () => {
        addAccount(mockLedgerAccount(1));

        render(
          fixture(
            contextValue,
            tokenTransferFixture({
              from: { address: mockLedgerAccount(1).address.pkh },
              to: { address: mockImplicitAddress(2).pkh },
            })
          )
        );

        expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent("-0.000000000500 uUSD");
      });

      it("shows '-' if sender and target are both owned", () => {
        addAccount(mockLedgerAccount(0));
        addAccount(mockLedgerAccount(1));

        render(
          fixture(
            contextValue,
            tokenTransferFixture({
              to: { address: mockLedgerAccount(0).address.pkh },
              from: { address: mockLedgerAccount(1).address.pkh },
            })
          )
        );

        expect(screen.queryByTestId("incoming-arrow")).not.toBeInTheDocument();
        expect(screen.getByTestId("outgoing-arrow")).toBeInTheDocument();
        expect(screen.getByTestId("title")).toHaveTextContent("-0.000000000500 uUSD");
      });
    });

    describe("amount", () => {
      it("does not display decimal if not needed", () => {
        addAccount(mockLedgerAccount(1));
        const tokenTransfer = tokenTransferFixture({
          from: { address: mockLedgerAccount(1).address.pkh },
        });
        delete tokenTransfer.token.metadata.decimals;

        render(fixture(contextValue, tokenTransfer));

        expect(screen.getByTestId("title")).toHaveTextContent("-500 uUSD");
      });

      it("displays decimal if needed", () => {
        addAccount(mockLedgerAccount(1));
        const tokenTransfer = tokenTransferFixture({
          from: { address: mockLedgerAccount(1).address.pkh },
        });
        tokenTransfer.token.metadata.decimals = 2;

        render(fixture(contextValue, tokenTransfer));

        expect(screen.getByTestId("title")).toHaveTextContent("-5.00 uUSD");
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
          render(fixture(contextValue, tokenTransfer));

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

          render(fixture(contextValue, tokenTransfer));

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
          render(fixture(contextValue, tokenTransfer));

          expect(screen.getByTestId("title")).toHaveTextContent("uUSD");
        });

        it("shows the default token symbol if the token symbol is empty and name is present", () => {
          tokenTransfer.token.metadata.symbol = undefined;
          tokenTransfer.token.metadata.name = undefined;
          render(fixture(contextValue, tokenTransfer));

          expect(screen.getByTestId("title")).toHaveTextContent(defaultSymbol);
        });
      });
    });

    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, tokenTransferFixture({})));

          expect(screen.getByTestId("title")).toHaveAttribute(
            "href",
            `${network.tzktExplorerUrl}/transactions/56789`
          );
        });
      });
    });

    it("displays timestamp", () => {
      render(
        fixture(contextValue, tokenTransferFixture({ timestamp: "2021-01-02T00:00:00.000Z" }))
      );

      expect(screen.getByTestId("timestamp")).toHaveTextContent("2 Jan 2021");
    });

    describe("pills", () => {
      beforeEach(() => {
        addAccount(mockLedgerAccount(0));
      });

      it("shows both if sender is an owned account", () => {
        render(
          fixture(
            contextValue,
            tokenTransferFixture({
              from: { address: mockLedgerAccount(0).address.pkh },
              to: { address: mockLedgerAccount(1).address.pkh },
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
            tokenTransferFixture({
              to: { address: mockLedgerAccount(0).address.pkh },
              from: { address: mockLedgerAccount(1).address.pkh },
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
            tokenTransferFixture({
              to: { address: mockLedgerAccount(0).address.pkh },
              from: { address: mockLedgerAccount(0).address.pkh },
            })
          )
        );

        expect(screen.getByTestId("from")).toHaveTextContent("Account");
        expect(screen.getByTestId("to")).toHaveTextContent("Account");
      });
    });

    describe.each([
      { type: "NFT", transfer: tokenTransferFixture({ token: ghostnetThezard.token }) },
      { type: "token", transfer: tokenTransferFixture({}) },
    ])("for $type", ({ transfer }) => {
      afterEach(() => jest.restoreAllMocks());

      it("renders internal prefix for internal operations", () => {
        jest
          .spyOn(operationDestinationModule, "useGetOperationDestination")
          .mockReturnValue("unrelated");

        render(fixture(contextValue, transfer));

        expect(screen.getByTestId("internal-prefix")).toBeVisible();
      });

      it("does not render internal prefix for normal operations", () => {
        jest
          .spyOn(operationDestinationModule, "useGetOperationDestination")
          .mockReturnValue("incoming");
        render(fixture(contextValue, transfer));

        expect(screen.queryByTestId("internal-prefix")).not.toBeInTheDocument();
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
            tokenTransferFixture({}),
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
            tokenTransferFixture({ from: { address: mockLedgerAccount(0).address.pkh } }),
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
            tokenTransferFixture({ from: { address: mockLedgerAccount(0).address.pkh } }),
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
      render(fixture(contextValue, tokenTransferFixture({})));

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Token Transfer");
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
          tokenTransferFixture({ from: { address: mockLedgerAccount(0).address.pkh } }),
          transactionFixture({
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          })
        )
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, tokenTransferFixture({})));

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
