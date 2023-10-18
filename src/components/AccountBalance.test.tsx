import { mockImplicitAccount } from "../mocks/factories";
import { render, screen } from "../mocks/testUtils";
import { assetsActions } from "../utils/redux/slices/assetsSlice";
import store from "../utils/redux/store";
import { AccountBalance } from "./AccountBalance";

describe("<AccountBalance />", () => {
  it("renders nothing if there is no balance for an account", () => {
    render(<AccountBalance address={mockImplicitAccount(0).address.pkh} />);
    expect(screen.queryByTestId("account-balance")).not.toBeInTheDocument();
  });

  it("renders the balance for an account", () => {
    store.dispatch(
      assetsActions.updateTezBalance([
        { address: mockImplicitAccount(0).address.pkh, balance: 1234567 },
        { address: mockImplicitAccount(1).address.pkh, balance: 9234567 },
      ])
    );
    render(<AccountBalance address={mockImplicitAccount(0).address.pkh} />);
    expect(screen.getByTestId("account-balance")).toHaveTextContent("1.234567");
  });
});
