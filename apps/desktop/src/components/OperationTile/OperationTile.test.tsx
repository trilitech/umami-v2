import { type TzktCombinedOperation } from "@umami/tzkt";

import { OperationTile } from "./OperationTile";
import { OperationTileContext } from "./OperationTileContext";
import {
  contractCallFixture,
  delegationFixture,
  finalizeUnstakeFixture,
  originationFixture,
  stakeFixture,
  tokenTransferFixture,
  transactionFixture,
  unstakeFixture,
} from "./testUtils";
import { render, screen } from "../../mocks/testUtils";
import { assetsActions } from "../../utils/redux/slices/assetsSlice";
import { store } from "../../utils/redux/store";

const fixture = (operation: TzktCombinedOperation) => (
  <OperationTileContext.Provider value={{ mode: "page" }}>
    <OperationTile operation={operation} />
  </OperationTileContext.Provider>
);

describe("<OperationTile />", () => {
  it("renders Delegation", () => {
    render(fixture(delegationFixture()));
    expect(screen.getByTestId("operation-tile-delegation")).toBeVisible();
  });

  it("renders Origination", () => {
    render(fixture(originationFixture()));
    expect(screen.getByTestId("operation-tile-origination")).toBeVisible();
  });

  it("renders ContractCall", () => {
    render(fixture(contractCallFixture()));
    expect(screen.getByTestId("operation-tile-contract-call")).toBeVisible();
  });

  it("renders Transaction", () => {
    render(fixture(transactionFixture()));
    expect(screen.getByTestId("operation-tile-transaction")).toBeVisible();
  });

  it("renders Stake", () => {
    render(fixture(stakeFixture()));
    expect(screen.getByTestId("operation-tile-stake")).toBeVisible();
  });

  it("renders Unstake", () => {
    render(fixture(unstakeFixture()));
    expect(screen.getByTestId("operation-tile-unstake")).toBeVisible();
  });

  it("renders FinalizeUnstake", () => {
    render(fixture(finalizeUnstakeFixture()));
    expect(screen.getByTestId("operation-tile-finalize-unstake")).toBeVisible();
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
      expect(screen.getByTestId("operation-tile-contract-call")).toBeVisible();
    });

    it("renders Transaction if token info is missing/incorrect", () => {
      jest.spyOn(console, "warn").mockImplementation();
      store.dispatch(
        assetsActions.updateTokenTransfers([tokenTransferFixture({ token: {} as any })])
      );

      render(fixture(tokenTransferTransaction));
      expect(screen.getByTestId("operation-tile-transaction")).toBeVisible();
    });

    it("renders TokenTransfer", () => {
      store.dispatch(assetsActions.updateTokenTransfers([tokenTransferFixture()]));

      render(fixture(tokenTransferTransaction));
      expect(screen.getByTestId("operation-tile-token-transfer")).toBeVisible();
    });

    it("renders TokenTransfer when the operation is a token transfer", () => {
      render(fixture(tokenTransferFixture()));
      expect(screen.getByTestId("operation-tile-token-transfer")).toBeVisible();
    });

    it("renders nothing if token is invalid", () => {
      jest.spyOn(console, "warn").mockImplementation();

      render(fixture(tokenTransferFixture({ token: {} as any })));
      expect(screen.queryByTestId(/operation-tile/)).not.toBeInTheDocument();
    });
  });
});
