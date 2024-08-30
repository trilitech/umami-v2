import { mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  makeStore,
  networksActions,
} from "@umami/state";
import { MAINNET } from "@umami/tezos";
import {
  type TzktCombinedOperation,
  getCombinedOperations,
  getRelatedTokenTransfers,
  mockTzktTezTransfer,
} from "@umami/tzkt";

import { Activity } from "./Activity";
import { render, screen, waitFor } from "../../testUtils";

jest.mock("@umami/tzkt", () => ({
  ...jest.requireActual("@umami/tzkt"),
  getCombinedOperations: jest.fn(),
  getRelatedTokenTransfers: jest.fn(),
}));

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<Activity />", () => {
  beforeEach(() => {
    addTestAccount(store, mockMnemonicAccount(1));
    addTestAccount(store, mockMnemonicAccount(2));
    store.dispatch(networksActions.setCurrent(MAINNET));
  });

  describe("without operations", () => {
    beforeEach(() => {
      jest.mocked(getCombinedOperations).mockResolvedValue([]);
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);
    });

    it("displays an empty state ", async () => {
      render(<Activity />, { store });

      await waitFor(() => {
        expect(screen.getByTestId("empty-state-message")).toBeVisible();
      });
      expect(screen.getByText("Buy Tez Now")).toBeVisible();
      expect(
        screen.getByText("You need Tez to take part in any activity. Buy some to get started.")
      ).toBeVisible();
      expect(screen.queryByTestId("view-all-operations-button")).not.toBeInTheDocument();
    });
  });

  describe("with operations", () => {
    beforeEach(() => {
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);
      jest.mocked(getCombinedOperations).mockResolvedValue([
        {
          ...mockTzktTezTransfer(
            mockMnemonicAccount(1).address.pkh,
            mockImplicitAccount(0).address.pkh,
            1000000
          ),
          id: 1,
        } as TzktCombinedOperation,
        {
          ...mockTzktTezTransfer(
            mockImplicitAccount(0).address.pkh,
            mockMnemonicAccount(1).address.pkh,
            2000000
          ),
          id: 2,
        } as TzktCombinedOperation,
      ]);
    });

    it("hides empty state component", async () => {
      render(<Activity />, { store });

      await waitFor(() =>
        expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument()
      );

      await waitFor(() => expect(screen.getAllByTestId(/operation-tile-/).length).toEqual(2));
    });
  });

  describe("when user is unverified", () => {
    beforeEach(() => {
      store.dispatch(accountsActions.setIsVerified(false));
    });

    it("renders verify message", async () => {
      render(<Activity />, { store });

      await waitFor(() => {
        expect(screen.getByTestId("verify-message")).toBeVisible();
      });
    });
  });
});
