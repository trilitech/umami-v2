import { mockLedgerAccount, originationFixture } from "@umami/core";
import { type UmamiStore, addTestAccount, makeStore, networksActions } from "@umami/state";
import { DefaultNetworks, TEZ, mockContractAddress } from "@umami/tezos";

import { OriginationTile } from "./OriginationTile";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<OriginationTile />", () => {
  describe("title link", () => {
    describe.each(DefaultNetworks)("on $name", network => {
      beforeEach(() => store.dispatch(networksActions.setCurrent(network)));

      it("links to the operation page on tzkt", () => {
        render(<OriginationTile operation={originationFixture()} />, { store });

        expect(screen.getByTestId("title")).toHaveAttribute(
          "href",
          `${network.tzktExplorerUrl}/test-hash/1234`
        );
      });

      it("shows a multisig account created title if it is a multisig contract", () => {
        render(<OriginationTile operation={originationFixture()} />, { store });
        expect(screen.getByTestId("title")).toHaveTextContent("Multisig Account Created");
      });

      it("shows a contract origination title if it is not a multisig contract", () => {
        render(
          <OriginationTile
            operation={originationFixture({
              originatedContract: {
                codeHash: 123,
                typeHash: 123,
                address: mockContractAddress(0).pkh,
              },
            })}
          />,
          { store }
        );
        expect(screen.getByTestId("title")).toHaveTextContent("Contract Origination");
      });

      it("shows a contract origination title if operation failed and there is no contract", () => {
        render(
          <OriginationTile operation={originationFixture({ originatedContract: undefined })} />,
          {
            store,
          }
        );
        expect(screen.getByTestId("title")).toHaveTextContent("Contract Origination");
      });
    });
  });

  it("displays timestamp", () => {
    render(<OriginationTile operation={originationFixture()} />, { store });
    expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
  });

  it("shows the sender pill", () => {
    addTestAccount(store, mockLedgerAccount(0));

    render(
      <OriginationTile
        operation={originationFixture({
          sender: { address: mockLedgerAccount(0).address.pkh },
        })}
      />,
      { store }
    );

    expect(screen.getByTestId("from")).toHaveTextContent("Account");
  });

  describe("fee", () => {
    it("renders if there is any fee paid by the user", () => {
      addTestAccount(store, mockLedgerAccount(0));

      render(
        <OriginationTile
          operation={originationFixture({
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
        <OriginationTile
          operation={originationFixture({
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
    render(<OriginationTile operation={originationFixture()} />, { store });
    expect(screen.getByTestId("operation-type")).toHaveTextContent("Contract Origination");
  });
});
