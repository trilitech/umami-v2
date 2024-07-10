import { mockLedgerAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks, TEZ, formatPkh, mockContractAddress } from "@umami/tezos";
import { type TransactionOperation } from "@umami/tzkt";

import { ContractCallTile } from "./ContractCallTile";
import { OperationTileContext } from "./OperationTileContext";
import { contractCallFixture } from "@umami/core";
import { render, screen } from "../../mocks/testUtils";

const fixture = (context: any, operation: TransactionOperation) => (
  <OperationTileContext.Provider value={context}>
    <ContractCallTile operation={operation} />
  </OperationTileContext.Provider>
);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<ContractCallTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(0).address } as const,
  ])("in $mode mode", contextValue => {
    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, contractCallFixture()), { store });

          expect(screen.getByTestId("title")).toHaveAttribute(
            "href",
            `${network.tzktExplorerUrl}/test-hash/1234`
          );
          expect(screen.getByTestId("title")).toHaveTextContent("Contract Call: test-entrypoint");
        });
      });
    });

    it("displays timestamp", () => {
      render(fixture(contextValue, contractCallFixture()), { store });
      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });

    it("shows both the sender and target contract pills", () => {
      addTestAccount(store, mockLedgerAccount(0));

      render(
        fixture(
          contextValue,
          contractCallFixture({
            sender: { address: mockLedgerAccount(0).address.pkh },
          })
        ),
        { store }
      );

      expect(screen.getByTestId("from")).toHaveTextContent("Account");
      expect(screen.getByTestId("to")).toHaveTextContent(formatPkh(mockContractAddress(0).pkh));
    });
  });

  describe("page mode", () => {
    const contextValue = { mode: "page" } as const;

    describe("fee", () => {
      it("renders if there is any fee paid by the user", () => {
        addTestAccount(store, mockLedgerAccount(0));
        render(
          fixture(
            contextValue,
            contractCallFixture({
              sender: { address: mockLedgerAccount(0).address.pkh },
              bakerFee: 100,
              storageFee: 20,
              allocationFee: 3,
            })
          ),
          { store }
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
          ),
          { store }
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });
    });

    it("shows operation type", () => {
      render(fixture(contextValue, contractCallFixture()), { store });

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Contract Call");
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };
    beforeEach(() => addTestAccount(store, mockLedgerAccount(0)));

    it("hides the fee", () => {
      render(fixture(contextValue, contractCallFixture()), { store });

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, contractCallFixture()), { store });

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
