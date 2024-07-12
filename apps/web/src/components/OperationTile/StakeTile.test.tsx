import { mockLedgerAccount, stakeFixture } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks, TEZ, formatPkh } from "@umami/tezos";

import { StakeTile } from "./StakeTile";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, mockLedgerAccount(0));
});

describe("<StakeTile />", () => {
  describe("title link", () => {
    describe.each(DefaultNetworks)("on $name", network => {
      it("links to the operation page on tzkt", () => {
        store.dispatch(networksActions.setCurrent(network));

        render(<StakeTile operation={stakeFixture()} />, { store });

        expect(screen.getByTestId("title")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/test-hash/1234`
        );
      });
    });
  });

  it("displays timestamp", () => {
    render(
      <StakeTile
        operation={stakeFixture({
          timestamp: "2021-01-02T00:00:00.000Z",
        })}
      />,
      { store }
    );

    expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
  });

  test("pills", () => {
    render(
      <StakeTile
        operation={stakeFixture({
          amount: 1,
          baker: { address: mockLedgerAccount(1).address.pkh },
          sender: { address: mockLedgerAccount(0).address.pkh },
        })}
      />,
      { store }
    );

    expect(screen.getByTestId("from")).toHaveTextContent("Account");
    expect(screen.getByTestId("to")).toHaveTextContent(formatPkh(mockLedgerAccount(1).address.pkh));
  });

  describe("fee", () => {
    it("renders if there is any fee paid by the user", () => {
      render(
        <StakeTile
          operation={stakeFixture({
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
        <StakeTile
          operation={stakeFixture({
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
    render(<StakeTile operation={stakeFixture()} />, { store });

    expect(screen.getByTestId("operation-type")).toHaveTextContent("Stake");
  });
});
