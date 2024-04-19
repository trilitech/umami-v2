import { OperationsView } from "./OperationsView";
import { mockImplicitAccount, mockMnemonicAccount } from "../../mocks/factories";
import { addAccount } from "../../mocks/helpers";
import { act, render, screen, userEvent, waitFor } from "../../mocks/testUtils";
import { mockTzktTezTransfer } from "../../mocks/transfers";
import { MAINNET } from "../../types/Network";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";
import {
  TzktCombinedOperation,
  getCombinedOperations,
  getRelatedTokenTransfers,
} from "../../utils/tezos";

jest.mock("../../utils/tezos", () => ({
  ...jest.requireActual("../../utils/tezos"),
  getCombinedOperations: jest.fn(),
  getRelatedTokenTransfers: jest.fn(),
}));

describe("OperationsView", () => {
  beforeEach(() => {
    addAccount(mockMnemonicAccount(1));
    addAccount(mockMnemonicAccount(2));
    store.dispatch(networksActions.setCurrent(MAINNET));
  });

  describe("without operations", () => {
    beforeEach(() => {
      jest.mocked(getCombinedOperations).mockResolvedValue([]);
      jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);
    });

    it("displays an empty state when no account filter applied", async () => {
      render(<OperationsView />);

      await waitFor(() => {
        expect(screen.getByTestId("empty-state-message")).toBeVisible();
      });
      expect(screen.getByText("No operations to show")).toBeVisible();
      expect(screen.getByText("Your operations history will appear here...")).toBeVisible();
      expect(screen.queryByTestId("view-all-operations-button")).not.toBeInTheDocument();
    });

    it("displays an empty state when account filter applied", async () => {
      const user = userEvent.setup();
      render(<OperationsView />);

      // filter by one of the accounts
      await act(() => user.click(screen.getByTestId("account-filter")));
      await act(() => user.click(screen.getAllByTestId("address-tile")[0]));
      expect(screen.getAllByTestId("account-pill")).toHaveLength(1);

      await waitFor(() => expect(screen.getByTestId("empty-state-message")).toBeVisible());
      expect(screen.getByText("No operations to show")).toBeVisible();
      expect(screen.getByText("Your operations history will appear here...")).toBeVisible();
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
      render(<OperationsView />);

      await waitFor(() => {
        expect(screen.queryByTestId("empty-state-message")).not.toBeInTheDocument();
      });
    });
  });
});
