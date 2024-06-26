import { mockLedgerAccount } from "@umami/core";
import { addTestAccount, networksActions, store } from "@umami/state";
import { DefaultNetworks, TEZ } from "@umami/tezos";
import { type StakeOperation } from "@umami/tzkt";

import { OperationTileContext } from "./OperationTileContext";
import { StakeTile } from "./StakeTile";
import { stakeFixture } from "./testUtils";
import { render, screen } from "../../mocks/testUtils";
import { formatPkh } from "../../utils/format";

const fixture = (context: any, operation: StakeOperation) => (
  <OperationTileContext.Provider value={context}>
    <StakeTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<StakeTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(1).address } as const,
  ])("in $mode mode", contextValue => {
    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, stakeFixture()));

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
          stakeFixture({
            timestamp: "2021-01-02T00:00:00.000Z",
          })
        )
      );

      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });

    describe("pills", () => {
      beforeEach(() => addTestAccount(mockLedgerAccount(0)));

      it("shows both if sender is an owned account", () => {
        render(
          fixture(
            contextValue,
            stakeFixture({
              amount: 1,
              baker: { address: mockLedgerAccount(1).address.pkh },
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
            stakeFixture({
              amount: 1,
              baker: { address: mockLedgerAccount(0).address.pkh },
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
            stakeFixture({
              amount: 1,
              baker: { address: mockLedgerAccount(0).address.pkh },
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
      it("renders if there is any fee paid by the user", () => {
        addTestAccount(mockLedgerAccount(0));
        render(
          fixture(
            contextValue,
            stakeFixture({
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
            stakeFixture({
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
      render(fixture(contextValue, stakeFixture()));

      expect(screen.getByTestId("operation-type")).toHaveTextContent("Stake");
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };

    beforeEach(() => addTestAccount(mockLedgerAccount(0)));

    it("hides the fee", () => {
      render(
        fixture(
          contextValue,
          stakeFixture({
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          })
        )
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, stakeFixture()));

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
