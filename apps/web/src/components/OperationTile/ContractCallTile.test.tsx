import { contractCallFixture, mockLedgerAccount } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks, TEZ, formatPkh, mockContractAddress } from "@umami/tezos";

import { ContractCallTile } from "./ContractCallTile";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<ContractCallTile />", () => {
  describe("title link", () => {
    describe.each(DefaultNetworks)("on $name", network => {
      it("links to the operation page on tzkt", () => {
        store.dispatch(networksActions.setCurrent(network));

        render(<ContractCallTile operation={contractCallFixture()} />, { store });

        expect(screen.getByTestId("title")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/test-hash/1234`
        );
        expect(screen.getByTestId("title")).toHaveTextContent("Contract call: test-entrypoint");
      });
    });
  });

  it("displays timestamp", () => {
    render(<ContractCallTile operation={contractCallFixture()} />, { store });
    expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
  });

  it("shows both the sender and target contract pills", () => {
    addTestAccount(store, mockLedgerAccount(0));

    render(
      <ContractCallTile
        operation={contractCallFixture({ sender: { address: mockLedgerAccount(0).address.pkh } })}
      />,
      { store }
    );

    expect(screen.getByTestId("from")).toHaveTextContent("Account");
    expect(screen.getByTestId("to")).toHaveTextContent(formatPkh(mockContractAddress(0).pkh));
  });

  describe("fee", () => {
    it("renders if there is any fee paid by the user", () => {
      addTestAccount(store, mockLedgerAccount(0));
      render(
        <ContractCallTile
          operation={contractCallFixture({
            sender: { address: mockLedgerAccount(0).address.pkh },
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
        <ContractCallTile
          operation={contractCallFixture({
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
    render(<ContractCallTile operation={contractCallFixture()} />, { store });

    expect(screen.getByTestId("operation-type")).toHaveTextContent("Contract Call");
  });
});
