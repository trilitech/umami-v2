import { mockContractAddress, mockLedgerAccount } from "@umami/test-utils";
import { DefaultNetworks } from "@umami/tezos";
import { type OriginationOperation } from "@umami/tzkt";

import { OperationTileContext } from "./OperationTileContext";
import { OriginationTile } from "./OriginationTile";
import { originationFixture } from "./testUtils";
import { addAccount } from "../../mocks/helpers";
import { render, screen } from "../../mocks/testUtils";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";
import { TEZ } from "../../utils/tezos";

const fixture = (context: any, operation: OriginationOperation) => (
  <OperationTileContext.Provider value={context}>
    <OriginationTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<OriginationTile />", () => {
  describe.each([
    { mode: "page" } as const,
    { mode: "drawer", selectedAddress: mockLedgerAccount(0).address } as const,
  ])("in $mode mode", contextValue => {
    describe("title link", () => {
      describe.each(DefaultNetworks)("on $name", network => {
        beforeEach(() => {
          store.dispatch(networksActions.setCurrent(network));
        });

        it("links to the operation page on tzkt", () => {
          render(fixture(contextValue, originationFixture()));

          expect(screen.getByTestId("title")).toHaveAttribute(
            "href",
            `${network.tzktExplorerUrl}/test-hash/1234`
          );
        });

        it("shows a multisig account created title if it is a multisig contract", () => {
          render(fixture(contextValue, originationFixture()));
          expect(screen.getByTestId("title")).toHaveTextContent("Multisig Account Created");
        });

        it("shows a contract origination title if it is not a multisig contract", () => {
          render(
            fixture(
              contextValue,
              originationFixture({
                originatedContract: {
                  codeHash: 123,
                  typeHash: 123,
                  address: mockContractAddress(0).pkh,
                },
              })
            )
          );
          expect(screen.getByTestId("title")).toHaveTextContent("Contract Origination");
        });
      });
    });

    it("displays timestamp", () => {
      render(fixture(contextValue, originationFixture()));
      expect(screen.getByTestId("timestamp")).toHaveTextContent("02 Jan 2021");
    });

    it("shows the sender pill", () => {
      addAccount(mockLedgerAccount(0));

      render(
        fixture(
          contextValue,
          originationFixture({
            sender: { address: mockLedgerAccount(0).address.pkh },
          })
        )
      );

      expect(screen.getByTestId("from")).toHaveTextContent("Account");
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
            originationFixture({
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
            originationFixture({
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
      render(fixture(contextValue, originationFixture()));
      expect(screen.getByTestId("operation-type")).toHaveTextContent("Contract Origination");
    });
  });

  describe("drawer mode", () => {
    const contextValue = { mode: "drawer", selectedAddress: mockLedgerAccount(0).address };
    beforeEach(() => addAccount(mockLedgerAccount(0)));

    it("hides the fee", () => {
      render(fixture(contextValue, originationFixture()));

      expect(screen.queryByTestId("fee")).not.toBeInTheDocument();
    });

    it("hides the operation type", () => {
      render(fixture(contextValue, originationFixture()));

      expect(screen.queryByTestId("operation-type")).not.toBeInTheDocument();
    });
  });
});
