import { AccountBalance } from "./AccountBalance";
import { mockImplicitAddress } from "../mocks/factories";
import { render, screen } from "../mocks/testUtils";
import { rawAccountFixture } from "../mocks/tzktResponse";
import { assetsActions } from "../utils/redux/slices/assetsSlice";
import { store } from "../utils/redux/store";

describe("<AccountBalance />", () => {
  it("renders nothing if there is no balance for an account", () => {
    render(<AccountBalance address={mockImplicitAddress(0).pkh} />);
    expect(screen.queryByTestId("account-balance")).not.toBeInTheDocument();
  });

  it("renders the balance for an account", () => {
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({ balance: 1234567 }),
        rawAccountFixture({ address: mockImplicitAddress(1).pkh, balance: 9234567 }),
      ])
    );
    render(<AccountBalance address={mockImplicitAddress(0).pkh} />);
    expect(screen.getByTestId("account-balance")).toHaveTextContent("1.234567");
  });
});
