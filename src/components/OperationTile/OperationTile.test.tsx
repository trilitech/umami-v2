import { render, screen } from "../../mocks/testUtils";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import store from "../../utils/redux/store";
import { TzktCombinedOperation } from "../../utils/tezos";
import { OperationTile } from "./OperationTile";
import { OperationTileContext } from "./OperationTileContext";
import {
  contractCallFixture,
  delegationFixture,
  originationFixture,
  tokenTransferFixture,
  transactionFixture,
} from "./testUtils";

const fixture = (operation: TzktCombinedOperation) => (
  <OperationTileContext.Provider value={{ mode: "page" }}>
    <OperationTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<OperationTile />", () => {
  it("renders Delegation", () => {
    render(fixture(delegationFixture({})));
    expect(screen.getByTestId("operation-tile-delegation")).toBeInTheDocument();
  });

  it("renders Origination", () => {
    render(fixture(originationFixture({})));
    expect(screen.getByTestId("operation-tile-origination")).toBeInTheDocument();
  });

  it("renders ContractCall", () => {
    render(fixture(contractCallFixture({})));
    expect(screen.getByTestId("operation-tile-contract-call")).toBeInTheDocument();
  });

  it("renders Transaction", () => {
    render(fixture(transactionFixture({})));
    expect(screen.getByTestId("operation-tile-transaction")).toBeInTheDocument();
  });

  describe("token transfer", () => {
    const tokenTransferTransaction = contractCallFixture({
      parameter: {
        entrypoint: "transfer",
        value: {},
      },
    });

    it("renders ContractCall if token transfer info is missing", () => {
      render(fixture(tokenTransferTransaction));
      expect(screen.getByTestId("operation-tile-contract-call")).toBeInTheDocument();
    });

    it("renders Transaction if token info is missing/incorrect", () => {
      jest.spyOn(console, "warn").mockImplementation();
      store.dispatch(
        assetsActions.updateTokenTransfers([tokenTransferFixture({ token: {} as any })])
      );

      render(fixture(tokenTransferTransaction));
      expect(screen.getByTestId("operation-tile-transaction")).toBeInTheDocument();
    });

    it("renders TokenTransfer", () => {
      store.dispatch(assetsActions.updateTokenTransfers([tokenTransferFixture({})]));

      render(fixture(tokenTransferTransaction));
      expect(screen.getByTestId("operation-tile-token-transfer")).toBeInTheDocument();
    });

    it("renders TokenTransfer when the operation is a token transfer", () => {
      render(fixture({ type: "token_transfer", ...tokenTransferFixture({}) }));
      expect(screen.getByTestId("operation-tile-token-transfer")).toBeInTheDocument();
    });

    it("renders nothing if token is invalid", () => {
      jest.spyOn(console, "warn").mockImplementation();

      render(fixture({ type: "token_transfer", ...tokenTransferFixture({ token: {} as any }) }));
      expect(screen.queryByTestId(/operation-tile/)).not.toBeInTheDocument();
    });
  });
});
