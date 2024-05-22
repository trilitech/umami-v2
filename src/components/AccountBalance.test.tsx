import { AccountBalance } from "./AccountBalance";
import { mockImplicitAccount } from "../mocks/factories";
import { render, screen } from "../mocks/testUtils";
import { assetsActions } from "../utils/redux/slices/assetsSlice";
import { store } from "../utils/redux/store";
import { TzktAccount } from "../utils/tezos";

describe("<AccountBalance />", () => {
  it("renders nothing if there is no balance for an account", () => {
    render(<AccountBalance address={mockImplicitAccount(0).address.pkh} />);
    expect(screen.queryByTestId("account-balance")).not.toBeInTheDocument();
  });

  it("renders the balance for an account", () => {
    store.dispatch(
      assetsActions.updateAccountStates([
        { address: mockImplicitAccount(0).address.pkh, balance: 1234567 },
        { address: mockImplicitAccount(1).address.pkh, balance: 9234567 },
      ] as TzktAccount[])
    );
    render(<AccountBalance address={mockImplicitAccount(0).address.pkh} />);
    expect(screen.getByTestId("account-balance")).toHaveTextContent("1.234567");
  });
});
