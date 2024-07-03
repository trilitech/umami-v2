import { rawAccountFixture } from "@umami/core";
import { assetsActions, makeStore } from "@umami/state";
import { mockImplicitAddress } from "@umami/tezos";

import { AccountBalance } from "./AccountBalance";
import { render, screen } from "../mocks/testUtils";

describe("<AccountBalance />", () => {
  it("renders nothing if there is no balance for an account", () => {
    render(<AccountBalance address={mockImplicitAddress(0).pkh} />);
    expect(screen.queryByTestId("account-balance")).not.toBeInTheDocument();
  });

  it("renders the balance for an account", () => {
    const store = makeStore();
    store.dispatch(
      assetsActions.updateAccountStates([
        rawAccountFixture({ balance: 1234567 }),
        rawAccountFixture({ address: mockImplicitAddress(1).pkh, balance: 9234567 }),
      ])
    );
    render(<AccountBalance address={mockImplicitAddress(0).pkh} />, { store });
    expect(screen.getByTestId("account-balance")).toHaveTextContent("1.234567");
  });
});
