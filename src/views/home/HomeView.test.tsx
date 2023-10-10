import { mockImplicitAccount } from "../../mocks/factories";
import { dispatchMockAccounts } from "../../mocks/helpers";
import { fireEvent, render, screen } from "../../mocks/testUtils";
import { getCombinedOperations, getTokenTransfers } from "../../utils/tezos";
import HomeView from "./HomeView";

beforeEach(() => {
  dispatchMockAccounts([mockImplicitAccount(0), mockImplicitAccount(1), mockImplicitAccount(2)]);
  jest.mocked(getCombinedOperations).mockResolvedValue([]);
  jest.mocked(getTokenTransfers).mockResolvedValue([]);
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
