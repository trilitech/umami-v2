import { delegationFixture, mockLedgerAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks, TEZ, formatPkh, mockImplicitAddress } from "@umami/tezos";

import { DelegationTile } from "./DelegationTile";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<DelegationTile />", () => {
  describe("title", () => {
    it("displays delegate", () => {
      render(<DelegationTile operation={delegationFixture()} />, { store });
      expect(screen.getByTestId("title")).toHaveTextContent("Delegate");
    });

    it("displays ended", () => {
      render(<DelegationTile operation={delegationFixture({ newDelegate: undefined })} />, {
        store,
      });
      expect(screen.getByTestId("title")).toHaveTextContent("Delegation Ended");
    });
  });

  describe("title link", () => {
    describe.each(DefaultNetworks)("on $name", network => {
      it("links to the operation page on tzkt", () => {
        store.dispatch(networksActions.setCurrent(network));

        render(<DelegationTile operation={delegationFixture()} />, { store });

        expect(screen.getByTestId("title")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/test-hash/1234`
        );
      });
    });
  });

  it("displays timestamp", () => {
    render(<DelegationTile operation={delegationFixture()} />, { store });
    expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
  });

  it("displays both the sender and baker contract pills", () => {
    addTestAccount(store, mockLedgerAccount(0));

    render(<DelegationTile operation={delegationFixture()} />, { store });

    expect(screen.getByTestId("from")).toHaveTextContent("Account");
    expect(screen.getByTestId("to")).toHaveTextContent(formatPkh(mockImplicitAddress(1).pkh));
  });

  describe("fee", () => {
    it("displays fee paid by the user if present", () => {
      addTestAccount(store, mockLedgerAccount(0));

      render(<DelegationTile operation={delegationFixture({ bakerFee: 123 })} />, { store });

      expect(screen.getByTestId("fee")).toHaveTextContent(`0.000123 ${TEZ}`);
    });

    it("displays nothing if the fee is absent", () => {
      render(<DelegationTile operation={delegationFixture({ bakerFee: 0 })} />, { store });

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });
  });

  describe("operation type", () => {
    it("displays 'delegate' if delegating", () => {
      render(<DelegationTile operation={delegationFixture()} />, { store });
      expect(screen.getByTestId("operation-type")).toHaveTextContent("Delegate");
    });

    test("displays 'delegation ended' if not delegating", () => {
      render(<DelegationTile operation={delegationFixture({ newDelegate: undefined })} />, {
        store,
      });
      expect(screen.getByTestId("operation-type")).toHaveTextContent("Delegation Ended");
    });
  });
});
