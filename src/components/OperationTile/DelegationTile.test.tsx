import { DelegationTile } from "./DelegationTile";
import { OperationTileContext } from "./OperationTileContext";
import { delegationFixture } from "./testUtils";
import { mockImplicitAddress, mockLedgerAccount } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { DefaultNetworks } from "../../types/Network";
import { formatPkh } from "../../utils/format";
import { accountsSlice } from "../../utils/redux/slices/accountsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";
import { DelegationOperation, TEZ } from "../../utils/tezos";

const fixture = (context: any, operation: DelegationOperation) => (
  <OperationTileContext.Provider value={context}>
    <DelegationTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<DelegationTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(0).address } as const,
  ])("in $mode mode", contextValue => {
    describe("title", () => {
      it("displays delegate", () => {
        render(fixture(contextValue, delegationFixture({})));
        expect(screen.getByTestId("title")).toHaveTextContent("Delegate");
      });

      it("displays ended", () => {
        render(fixture(contextValue, delegationFixture({ newDelegate: undefined })));
        expect(screen.getByTestId("title")).toHaveTextContent("Delegation Ended");
      });
    });

    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        it("links to the operation page on tzkt", () => {
          store.dispatch(networksActions.setCurrent(network));

          render(fixture(contextValue, delegationFixture({})));

          expect(screen.getByTestId("title")).toHaveAttribute(
            "href",
            `${network.tzktExplorerUrl}/test-hash/1234`
          );
        });
      });
    });

    it("displays timestamp", () => {
      render(fixture(contextValue, delegationFixture({})));
      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });
  });

  describe("page mode", () => {
    const contextValue = { mode: "page" } as const;

    describe("fee", () => {
      it("displays fee paid by the user if present", () => {
        store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));

        render(
          fixture(
            contextValue,
            delegationFixture({
              bakerFee: 123,
            })
          )
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
          )
        );

        expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
      });
    });

    describe("operation type", () => {
      it("displays 'delegate' if delegating", () => {
        render(fixture(contextValue, delegationFixture({})));
        expect(screen.getByTestId("operation-type")).toHaveTextContent("Delegate");
      });

      test("displays 'delegation ended' if not delegating", () => {
        render(fixture(contextValue, delegationFixture({ newDelegate: undefined })));
        expect(screen.getByTestId("operation-type")).toHaveTextContent("Delegation Ended");
      });
    });

    it("displays both the sender and baker contract pills", () => {
      store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));

      render(fixture(contextValue, delegationFixture({})));

      expect(screen.getByTestId("from")).toHaveTextContent("Account");
      expect(screen.getByTestId("to")).toHaveTextContent(formatPkh(mockImplicitAddress(1).pkh));
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };

    beforeEach(() => {
      store.dispatch(accountsSlice.actions.addAccount(mockLedgerAccount(0)));
    });

    it("hides the fee", () => {
      render(fixture(contextValue, delegationFixture({})));
      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, delegationFixture({})));
      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });

    it("shows only the target contract pill", () => {
      render(fixture(contextValue, delegationFixture({})));

      expect(screen.queryByTestId("from")).not.toBeInTheDocument();
      expect(screen.getByTestId("to")).toHaveTextContent(formatPkh(mockImplicitAddress(1).pkh));
    });
  });
});
