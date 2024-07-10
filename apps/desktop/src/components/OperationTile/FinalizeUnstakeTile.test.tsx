import { mockLedgerAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks, TEZ } from "@umami/tezos";
import { type FinalizeUnstakeOperation } from "@umami/tzkt";

import { FinalizeUnstakeTile } from "./FinalizeUnstakeTile";
import { OperationTileContext } from "./OperationTileContext";
import { finalizeUnstakeFixture } from "@umami/core";
import { render, screen } from "../../mocks/testUtils";

const fixture = (context: any, operation: FinalizeUnstakeOperation) => (
  <OperationTileContext.Provider value={context}>
    <FinalizeUnstakeTile operation={operation} />
  </OperationTileContext.Provider>
);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<FinalizeUnstakeTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(1).address } as const,
  ])("in $mode mode", contextValue => {
    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, finalizeUnstakeFixture()), { store });

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
          finalizeUnstakeFixture({
            timestamp: "2021-01-02T00:00:00.000Z",
          })
        ),
        { store }
      );

      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });

    describe("pills", () => {
      beforeEach(() => addTestAccount(store, mockLedgerAccount(0)));

      it("shows only the sender (owned account)", () => {
        render(
          fixture(
            contextValue,
            finalizeUnstakeFixture({
              amount: 1,
              sender: { address: mockLedgerAccount(0).address.pkh },
            })
          ),
          { store }
        );

        expect(screen.queryByTestId("from")).not.toBeInTheDocument();
        expect(screen.getByTestId("to")).toHaveTextContent("Account");
      });
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
            finalizeUnstakeFixture({
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
            finalizeUnstakeFixture({
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
      render(fixture(contextValue, finalizeUnstakeFixture()), { store });

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Unstake");
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };

    beforeEach(() => addTestAccount(store, mockLedgerAccount(0)));

    it("hides the fee", () => {
      render(
        fixture(
          contextValue,
          finalizeUnstakeFixture({
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          })
        ),
        { store }
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, finalizeUnstakeFixture()), { store });

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
