import { mockLedgerAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks, TEZ, formatPkh, mockImplicitAddress } from "@umami/tezos";
import { type DelegationOperation } from "@umami/tzkt";

import { DelegationTile } from "./DelegationTile";
import { OperationTileContext } from "./OperationTileContext";
import { delegationFixture } from "@umami/core";
import { render, screen } from "../../mocks/testUtils";

const fixture = (context: any, operation: DelegationOperation) => (
  <OperationTileContext.Provider value={context}>
    <DelegationTile operation={operation} />
  </OperationTileContext.Provider>
);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<DelegationTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(0).address } as const,
  ])("in $mode mode", contextValue => {
    describe("title", () => {
      it("displays delegate", () => {
        render(fixture(contextValue, delegationFixture()), { store });
        expect(screen.getByTestId("title")).toHaveTextContent("Delegate");
      });

      it("displays ended", () => {
        render(fixture(contextValue, delegationFixture({ newDelegate: undefined })), { store });
        expect(screen.getByTestId("title")).toHaveTextContent("Delegation Ended");
      });
    });

    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, delegationFixture()), { store });

          expect(screen.getByTestId("title")).toHaveAttribute(
            "href",
            `${network.tzktExplorerUrl}/test-hash/1234`
          );
        });
      });
    });

    it("displays timestamp", () => {
      render(fixture(contextValue, delegationFixture()), { store });
      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });

    it("displays both the sender and baker contract pills", () => {
      addTestAccount(store, mockLedgerAccount(0));

      render(fixture(contextValue, delegationFixture()), { store });

      expect(screen.getByTestId("from")).toHaveTextContent("Account");
      expect(screen.getByTestId("to")).toHaveTextContent(formatPkh(mockImplicitAddress(1).pkh));
    });
  });

  describe("page mode", () => {
    const contextValue = { mode: "page" } as const;

    describe("fee", () => {
      it("displays fee paid by the user if present", () => {
        addTestAccount(store, mockLedgerAccount(0));

        render(
          fixture(
            contextValue,
            delegationFixture({
              bakerFee: 123,
            })
          ),
          { store }
        );

        expect(screen.getByTestId("fee")).toHaveTextContent(`0.000123 ${TEZ}`);
      });

      it("displays nothing if the fee is absent", () => {
        render(
          fixture(
            contextValue,
            delegationFixture({
              bakerFee: 0,
            })
          ),
          { store }
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });
    });

    describe("operation type", () => {
      it("displays 'delegate' if delegating", () => {
        render(fixture(contextValue, delegationFixture()), { store });
        expect(screen.getByTestId("operation-type")).toHaveTextContent("Delegate");
      });

      test("displays 'delegation ended' if not delegating", () => {
        render(fixture(contextValue, delegationFixture({ newDelegate: undefined })), { store });
        expect(screen.getByTestId("operation-type")).toHaveTextContent("Delegation Ended");
      });
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };

    beforeEach(() => addTestAccount(store, mockLedgerAccount(0)));

    it("hides the fee", () => {
      render(fixture(contextValue, delegationFixture()), { store });
      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, delegationFixture()), { store });
      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
