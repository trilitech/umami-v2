import { finalizeUnstakeFixture, mockLedgerAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks, TEZ } from "@umami/tezos";

import { FinalizeUnstakeTile } from "./FinalizeUnstakeTile";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockLedgerAccount(0));
});

describe("<FinalizeUnstakeTile />", () => {
  describe("title link", () => {
    describe.each(DefaultNetworks)("on $name", network => {
      it("links to the operation page on tzkt", () => {
        store.dispatch(networksActions.setCurrent(network));

        render(<FinalizeUnstakeTile operation={finalizeUnstakeFixture()} />, { store });

        expect(screen.getByTestId("title")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/test-hash/1234`
        );
      });
    });
  });

  it("displays timestamp", () => {
    render(
      <FinalizeUnstakeTile
        operation={finalizeUnstakeFixture({
          timestamp: "2021-01-02T00:00:00.000Z",
        })}
      />,
      { store }
    );

    expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
  });

  it("shows only the sender (owned account) pill", () => {
    render(
      <FinalizeUnstakeTile
        operation={finalizeUnstakeFixture({
          amount: 1,
          sender: { address: mockLedgerAccount(0).address.pkh },
        })}
      />,
      { store }
    );

    expect(screen.queryByTestId("from")).not.toBeInTheDocument();
    expect(screen.getByTestId("to")).toHaveTextContent("Account");
  });

  describe("fee", () => {
    it("renders if there is any fee paid by the user", () => {
      render(
        <FinalizeUnstakeTile
          operation={finalizeUnstakeFixture({
            bakerFee: 100,
            storageFee: 20,
            allocationFee: 3,
          })}
        />,
        { store }
      );

      expect(screen.getByTestId("fee")).toHaveTextContent(`0.000123 ${TEZ}`);
    });

    it("renders nothing if the fee is absent", () => {
      render(
        <FinalizeUnstakeTile
          operation={finalizeUnstakeFixture({
            bakerFee: 0,
            storageFee: 0,
            allocationFee: 0,
          })}
        />,
        { store }
      );

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });
  });

  it("shows operation type", () => {
    render(<FinalizeUnstakeTile operation={finalizeUnstakeFixture()} />, { store });

    expect(screen.getByTestId("operation-type")).toHaveTextContent("Unstake");
  });
});
