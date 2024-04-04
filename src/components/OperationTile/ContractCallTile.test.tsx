import { ContractCallTile } from "./ContractCallTile";
import { OperationTileContext } from "./OperationTileContext";
import { contractCallFixture } from "./testUtils";
import { mockContractAddress, mockLedgerAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import { formatPkh } from "../../utils/format";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";
import { TEZ, TransactionOperation } from "../../utils/tezos";

const fixture = (context: any, operation: TransactionOperation) => (
  <OperationTileContext.Provider value={context}>
    <ContractCallTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<ContractCallTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(0).address } as const,
  ])("in $mode mode", contextValue => {
    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, contractCallFixture({})));

          expect(screen.getByTestId("title")).toHaveAttribute(
            "href",
            `${network.tzktExplorerUrl}/test-hash/1234`
          );
          expect(screen.getByTestId("title")).toHaveTextContent("Contract Call: test-entrypoint");
        });
      });
    });

    it("displays timestamp", () => {
      render(fixture(contextValue, contractCallFixture({})));
      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });

    it("shows both the sender and target contract pills", () => {
      store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));

      render(
        fixture(
          contextValue,
          contractCallFixture({
            sender: { address: mockLedgerAccount(0).address.pkh },
          })
        )
      );

      expect(screen.getByTestId("from")).toHaveTextContent("Account");
      expect(screen.getByTestId("to")).toHaveTextContent(formatPkh(mockContractAddress(0).pkh));
    });
  });

  describe("page mode", () => {
    const contextValue = { mode: "page" } as const;

    describe("fee", () => {
      it("renders if there is any fee paid by the user", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
        render(
          fixture(
            contextValue,
            contractCallFixture({
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
            contractCallFixture({
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
      render(fixture(contextValue, contractCallFixture({})));

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Contract Call");
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };
    beforeEach(() => {
      store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
    });

    it("hides the fee", () => {
      render(fixture(contextValue, contractCallFixture({})));

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, contractCallFixture({})));

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
