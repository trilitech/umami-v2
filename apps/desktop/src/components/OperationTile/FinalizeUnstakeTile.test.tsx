import { mockLedgerAccount } from "@umami/test-utils";
import { DefaultNetworks } from "@umami/tezos";
import { type FinalizeUnstakeOperation } from "@umami/tzkt";

import { FinalizeUnstakeTile } from "./FinalizeUnstakeTile";
import { OperationTileContext } from "./OperationTileContext";
import { finalizeUnstakeFixture } from "./testUtils";
import { addAccount } from "../../mocks/helpers";
import { render, screen } from "../../mocks/testUtils";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";
import { TEZ } from "../../utils/tezos";

const fixture = (context: any, operation: FinalizeUnstakeOperation) => (
  <OperationTileContext.Provider value={context}>
    <FinalizeUnstakeTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<FinalizeUnstakeTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(1).address } as const,
  ])("in $mode mode", contextValue => {
    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, finalizeUnstakeFixture()));

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
        )
      );

      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });

    describe("pills", () => {
      beforeEach(() => addAccount(mockLedgerAccount(0)));

      it("shows only the sender (owned account)", () => {
        render(
          fixture(
            contextValue,
            finalizeUnstakeFixture({
              amount: 1,
              sender: { address: mockLedgerAccount(0).address.pkh },
            })
          )
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
        addAccount(mockLedgerAccount(0));
        render(
          fixture(
            contextValue,
            finalizeUnstakeFixture({
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
            finalizeUnstakeFixture({
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
      render(fixture(contextValue, finalizeUnstakeFixture()));

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Unstake");
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };

    beforeEach(() => addAccount(mockLedgerAccount(0)));

    it("hides the fee", () => {
      render(
        fixture(
          contextValue,
          finalizeUnstakeFixture({
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          })
        )
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, finalizeUnstakeFixture()));

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
