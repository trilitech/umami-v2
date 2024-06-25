import { mockImplicitAccount, mockMnemonicAccount } from "@umami/test-utils";
import { getCombinedOperations, getRelatedTokenTransfers } from "@umami/tzkt";

import { HomeView } from "./HomeView";
import { addAccount } from "../../mocks/helpers";
import { fireEvent, render, screen } from "../../mocks/testUtils";

jest.mock("@umami/tzkt", () => ({
  ...jest.requireActual("@umami/tzkt"),
  getCombinedOperations: jest.fn(),
  getRelatedTokenTransfers: jest.fn(),
}));

beforeEach(() => {
  [mockMnemonicAccount(0), mockMnemonicAccount(1), mockMnemonicAccount(2)].forEach(addAccount);
  jest.mocked(getCombinedOperations).mockResolvedValue([]);
  jest.mocked(getRelatedTokenTransfers).mockResolvedValue([]);
});

describe("<HomeView />", () => {
  beforeEach(() => {
    // Taken from Jest's official documentation
    // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
    // needed for useMediaQuery hook
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test("Clicking an account tile displays Account card drawer and marks account as selected", async () => {
    render(<HomeView />);
    const el = screen.getByTestId("account-tile-" + mockImplicitAccount(1).address.pkh);
    fireEvent.click(el);

    await screen.findByTestId("account-card-" + mockImplicitAccount(1).address.pkh);
    await screen.findByTestId("account-tile-" + mockImplicitAccount(1).address.pkh + "-selected");
  });
});
