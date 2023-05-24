import { mockAccount } from "../../mocks/factories";
import { dispatchMockAccounts, resetAccounts } from "../../mocks/helpers";
import { fireEvent, render, screen } from "../../mocks/testUtils";
import HomeView from "./HomeView";

beforeEach(() => {
  dispatchMockAccounts([mockAccount(0), mockAccount(1), mockAccount(2)]);
});
afterEach(() => {
  resetAccounts();
});

describe("<HomeView />", () => {
  test("Clicking an account tile displays Account card drawer and marks account as selected", async () => {
    render(<HomeView />);
    // If you use .click() directly on el you get the act warnings...
    const el = screen.getByTestId("account-tile-" + mockAccount(1).pkh);
    fireEvent.click(el);

    await screen.findByTestId("account-card-" + mockAccount(1).pkh);
    await screen.findByTestId(
      "account-tile-" + mockAccount(1).pkh + "-selected"
    );
  });
});
