import {
  contractCallFixture,
  delegationFixture,
  finalizeUnstakeFixture,
  originationFixture,
  stakeFixture,
  tokenTransferFixture,
  transactionFixture,
  unstakeFixture,
} from "@umami/core";
import { type UmamiStore, assetsActions, makeStore } from "@umami/state";

import { OperationTile } from "./OperationTile";
import { render, screen } from "../../testUtils";

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<OperationTile />", () => {
  it("renders Delegation", () => {
    render(<OperationTile operation={delegationFixture()} />, { store });
    expect(screen.getByTestId("operation-tile-delegation")).toBeVisible();
  });

  it("renders Origination", () => {
    render(<OperationTile operation={originationFixture()} />, { store });
    expect(screen.getByTestId("operation-tile-origination")).toBeVisible();
  });

  it("renders ContractCall", () => {
    render(<OperationTile operation={contractCallFixture()} />, { store });
    expect(screen.getByTestId("operation-tile-contract-call")).toBeVisible();
  });

  it("renders Transaction", () => {
    render(<OperationTile operation={transactionFixture()} />, { store });
    expect(screen.getByTestId("operation-tile-transaction")).toBeVisible();
  });

  it("renders Stake", () => {
    render(<OperationTile operation={stakeFixture()} />, { store });
    expect(screen.getByTestId("operation-tile-stake")).toBeVisible();
  });

  it("renders Unstake", () => {
    render(<OperationTile operation={unstakeFixture()} />, { store });
    expect(screen.getByTestId("operation-tile-unstake")).toBeVisible();
  });

  it("renders FinalizeUnstake", () => {
    render(<OperationTile operation={finalizeUnstakeFixture()} />, { store });
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
      render(<OperationTile operation={tokenTransferTransaction} />, { store });
      expect(screen.getByTestId("operation-tile-contract-call")).toBeVisible();
    });

    it("renders Transaction if token info is missing/incorrect", () => {
      jest.spyOn(console, "warn").mockImplementation();
      store.dispatch(
        assetsActions.updateTokenTransfers([tokenTransferFixture({ token: {} as any })])
      );

      render(<OperationTile operation={tokenTransferTransaction} />, { store });
      expect(screen.getByTestId("operation-tile-transaction")).toBeVisible();
    });

    it("renders TokenTransfer", () => {
      store.dispatch(assetsActions.updateTokenTransfers([tokenTransferFixture()]));

      render(<OperationTile operation={tokenTransferTransaction} />, { store });
      expect(screen.getByTestId("operation-tile-token-transfer")).toBeVisible();
    });

    it("renders TokenTransfer when the operation is a token transfer", () => {
      render(<OperationTile operation={tokenTransferFixture()} />, { store });
      expect(screen.getByTestId("operation-tile-token-transfer")).toBeVisible();
    });

    it("renders nothing if token is invalid", () => {
      jest.spyOn(console, "warn").mockImplementation();

      render(<OperationTile operation={tokenTransferFixture({ token: {} as any })} />, { store });
      expect(screen.queryByTestId(/operation-tile/)).not.toBeInTheDocument();
    });
  });
});
