import { mockImplicitAccount, mockMnemonicAccount } from "@umami/core";
import { addTestAccounts, makeStore } from "@umami/state";
import { getCombinedOperations, getRelatedTokenTransfers } from "@umami/tzkt";

import { HomeView } from "./HomeView";
import { fireEvent, render, screen } from "../../mocks/testUtils";

jest.mock("@umami/tzkt", () => ({
  ...jest.requireActual("@umami/tzkt"),
  getCombinedOperations: jest.fn(),
  getRelatedTokenTransfers: jest.fn(),
}));

describe("<HomeView />", () => {
  test("Clicking an account tile displays Account card drawer and marks account as selected", async () => {
    const store = makeStore();
    addTestAccounts(store, [
      mockMnemonicAccount(0),
      mockMnemonicAccount(1),
      mockMnemonicAccount(2),
    ]);
    jest.mocked(getCombinedOperations).mockResolvedValue([]);
    jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);

    render(<HomeView />, { store });

    const el = screen.getByTestId("account-tile-" + mockImplicitAccount(1).address.pkh);
    fireEvent.click(el);

    await screen.findByTestId("account-card-" + mockImplicitAccount(1).address.pkh);
    await screen.findByTestId("account-tile-" + mockImplicitAccount(1).address.pkh + "-selected");
  });
});
